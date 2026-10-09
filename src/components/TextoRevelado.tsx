import { useMemo, useRef, type ElementType } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOVIMENTO } from '@/lib/gsap'
import { cn } from '@/lib/utils'

// Adaptado de React Bits "ScrollReveal": as palavras saem do desfoque e ganham opacidade
// conforme a rolagem. Mudanças: limpeza só dos próprios gatilhos (o original matava todos
// os ScrollTriggers da página ao desmontar), sem <p> dentro de <h2>, rotação inicial no
// eixo da marca, e com "reduzir movimento" o texto já aparece pronto.
type Props = { texto: string; as?: ElementType; className?: string }

export function TextoRevelado({ texto, as: Tag = 'h2', className }: Props) {
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
      gsap.matchMedia().add(MOVIMENTO, () => {
        const el = ref.current
        if (!el) return
        const ps = el.querySelectorAll('[data-palavra]')
        // termina quando a base do texto chega ao meio da tela, ou no fim da página se ela
        // acabar antes (texto na última seção ficava preso no meio do efeito)
        const fim = () => Math.min(el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight / 2, ScrollTrigger.maxScroll(window) - 2)
        const gatilho = { trigger: el, start: 'top bottom-=15%', end: fim, scrub: true, invalidateOnRefresh: true }
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
