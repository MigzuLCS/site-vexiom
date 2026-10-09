import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, REDUZIR, prefereReduzir } from '@/lib/gsap'
import { travarRolagem } from '@/components/SmoothScroll'
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

// Logo solta à esquerda; à direita, o menu em pílulas adaptado de React Bits "PillNav":
// trilha clara com borda fina e itens em texto, botão de contato sólido na ponta; no hover um círculo sobe de baixo e preenche a pílula
// enquanto o texto troca deslizando. O item ativo ganha o bloco laranja da logo embaixo
// (no original era uma bolinha). Sobre seções escuras (data-escuro) as cores se invertem.
// Tudo some ao rolar para baixo e volta ao rolar para cima. No celular, menu de tela
// cheia com cortina na diagonal da marca.
export function Menu() {
  const raiz = useRef<HTMLElement>(null)
  const trilha = useRef<HTMLUListElement>(null)
  const painel = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const hovers = useRef<(gsap.core.Timeline | null)[]>([])
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
        gsap.to(raiz.current, { yPercent: esconder ? -160 : 0, duration: 0.4, overwrite: 'auto' })
      },
    })
  })

  // geometria do círculo de cada pílula (mesma conta do PillNav) e a timeline de hover
  useEffect(() => {
    const montar = () => {
      trilha.current?.querySelectorAll<HTMLElement>('[data-pilula]').forEach((pilula, i) => {
        const circulo = pilula.querySelector<HTMLElement>('[data-circulo]')
        const rotulo = pilula.querySelector<HTMLElement>('[data-rotulo]')
        const rotuloHover = pilula.querySelector<HTMLElement>('[data-rotulo-hover]')
        if (!circulo) return
        const { width: w, height: h } = pilula.getBoundingClientRect()
        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        Object.assign(circulo.style, { width: `${D}px`, height: `${D}px`, bottom: `-${delta}px` })
        gsap.set(circulo, { xPercent: -50, scale: 0, transformOrigin: `50% ${D - delta}px` })
        gsap.set(rotulo, { y: 0 })
        gsap.set(rotuloHover, { y: h + 12, opacity: 0 })
        hovers.current[i]?.kill()
        hovers.current[i] = gsap
          .timeline({ paused: true, defaults: { duration: 2, ease: 'power3.out' } })
          .to(circulo, { scale: 1.2, xPercent: -50 }, 0)
          .to(rotulo, { y: -(h + 8) }, 0)
          .to(rotuloHover, { y: 0, opacity: 1 }, 0)
      })
    }
    montar()
    document.fonts?.ready.then(montar).catch(() => {})
    window.addEventListener('resize', montar)
    return () => window.removeEventListener('resize', montar)
  }, [])

  const entrar = (i: number) => {
    const tl = hovers.current[i]
    tl?.tweenTo(tl.duration(), { duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
  }
  const sair = (i: number) => hovers.current[i]?.tweenTo(0, { duration: 0.2, ease: 'power3.out', overwrite: 'auto' })

  // entrada: a trilha se abre a partir da direita (como o PillNav)
  useGSAP(() => {
    gsap.matchMedia().add(`not all and ${REDUZIR}`, () => {
      gsap.from('[data-menu-entra]', { opacity: 0, y: -12, stagger: 0.08, duration: 0.6, delay: 0.1 })
    })
  })

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

  const inv = escuro || aberto // cores invertidas
  return (
    <>
      <header ref={raiz} className="fixed inset-x-0 top-4 z-50 px-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a data-menu-entra href="#inicio" className="flex h-11 items-center" onClick={() => setAberto(false)}>
            <Logo rotulo="Vexiom, início" className={cn('h-7 w-auto transition-colors duration-300', inv ? 'text-papel' : 'text-tinta')} />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul
              data-menu-entra
              ref={trilha}
              className={cn(
                'flex h-[52px] items-stretch gap-0.5 rounded-full border p-1 backdrop-blur-sm transition-colors duration-300',
                inv ? 'border-papel/15 bg-tinta/70' : 'border-tinta/10 bg-papel/85',
              )}
            >
              {SECOES.map((s, i) => (
                <li key={s.id} className="flex">
                  <a
                    data-pilula
                    href={`#${s.id}`}
                    aria-current={ativa === s.id ? 'true' : undefined}
                    onMouseEnter={() => entrar(i)}
                    onMouseLeave={() => sair(i)}
                    onFocus={() => entrar(i)}
                    onBlur={() => sair(i)}
                    className={cn(
                      'relative inline-flex items-center overflow-hidden rounded-full px-[18px] text-sm leading-none font-semibold whitespace-nowrap transition-colors duration-300',
                      inv ? 'text-papel/75' : 'text-tinta/75',
                      ativa === s.id && (inv ? 'text-papel' : 'text-tinta'),
                    )}
                  >
                    <span data-circulo aria-hidden="true" className={cn('pointer-events-none absolute bottom-0 left-1/2 z-[1] block rounded-full', inv ? 'bg-papel' : 'bg-tinta')} />
                    <span className="relative z-[2] inline-block">
                      <span data-rotulo className="relative inline-block">
                        {s.nome}
                      </span>
                      <span data-rotulo-hover aria-hidden="true" className={cn('absolute top-0 left-0 z-[3] inline-block', inv ? 'text-tinta' : 'text-papel')}>
                        {s.nome}
                      </span>
                    </span>
                    {ativa === s.id && (
                      <span aria-hidden="true" className="absolute bottom-1 left-1/2 z-[4] h-2 w-1 -translate-x-1/2 bg-laranja" />
                    )}
                  </a>
                </li>
              ))}
              <li className="ml-1 flex">
                <InteractiveHoverButton href={linkWhatsapp()} texto="Fale com a gente" tom={inv ? 'solido-inverso' : 'solido'} className="h-full" />
              </li>
            </ul>
          </nav>

          <button
            ref={botao}
            type="button"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
            className={cn(
              'flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-300 lg:hidden',
              inv ? 'bg-papel text-tinta' : 'bg-tinta text-papel',
            )}
          >
            {aberto ? 'Fechar' : 'Menu'}
            <span aria-hidden="true" className={cn('block h-3 w-1.5 bg-laranja transition-transform duration-300', aberto && 'translate-y-0.5 rotate-[26.6deg]')} />
          </button>
        </div>
      </header>

      <div
        id="menu-celular"
        ref={painel}
        inert={!aberto}
        className="fixed inset-0 z-40 flex flex-col justify-end bg-tinta px-4 pt-24 pb-10 text-papel lg:hidden"
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
