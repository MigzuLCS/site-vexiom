import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, REDUZIR, prefereReduzir } from '@/lib/gsap'
import { travarRolagem } from '@/components/SmoothScroll'
import GlassSurface from '@/components/reactbits/GlassSurface'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
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

// Menu em pílula de vidro flutuante (estilo Liquid Glass): React Bits "GlassSurface".
// Um destaque em pílula desliza entre os itens (ideia do React Bits "PillNav"): segue o
// mouse e volta para a seção ativa, marcada também pelo bloco laranja da logo.
// Sobre seções escuras (data-escuro) o vidro escurece. Some ao rolar para baixo e volta
// ao rolar para cima. No celular, abre em tela cheia com uma cortina na diagonal da marca.
export function Menu() {
  const raiz = useRef<HTMLElement>(null)
  const lista = useRef<HTMLDivElement>(null)
  const pilula = useRef<HTMLSpanElement>(null)
  const painel = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const [ativa, setAtiva] = useState<string | null>(null)
  const [escuro, setEscuro] = useState(false)
  const [aberto, setAberto] = useState(false)

  // seção ativa, tema e esconder/mostrar ao rolar
  useGSAP(() => {
    for (const s of SECOES) {
      const el = document.getElementById(s.id)
      if (!el) continue
      ScrollTrigger.create({ trigger: el, start: 'top 45%', end: 'bottom 45%', onToggle: (st) => st.isActive && setAtiva(s.id) })
    }
    ScrollTrigger.create({
      trigger: document.getElementById('quem-somos') ?? document.body,
      start: 'top 45%',
      onLeaveBack: () => setAtiva(null),
    })
    for (const el of document.querySelectorAll<HTMLElement>('[data-escuro]')) {
      ScrollTrigger.create({ trigger: el, start: 'top 40px', end: 'bottom 40px', onToggle: (st) => setEscuro(st.isActive) })
    }
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (st) => {
        if (prefereReduzir()) return
        const esconder = st.direction === 1 && st.scroll() > 400
        gsap.to(raiz.current, { yPercent: esconder ? -140 : 0, duration: 0.4, overwrite: 'auto' })
      },
    })
  })

  // pílula de destaque: vai até um item (hover) ou volta para a seção ativa
  const moverPilula = (id: string | null) => {
    const p = pilula.current
    const link = id ? lista.current?.querySelector<HTMLElement>(`[data-item="${id}"]`) : null
    if (!p) return
    if (!link) {
      gsap.to(p, { opacity: 0, duration: 0.25 })
      return
    }
    const alvo = { x: link.offsetLeft, width: link.offsetWidth }
    if (gsap.getProperty(p, 'opacity') === 0) gsap.set(p, alvo)
    gsap.to(p, { ...alvo, opacity: 1, duration: prefereReduzir() ? 0 : 0.45, ease: 'vexiom' })
  }
  useEffect(() => moverPilula(ativa), [ativa])

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
    gsap.matchMedia().add({ movimento: `not all and ${REDUZIR}`, reduzido: REDUZIR }, (c) => {
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

  const tom = escuro || aberto ? 'escuro' : 'claro'

  return (
    <>
    <header ref={raiz} className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4">
      <GlassSurface
        width="100%"
        height={60}
        borderRadius={30}
        escuro={tom === 'escuro'}
        backgroundOpacity={tom === 'escuro' ? 0.35 : 0.45}
        brightness={tom === 'escuro' ? 40 : 60}
        saturation={1.4}
        className="relative z-10 mx-auto max-w-5xl transition-colors duration-300"
      >
        <nav aria-label="Principal" className="flex w-full items-center justify-between gap-4 pr-2 pl-5">
          <a href="#inicio" className="flex h-11 items-center" onClick={() => setAberto(false)}>
            <Logo rotulo="Vexiom, início" className={cn('h-6 w-auto transition-colors duration-300', tom === 'escuro' ? 'text-papel' : 'text-tinta')} />
          </a>

          <div ref={lista} className="relative hidden items-center md:flex" onPointerLeave={() => moverPilula(ativa)}>
            <span
              ref={pilula}
              aria-hidden="true"
              className={cn('pointer-events-none absolute top-1/2 left-0 h-9 -translate-y-1/2 rounded-full opacity-0', tom === 'escuro' ? 'bg-papel/12' : 'bg-tinta/7')}
            />
            {SECOES.map((s) => (
              <a
                key={s.id}
                data-item={s.id}
                href={`#${s.id}`}
                onPointerEnter={() => moverPilula(s.id)}
                aria-current={ativa === s.id ? 'true' : undefined}
                className={cn(
                  'relative flex h-11 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors duration-300',
                  tom === 'escuro' ? 'text-papel/75 hover:text-papel' : 'text-tinta/70 hover:text-tinta',
                  ativa === s.id && (tom === 'escuro' ? 'text-papel' : 'text-tinta'),
                )}
              >
                <span aria-hidden="true" className={cn('h-2.5 w-[5px] bg-laranja transition-[opacity,transform] duration-300', ativa === s.id ? 'opacity-100' : 'w-0 opacity-0')} />
                {s.nome}
              </a>
            ))}
          </div>

          <InteractiveHoverButton href={linkWhatsapp()} texto="Fale com a gente" tom={tom} className="hidden md:inline-flex" />

          <button
            ref={botao}
            type="button"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
            className={cn(
              'flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold md:hidden',
              tom === 'escuro' ? 'text-papel' : 'text-tinta',
            )}
          >
            {aberto ? 'Fechar' : 'Menu'}
            <span aria-hidden="true" className={cn('block h-3 w-1.5 bg-laranja transition-transform duration-300', aberto && 'translate-y-0.5 rotate-[26.6deg]')} />
          </button>
        </nav>
      </GlassSurface>
    </header>

      <div
        id="menu-celular"
        ref={painel}
        inert={!aberto}
        className="fixed inset-0 z-40 flex flex-col justify-end bg-tinta px-4 pt-24 pb-10 text-papel md:hidden"
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
        <div data-painel-item className="mt-10">
          <InteractiveHoverButton href={linkWhatsapp()} texto="Fale com a gente no WhatsApp" tamanho="lg" tom="escuro" className="w-full" onClick={() => setAberto(false)} />
        </div>
      </div>
    </>
  )
}
