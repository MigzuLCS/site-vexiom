import { useEffect, useRef } from 'react'
import { prefereReduzir } from '@/lib/gsap'

// Adaptado de React Bits "ShapeGrid" (variante quadrada, com rastro do cursor).
// Mudanças: cores da marca, nitidez em telas retina, a grade desliza no eixo da logo
// (1 para o lado a cada 2 para cima = 63,4°), barras laranja no desenho das barras do
// símbolo sobem pela mesma diagonal, e o cursor é lido na janela inteira
// (o conteúdo do hero fica por cima do canvas).

const TINTA = '20, 20, 20'
const LARANJA = '242, 107, 29'
const PAPEL = '245, 242, 236'

type Bloco = { x: number; y: number; v: number; escala: number; cheio: boolean; alfa: number }

export function GradeDiagonal({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Com "reduzir movimento": deriva bem lenta e sem rastro do cursor (decisão do usuário:
    // quem desliga as animações do Windows por desempenho ainda vê o fundo vivo).
    const lento = prefereReduzir()
    const ritmo = lento ? 0.25 : 1
    let w = 0
    let h = 0
    let cel = 56
    let blocos: Bloco[] = []
    const desloc = { x: 0, y: 0 }
    const acesas = new Map<string, number>()
    let alvo: string | null = null
    const rastro: string[] = []

    const novoBloco = (inicio: boolean): Bloco => {
      const escala = Math.random() < 0.2 ? 1.6 : 1
      // nascem embaixo (ou espalhados na primeira tela) e sobem para a direita
      const y = inicio ? Math.random() * h : h + cel * 2 + Math.random() * h * 0.5
      const x = Math.random() * (w + h * 0.5) - h * 0.5
      return { x, y, v: 18 + Math.random() * 34, escala, cheio: Math.random() < 0.55, alfa: 0.55 + Math.random() * 0.45 }
    }

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cel = w < 640 ? 40 : 56
      const total = Math.round(Math.min(14, Math.max(5, (w * h) / 90000)))
      blocos = Array.from({ length: total }, () => novoBloco(true))
    }

    const desenhar = () => {
      ctx.clearRect(0, 0, w, h)
      const ox = ((desloc.x % cel) + cel) % cel
      const oy = ((desloc.y % cel) + cel) % cel

      // células acesas pelo cursor
      for (const [chave, a] of acesas) {
        const [c, r] = chave.split(',').map(Number)
        ctx.fillStyle = `rgba(${LARANJA}, ${a * 0.16})`
        ctx.fillRect(c * cel + ox - cel, r * cel + oy - cel, cel, cel)
      }

      // grade
      ctx.strokeStyle = `rgba(${TINTA}, 0.07)`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = ox - cel; x <= w + cel; x += cel) {
        ctx.moveTo(Math.round(x) + 0.5, 0)
        ctx.lineTo(Math.round(x) + 0.5, h)
      }
      for (let y = oy - cel; y <= h + cel; y += cel) {
        ctx.moveTo(0, Math.round(y) + 0.5)
        ctx.lineTo(w, Math.round(y) + 0.5)
      }
      ctx.stroke()

      // barras laranja como as da logo: lados inclinados em 63,4°, pontas retas em cima
      // e embaixo; andam pelo próprio eixo e deixam um rastro que some
      for (const b of blocos) {
        const esp = cel * 0.32 // espessura horizontal da barra
        const alt = cel * 1.5 * b.escala
        const barra = (x: number, y: number, a: number) => {
          ctx.beginPath()
          ctx.moveTo(x, y + a)
          ctx.lineTo(x + esp, y + a)
          ctx.lineTo(x + esp + a / 2, y)
          ctx.lineTo(x + a / 2, y)
          ctx.closePath()
        }
        const rast = alt * 1.8
        const g = ctx.createLinearGradient(b.x, b.y + alt, b.x - rast / 2, b.y + alt + rast)
        g.addColorStop(0, `rgba(${LARANJA}, ${0.25 * b.alfa})`)
        g.addColorStop(1, `rgba(${LARANJA}, 0)`)
        ctx.fillStyle = g
        barra(b.x - rast / 2, b.y + alt, rast)
        ctx.fill()

        barra(b.x, b.y, alt)
        if (b.cheio) {
          ctx.fillStyle = `rgba(${LARANJA}, ${b.alfa})`
          ctx.fill()
        } else {
          ctx.strokeStyle = `rgba(${LARANJA}, ${b.alfa})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      // bordas somem no papel
      const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) / 2)
      v.addColorStop(0, `rgba(${PAPEL}, 0)`)
      v.addColorStop(1, `rgba(${PAPEL}, 0.9)`)
      ctx.fillStyle = v
      ctx.fillRect(0, 0, w, h)
    }

    const atualizarAcesas = () => {
      const metas = new Map<string, number>()
      if (alvo) metas.set(alvo, 1)
      rastro.forEach((k, i) => !metas.has(k) && metas.set(k, (rastro.length - i) / (rastro.length + 1)))
      for (const k of metas.keys()) if (!acesas.has(k)) acesas.set(k, 0)
      for (const [k, a] of acesas) {
        const prox = a + ((metas.get(k) ?? 0) - a) * 0.15
        if (prox < 0.01) acesas.delete(k)
        else acesas.set(k, prox)
      }
    }

    let raf = 0
    let antes = 0
    const quadro = (t: number) => {
      const dt = Math.min((t - (antes || t)) / 1000, 0.05)
      antes = t
      desloc.x += 6 * ritmo * dt
      desloc.y -= 12 * ritmo * dt
      for (let i = 0; i < blocos.length; i++) {
        const b = blocos[i]
        b.x += (b.v / 2) * ritmo * dt
        b.y -= b.v * ritmo * dt
        if (b.y < -cel * 3 || b.x > w + cel) blocos[i] = novoBloco(false)
      }
      atualizarAcesas()
      desenhar()
      raf = requestAnimationFrame(quadro)
    }

    const aoMover = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        alvo = null
        return
      }
      const ox = ((desloc.x % cel) + cel) % cel
      const oy = ((desloc.y % cel) + cel) % cel
      const k = `${Math.floor((x - ox + cel) / cel)},${Math.floor((y - oy + cel) / cel)}`
      if (k !== alvo) {
        if (alvo) rastro.unshift(alvo)
        if (rastro.length > 6) rastro.length = 6
        alvo = k
      }
    }

    medir()

    let visivel = true
    const iniciar = () => {
      if (visivel && !document.hidden && !raf) {
        antes = 0
        raf = requestAnimationFrame(quadro)
      }
    }
    const parar = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
      if (visivel) iniciar()
      else parar()
    })
    io.observe(canvas)
    const aoVisibilidade = () => (document.hidden ? parar() : iniciar())
    const ro = new ResizeObserver(medir)
    ro.observe(canvas)
    if (!lento) window.addEventListener('pointermove', aoMover, { passive: true })
    document.addEventListener('visibilitychange', aoVisibilidade)
    iniciar()

    return () => {
      parar()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', aoMover)
      document.removeEventListener('visibilitychange', aoVisibilidade)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />
}
