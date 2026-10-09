import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, prefereReduzir } from '@/lib/gsap'

let lenis: Lenis | null = null

// Trava e destrava a rolagem da página (menu de tela cheia, diálogos).
export function travarRolagem(travar: boolean) {
  document.documentElement.style.overflow = travar ? 'hidden' : ''
  if (travar) lenis?.stop()
  else lenis?.start()
}

// Rola até uma posição (suave com Lenis; nativo quando ele está desligado).
export function rolarPara(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.1 })
  else window.scrollTo({ top: y, behavior: prefereReduzir() ? 'instant' : 'smooth' })
}

// Lenis dirigido pelo relógio do GSAP, para ScrollTrigger e rolagem andarem juntos.
// Com "reduzir movimento", não liga: fica a rolagem nativa do navegador.
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefereReduzir()) return
    lenis = new Lenis({ anchors: true, autoRaf: false })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])
  return children
}
