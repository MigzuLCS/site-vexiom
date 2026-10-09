'use client'

import { useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { gsap, useGSAP, REDUZIR, MOVIMENTO } from '@/lib/gsap'
import { TextoRevelado } from '@/components/TextoRevelado'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Logo } from '@/components/Logo'
import { LISTRAS_AZUIS } from '@/components/fundos/listras'
import { SECOES } from '@/secoes/Menu'
import { EMAIL, INSTAGRAM, WHATSAPP, linkContato, linkEmail } from '@/conteudo'

// Ícone do Instagram em traço (o lucide v1 não tem mais ícones de marcas).
function IconeInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

// Contato + rodapé (Azul, as mesmas listras de Preços em parallax leve). Sem WhatsApp por
// enquanto: e-mail e Instagram. Quando houver número em conteudo.ts, o botão do WhatsApp
// aparece aqui na frente. O e-mail grande é link (mailto) e tem botão de copiar, porque
// muita gente não tem programa de e-mail configurado no computador.
export function Contato() {
  const raiz = useRef<HTMLElement>(null)
  const [copiado, setCopiado] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOVIMENTO, () => {
        gsap.fromTo('[data-contato-listras]', { y: 0 }, { y: -160, ease: 'none', scrollTrigger: { trigger: raiz.current, start: 'top bottom', end: 'bottom bottom', scrub: true } })
      })
      mm.add(`not all and ${REDUZIR}`, () => {
        gsap.from('[data-contato-entra]', { autoAlpha: 0, x: -10, y: 20, stagger: 0.08, scrollTrigger: { trigger: '[data-contato-entra]', start: 'top 85%' } })
      })
    },
    { scope: raiz },
  )

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2200)
    } catch {
      /* sem permissão de área de transferência: o e-mail continua visível para copiar à mão */
    }
  }

  return (
    <section ref={raiz} id="contato" data-escuro="" className="relative isolate overflow-hidden bg-azul text-papel">
      <div data-contato-listras aria-hidden="true" className="absolute inset-x-0 top-0 -bottom-[160px] -z-10 opacity-60 will-change-transform" style={{ backgroundImage: LISTRAS_AZUIS }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_40%,transparent_15%,rgb(30_58_95/0.9)_70%)]" />

      <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-8 lg:pt-36">
        <p data-contato-entra className="flex items-center gap-3 texto-legenda tracking-[0.18em] text-papel/65 uppercase">
          <span aria-hidden="true" className="h-3 w-1.5 bg-laranja" />
          Contato
        </p>
        <TextoRevelado
          texto="Vamos colocar o seu negócio na internet?"
          className="mt-6 max-w-[16ch] texto-display"
        />
        <p data-contato-entra className="mt-6 max-w-lg texto-corpo text-papel/75">
          Conta o que você precisa e como funciona o seu negócio. A gente responde com o plano certo para você.
        </p>

        <div data-contato-entra className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-3">
          <a
            href={linkEmail()}
            className="group font-display text-[clamp(1.5rem,4.5vw,3.25rem)] font-medium tracking-tight break-all decoration-laranja decoration-[3px] underline-offset-8 hover:underline focus-visible:underline"
          >
            {EMAIL}
          </a>
          <button
            type="button"
            onClick={copiar}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 ring-papel/25 transition-colors ring-inset hover:bg-papel/10"
          >
            {copiado ? <Check aria-hidden="true" className="size-4 text-laranja" /> : <Copy aria-hidden="true" className="size-4" />}
            {copiado ? 'Copiado' : 'Copiar e-mail'}
          </button>
          <span aria-live="polite" className="sr-only">
            {copiado ? 'E-mail copiado' : ''}
          </span>
        </div>

        <div data-contato-entra className="mt-8 flex flex-wrap gap-3">
          {WHATSAPP && <InteractiveHoverButton href={linkContato()} texto="Chamar no WhatsApp" tamanho="lg" tom="solido-inverso" />}
          <InteractiveHoverButton href={linkEmail()} texto="Mandar um e-mail" tamanho="lg" tom={WHATSAPP ? 'escuro' : 'solido-inverso'} />
          <a
            href={INSTAGRAM.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center gap-2.5 rounded-full px-7 font-semibold ring-1 ring-papel/25 transition-colors ring-inset hover:bg-papel/10"
          >
            <IconeInstagram className="size-5" />@{INSTAGRAM.usuario}
            <span className="sr-only">(abre o Instagram em outra aba)</span>
          </a>
        </div>
      </div>

      <footer className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-papel/15 px-4 py-8 text-sm text-papel/65 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <a href="#inicio" className="flex h-11 items-center">
          <Logo rotulo="Vexiom, voltar ao início" className="h-6 w-auto text-papel" />
        </a>
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {SECOES.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex h-11 items-center hover:text-papel">
                  {s.nome}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p>© {new Date().getFullYear()} Vexiom</p>
      </footer>
    </section>
  )
}
