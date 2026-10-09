import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefereReduzir } from '@/lib/gsap'
import { cn } from '@/lib/utils'

// Adaptado de React Bits "ScrollVelocity": faixas de texto em loop que aceleram com a
// velocidade da rolagem e invertem o sentido quando a pessoa rola para cima. Mudanças:
// relógio do GSAP (o mesmo do Lenis) no lugar do motion, componente interno fora do render
// (o original recriava a faixa a cada render), pausa fora da tela, cópias escondidas do
// leitor de tela (ele lê a lista uma vez), separador = bloco laranja 1:2 da logo, e com
// "reduzir movimento" a faixa deriva a ¼ da velocidade sem reagir à rolagem.
type Props = { linhas: string[][]; velocidade?: number; className?: string }

export function FaixaVelocidade({ linhas, velocidade = 50, className }: Props) {
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = raiz.current
    if (!el) return
    const trilhos = [...el.querySelectorAll<HTMLElement>('[data-trilho]')]
    const reduzir = prefereReduzir()
    const base = velocidade * (reduzir ? 0.25 : 1)
    const pos = trilhos.map(() => 0)
    let fator = 1
    let sentido = 1
    let visivel = false

    const io = new IntersectionObserver(([e]) => (visivel = e.isIntersecting))
    io.observe(el)
    // velocidade da rolagem em px/s, lida a cada rolagem
    const leitor = reduzir ? null : ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top' })

    const tick = (_t: number, dt: number) => {
      if (!visivel || document.hidden) return
      const v = leitor?.getVelocity() ?? 0
      if (v > 20) sentido = 1
      else if (v < -20) sentido = -1
      fator += (1 + Math.min(Math.abs(v) / 250, 6) - fator) * 0.08
      trilhos.forEach((t, i) => {
        const largura = (t.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0
        if (!largura) return
        const lado = i % 2 ? -1 : 1
        pos[i] -= lado * sentido * base * fator * (dt / 1000)
        pos[i] = (((pos[i] % largura) + largura) % largura) - largura
        t.style.transform = `translate3d(${pos[i]}px,0,0)`
      })
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
      leitor?.kill()
    }
  }, [velocidade])

  return (
    <div ref={raiz} className={cn('overflow-hidden', className)}>
      <ul className="sr-only">
        {linhas.flat().map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {linhas.map((itens, i) => (
        <div key={i} data-trilho aria-hidden="true" className="flex w-max will-change-transform">
          {[0, 1, 2, 3].map((c) => (
            <span key={c} className="flex shrink-0 items-center">
              {itens.map((p) => (
                <span key={p} className="flex items-center">
                  <span className="px-[0.45em]">{p}</span>
                  <span className="h-[0.42em] w-[0.21em] bg-laranja" />
                </span>
              ))}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
