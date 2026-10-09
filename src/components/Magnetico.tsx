import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, prefereReduzir } from '@/lib/gsap'

// Adaptado de React Bits "Magnet": o elemento é puxado em direção ao cursor quando ele
// chega perto e volta ao soltar. Mudanças: GSAP quickTo (sem re-render a cada movimento),
// só com mouse (no toque não faz sentido) e desligado com "reduzir movimento".
export function Magnetico({ children, alcance = 60, forca = 0.3 }: { children: ReactNode; alcance?: number; forca?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefereReduzir() || !matchMedia('(pointer: fine)').matches) return
    const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const perto = Math.abs(e.clientX - cx) < r.width / 2 + alcance && Math.abs(e.clientY - cy) < r.height / 2 + alcance
      x(perto ? (e.clientX - cx) * forca : 0)
      y(perto ? (e.clientY - cy) * forca : 0)
    }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => window.removeEventListener('pointermove', mover)
  }, [alcance, forca])

  return (
    <span ref={ref} className="inline-block will-change-transform">
      {children}
    </span>
  )
}
