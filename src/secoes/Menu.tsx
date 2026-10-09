import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, REDUZIR, prefereReduzir } from '@/lib/gsap'
import { travarRolagem } from '@/components/SmoothScroll'
import { linkWhatsapp } from '@/conteudo'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/Logo'

export const SECOES = [
  { id: 'quem-somos', nome: 'Quem somos' },
  { id: 'capacidades', nome: 'Capacidades' },
  { id: 'portfolio', nome: 'Portfólio' },
  { id: 'precos', nome: 'Preços' },
  { id: 'contato', nome: 'Contato' },
]

// Menu fixo. O bloco laranja do símbolo marca a seção ativa e desliza entre os itens
// (ideia do React Bits "PillNav"). Sobre seções escuras (data-escuro) o menu inverte.
// Some ao rolar para baixo e volta ao rolar para cima. No celular, abre em tela cheia
// com uma cortina na diagonal da marca.
export function Menu() {
  const raiz = useRef<HTMLElement>(null)
  const bloco = useRef<HTMLSpanElement>(null)
  const painel = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const [ativa, setAtiva] = useState<string | null>(null)
  const [escuro, setEscuro] = useState(false)
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)

  // seção ativa, tema e esconder/mostrar ao rolar
  useGSAP(() => {
    for (const s of SECOES) {
      const el = document.getElementById(s.id)
      if (!el) continue
      ScrollTrigger.create({
        trigger: el,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (st) => st.isActive && setAtiva(s.id),
      })
    }
    ScrollTrigger.create({
      trigger: document.getElementById('quem-somos') ?? document.body,
      start: 'top 45%',
      onLeaveBack: () => setAtiva(null),
    })
    for (const el of document.querySelectorAll<HTMLElement>('[data-escuro]')) {
      ScrollTrigger.create({ trigger: el, start: 'top 32px', end: 'bottom 32px', onToggle: (st) => setEscuro(st.isActive) })
    }
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (st) => {
        setRolou(st.scroll() > 24)
        if (prefereReduzir()) return
        const esconder = st.direction === 1 && st.scroll() > 400
        gsap.to(raiz.current, { yPercent: esconder ? -100 : 0, duration: 0.35, overwrite: 'auto' })
      },
    })
  })

  // bloco desliza até o item ativo
  useEffect(() => {
    const b = bloco.current
    const link = raiz.current?.querySelector<HTMLElement>(`[data-item="${ativa}"]`)
    if (!b) return
    if (!link) {
      gsap.to(b, { opacity: 0, duration: 0.2 })
      return
    }
    const x = link.offsetLeft + 1
    if (gsap.getProperty(b, 'opacity') === 0) gsap.set(b, { x })
    gsap.to(b, { x, opacity: 1, duration: prefereReduzir() ? 0 : 0.5 })
  }, [ativa])

  // menu do celular: cortina diagonal
  const cortina = useRef<gsap.core.Timeline | null>(null)
  useGSAP(() => {
    const p = painel.current
    if (!p) return
    const borda = { e: 0 }
    const pintar = () => {
      const h = p.offsetHeight
      const w = p.offsetWidth
      const e = borda.e * (w + h / 2 + 8)
      p.style.clipPath = `polygon(${-h / 2}px 0, ${e}px 0, ${e - h / 2}px ${h}px, ${-h / 2}px ${h}px)`
    }
    pintar()
    const tl = gsap.timeline({ paused: true })
    const mm = gsap.matchMedia()
    mm.add({ movimento: `not all and ${REDUZIR}`, reduzido: REDUZIR }, (c) => {
      const d = c.conditions?.reduzido ? 0 : 1
      tl.clear()
        .to(borda, { e: 1, duration: 0.55 * d, ease: 'vexiom', onUpdate: pintar })
        .from('[data-painel-item]', { opacity: 0, x: -8, y: 16, stagger: 0.05, duration: 0.4 * d }, d ? '-=0.25' : 0)
    })
    cortina.current = tl
  })

  useEffect(() => {
    const tl = cortina.current
    if (!tl) return
    travarRolagem(aberto)
    if (aberto) {
      tl.timeScale(1).play()
      painel.current?.querySelector<HTMLElement>('a')?.focus()
    } else {
      tl.timeScale(1.6).reverse()
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botao.current?.focus()
      }
    }
    if (aberto) document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto])

  return (
    <header
      ref={raiz}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        rolou && !aberto && (escuro ? 'bg-tinta/80 backdrop-blur-md' : 'bg-papel/85 backdrop-blur-md'),
        rolou && !aberto && 'shadow-[0_1px_0_rgb(20_20_20/0.08)]',
      )}
    >
      <nav aria-label="Principal" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-8">
        <a href="#inicio" className="relative z-10 flex h-11 items-center" onClick={() => setAberto(false)}>
          <Logo rotulo="Vexiom, início" className={cn('h-7 w-auto transition-colors duration-300', escuro || aberto ? 'text-papel' : 'text-tinta')} />
        </a>

        <div className="relative hidden items-center gap-1 md:flex">
          <span
            ref={bloco}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-0 h-3 w-1.5 -translate-y-1/2 bg-laranja opacity-0"
          />
          {SECOES.map((s) => (
            <a
              key={s.id}
              data-item={s.id}
              href={`#${s.id}`}
              aria-current={ativa === s.id ? 'true' : undefined}
              className={cn(
                'flex h-11 items-center px-3 text-sm font-medium transition-colors duration-300',
                escuro ? 'text-papel/70 hover:text-papel' : 'text-cinza hover:text-tinta',
                ativa === s.id && (escuro ? 'text-papel' : 'text-tinta'),
              )}
            >
              {s.nome}
            </a>
          ))}
          <a href={linkWhatsapp()} className="ml-3 inline-flex h-11 items-center bg-laranja px-5 text-sm font-semibold text-tinta">
            Fale com a gente
          </a>
        </div>

        <button
          ref={botao}
          type="button"
          aria-expanded={aberto}
          aria-controls="menu-celular"
          onClick={() => setAberto((v) => !v)}
          className={cn(
            'relative z-10 flex h-11 items-center gap-2 px-1 text-sm font-semibold md:hidden',
            escuro || aberto ? 'text-papel' : 'text-tinta',
          )}
        >
          {aberto ? 'Fechar' : 'Menu'}
          <span aria-hidden="true" className={cn('block h-3 w-1.5 bg-laranja transition-transform duration-300', aberto && 'translate-y-0.5 rotate-[26.6deg]')} />
        </button>
      </nav>

      <div
        id="menu-celular"
        ref={painel}
        inert={!aberto}
        className="fixed inset-0 flex flex-col justify-end bg-tinta px-4 pt-24 pb-10 text-papel md:hidden"
      >
        <ul className="space-y-1">
          {SECOES.map((s) => (
            <li key={s.id} data-painel-item>
              <a
                href={`#${s.id}`}
                onClick={() => setAberto(false)}
                className="flex min-h-14 items-center gap-3 text-[clamp(2rem,9vw,2.75rem)] leading-none font-bold tracking-tight"
              >
                <span aria-hidden="true" className={cn('h-5 w-2.5 bg-laranja', ativa !== s.id && 'opacity-0')} />
                {s.nome}
              </a>
            </li>
          ))}
        </ul>
        <a
          data-painel-item
          href={linkWhatsapp()}
          onClick={() => setAberto(false)}
          className="mt-10 inline-flex h-13 items-center justify-center bg-laranja px-6 font-semibold text-tinta"
        >
          Fale com a gente no WhatsApp
        </a>
      </div>
    </header>
  )
}
