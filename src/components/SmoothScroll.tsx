import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, prefereReduzir } from '@/lib/gsap'

let lenis: Lenis | null = null
let cortina: HTMLDivElement | null = null
let pulando = false
let navegandoAte = 0

// Verdadeiro logo depois de ir até uma seção por um link (o menu não deve se esconder).
export const emNavegacao = () => performance.now() < navegandoAte

// Trava e destrava a rolagem da página (menu de tela cheia, diálogos).
export function travarRolagem(travar: boolean) {
  document.documentElement.style.overflow = travar ? 'hidden' : ''
  if (travar) lenis?.stop()
  else lenis?.start()
}

// Rola até uma posição (suave com Lenis; nativo quando ele está desligado).
export function rolarPara(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.1, force: true })
  else window.scrollTo({ top: y, behavior: prefereReduzir() ? 'instant' : 'smooth' })
}

// Começo real de uma seção. Seção presa (pin) que já passou fica deslocada para o fim da
// área presa; o começo de verdade é o do invólucro (.pin-spacer) que o ScrollTrigger cria.
function topoDe(el: HTMLElement) {
  const pai = el.parentElement
  const alvo = pai?.classList.contains('pin-spacer') ? pai : el
  return alvo.getBoundingClientRect().top + window.scrollY
}

// Cortina diagonal (63,4°, a mesma do menu do celular): a borda da frente cobre a tela,
// a de trás revela. "frente"/"tras" vão de 0 a 1.
function pintarCortina(frente: number, tras: number) {
  if (!cortina) return
  const h = window.innerHeight
  const total = window.innerWidth + h / 2
  const a = frente * total
  const b = tras * total
  cortina.style.clipPath = `polygon(${b}px 0, ${a}px 0, ${a - h / 2}px ${h}px, ${b - h / 2}px ${h}px)`
}

// Vai até uma seção. Perto: rolagem suave. Longe: a rolagem passaria por cenas presas e
// animações ligadas à rolagem (trancos e efeitos fora de hora), então a cortina cobre a
// tela, a página pula direto e a cortina revela o destino já no estado certo.
export function irParaSecao(id: string) {
  const el = document.getElementById(id)
  if (!el || pulando) return
  const y = topoDe(el)
  navegandoAte = performance.now() + 1400
  history.replaceState(null, '', `#${id}`)
  const focar = () => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }
  if (!lenis || !cortina) {
    window.scrollTo({ top: y, behavior: 'instant' })
    focar()
    return
  }
  if (Math.abs(y - window.scrollY) < window.innerHeight * 1.2) {
    rolarPara(y)
    focar()
    return
  }
  pulando = true
  const borda = { frente: 0, tras: 0 }
  const pintar = () => pintarCortina(borda.frente, borda.tras)
  gsap
    .timeline({ onComplete: () => void (pulando = false) })
    .set(cortina, { visibility: 'visible' })
    .to(borda, { frente: 1, duration: 0.32, ease: 'power2.in', onUpdate: pintar })
    .add(() => {
      lenis?.scrollTo(y, { immediate: true, force: true })
      ScrollTrigger.update()
      // animações com scrub alcançam a posição nova de uma vez, por baixo da cortina
      for (const st of ScrollTrigger.getAll()) {
        const t = st.getTween() // 0 quando o gatilho não tem scrub
        if (t) t.progress(1)
      }
      focar()
    })
    .to(borda, { tras: 1, duration: 0.4, ease: 'vexiom', onUpdate: pintar }, '+=0.06')
    .set(cortina, { visibility: 'hidden' })
}

// Lenis dirigido pelo relógio do GSAP, para ScrollTrigger e rolagem andarem juntos.
// Com "reduzir movimento", não liga: fica a rolagem nativa do navegador (saltos instantâneos).
// Cliques em links "#secao" passam por irParaSecao.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    cortina = ref.current
    pintarCortina(0, 0)
    const clique = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]')
      const id = a?.getAttribute('href')?.slice(1)
      if (!id || !document.getElementById(id)) return
      e.preventDefault()
      // um quadro depois: o menu do celular fecha e destrava a rolagem antes do salto
      requestAnimationFrame(() => irParaSecao(id))
    }
    document.addEventListener('click', clique)

    let tick: ((time: number) => void) | null = null
    if (!prefereReduzir()) {
      lenis = new Lenis({ autoRaf: false })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }
    return () => {
      document.removeEventListener('click', clique)
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
      cortina = null
    }
  }, [])

  return (
    <>
      {children}
      <div ref={ref} data-cortina aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[45] bg-tinta" />
    </>
  )
}
