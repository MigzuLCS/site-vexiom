'use client'

import { useRef } from 'react'
import { gsap, useGSAP, REDUZIR } from '@/lib/gsap'
import { GradeDiagonal } from '@/components/fundos/GradeDiagonal'
import { TextoDigitado } from '@/components/TextoDigitado'
import { linkContato } from '@/conteudo'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Magnetico } from '@/components/Magnetico'

export function Hero() {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(`not all and ${REDUZIR}`, () => {
        gsap.from('[data-hero-fundo]', { autoAlpha: 0, duration: 1.2 })
        // entram na diagonal da marca: vêm de baixo-esquerda (1 para o lado a cada 2 na vertical)
        gsap.from('[data-hero-entra]', { autoAlpha: 0, x: -10, y: 20, stagger: 0.08, delay: 0.25 })
        // parallax de saída: o conteúdo recua e esmaece enquanto Quem somos sobe por cima
        const saida = { trigger: raiz.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('[data-hero-conteudo]', { yPercent: 30, scale: 0.94, opacity: 0.15, ease: 'none', scrollTrigger: saida })
        gsap.to('[data-hero-fundo]', { yPercent: 18, ease: 'none', scrollTrigger: saida })
      })
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id="inicio" className="relative isolate flex min-h-svh items-center overflow-hidden">
      <div data-hero-fundo data-primeiro-quadro className="absolute inset-0 -z-10">
        <GradeDiagonal />
        {/* área calma atrás do texto */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_55%,var(--color-papel)_20%,transparent_65%)] max-md:bg-[radial-gradient(ellipse_at_50%_45%,var(--color-papel)_25%,transparent_80%)]" />
      </div>

      <div data-hero-conteudo className="mx-auto w-full max-w-6xl origin-top-left px-4 pt-28 pb-16 sm:px-8">
        <p data-hero-entra data-primeiro-quadro className="text-sm font-medium tracking-[0.18em] text-cinza uppercase">
          Vexiom · estúdio de sites
        </p>
        <TextoDigitado
          as="h1"
          texto="Um site que traz clientes. Agora é simples."
          className="mt-5 block max-w-[14ch] text-[clamp(2.75rem,8vw,6.25rem)] leading-[0.95] font-bold tracking-tight text-balance"
        />
        <p data-hero-entra data-primeiro-quadro className="mt-7 max-w-xl text-lg leading-relaxed text-cinza sm:text-xl">
          A gente cria, publica e cuida do site do seu negócio. Você só responde os clientes no WhatsApp.
        </p>
        <div data-hero-entra data-primeiro-quadro className="mt-9 flex flex-wrap items-center gap-3">
          <Magnetico>
            <InteractiveHoverButton data-cta href="#precos" texto="Quero meu site" tamanho="lg" tom="solido" />
          </Magnetico>
        </div>
      </div>
    </section>
  )
}
