import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, prefereReduzir } from '@/lib/gsap'

// Lenis dirigido pelo relógio do GSAP, para ScrollTrigger e rolagem andarem juntos.
// Com "reduzir movimento", não liga: fica a rolagem nativa do navegador.
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefereReduzir()) return
    const lenis = new Lenis({ anchors: true, autoRaf: false })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
  return children
}
