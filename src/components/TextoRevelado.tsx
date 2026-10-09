import { useMemo, useRef, type ElementType } from 'react'
import { gsap, useGSAP, MOVIMENTO } from '@/lib/gsap'
import { cn } from '@/lib/utils'

// Adaptado de React Bits "ScrollReveal": as palavras saem do desfoque e ganham opacidade
// conforme a rolagem. Mudanças: limpeza só dos próprios gatilhos (o original matava todos
// os ScrollTriggers da página ao desmontar), sem <p> dentro de <h2>, rotação inicial no
// eixo da marca, e com "reduzir movimento" o texto já aparece pronto.
// "fixar": no desktop o bloco pai fica preso enquanto as palavras se revelam (a pessoa
// não passa reto pela frase); no celular segue o comportamento normal.
type Props = { texto: string; as?: ElementType; className?: string; fixar?: boolean }

export function TextoRevelado({ texto, as: Tag = 'h2', className, fixar = false }: Props) {
  const ref = useRef<HTMLElement>(null)
  const palavras = useMemo(
    () =>
      texto.split(/(\s+)/).map((p, i) =>
        /^\s+$/.test(p) ? (
          p
        ) : (
          <span key={i} data-palavra className="inline-block">
            {p}
          </span>
        ),
      ),
    [texto],
  )

  useGSAP(
    () => {
      const de = { opacity: 0.12, filter: 'blur(4px)' }
      const para = { opacity: 1, filter: 'blur(0px)', ease: 'none', stagger: 0.05 }
      gsap.matchMedia().add({ desktop: `(min-width: 1024px) and ${MOVIMENTO}`, outro: `(max-width: 1023px) and ${MOVIMENTO}` }, (c) => {
        const el = ref.current
        if (!el) return
        const ps = el.querySelectorAll('[data-palavra]')
        if (fixar && c.conditions?.desktop && el.parentElement) {
          gsap
            .timeline({ scrollTrigger: { trigger: el.parentElement, start: 'top top', end: '+=900', pin: true, scrub: true } })
            .fromTo(el, { rotate: 1.5, transformOrigin: '0% 50%' }, { rotate: 0, ease: 'none', duration: 0.5 }, 0)
            .fromTo(ps, de, para, 0)
            .to({}, { duration: 0.6 }) // segura a frase pronta um pouco antes de soltar
          return
        }
        const gatilho = { trigger: el, start: 'top bottom-=15%', end: 'bottom center', scrub: true }
        gsap.fromTo(el, { rotate: 1.5, transformOrigin: '0% 50%' }, { rotate: 0, ease: 'none', scrollTrigger: { ...gatilho, start: 'top bottom' } })
        gsap.fromTo(ps, de, { ...para, scrollTrigger: gatilho })
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={cn(className)}>
      {palavras}
    </Tag>
  )
}
