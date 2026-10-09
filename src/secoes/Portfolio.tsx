'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { gsap, useGSAP, REDUZIR, MOVIMENTO } from '@/lib/gsap'
import { GradeDiagonal } from '@/components/fundos/GradeDiagonal'

// WebGL (ogl) só no desktop e só quando a seção chega perto: fora da primeira carga.
const Grainient = dynamic(() => import('@/components/Grainient'), { ssr: false })

// Projetos-modelo: negócios fictícios do Site Maker (nunca apresentar como clientes).
// Capturas em public/portfolio/ (geradas do build de cada site, 1440×900 e 390×844 @2x).
const PROJETOS = [
  {
    slug: 'forno-baixo',
    nome: 'Forno Baixo',
    tipo: 'Pizzaria de balcão',
    texto: 'Reserva de lugar pelo WhatsApp, a carta com os seis sabores e os horários da casa numa página só.',
  },
  {
    slug: 'psicologa-marina',
    nome: 'Marina Teixeira',
    tipo: 'Psicóloga clínica',
    texto: 'Primeira conversa por vídeo, sessões presenciais e online, perguntas frequentes e como chegar ao consultório.',
  },
  {
    slug: 'psicologa-jessica',
    nome: 'Jéssica Martins',
    tipo: 'Psicóloga clínica',
    texto: 'O mesmo briefing da Marina em outra direção: mais clássica, centrada e com a agenda em destaque.',
  },
]

// Portfólio (escuro). Fundo: gradiente animado da marca (React Bits Grainient, azul,
// tinta e um fio de laranja) com camada escura por cima, e a grade do hero voltando
// fraca. No desktop os projetos correm na horizontal enquanto a página rola (seção fixa);
// no celular, lista vertical com fundo parado; com "reduzir movimento" ou sem JS, grade.
export function Portfolio() {
  const raiz = useRef<HTMLElement>(null)
  const trilho = useRef<HTMLDivElement>(null)
  const [webgl, setWebgl] = useState(false)

  // liga o gradiente WebGL só no desktop e quando a seção está a menos de uma tela
  useEffect(() => {
    const el = raiz.current
    if (!el || !matchMedia('(min-width: 1024px)').matches) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setWebgl(true), { rootMargin: '100% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // o escuro chega com a rolagem: o fundo acende enquanto a seção sobe
      mm.add(`not all and ${REDUZIR}`, () => {
        gsap.fromTo('[data-port-fundo]', { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: raiz.current, start: 'top bottom', end: 'top top', scrub: true } })
      })
      mm.add(`(min-width: 1024px) and ${MOVIMENTO}`, () => {
        const secao = raiz.current
        const t = trilho.current
        if (!secao || !t) return
        t.setAttribute('data-horizontal', '')
        gsap.set(secao, { height: '100svh' })
        const distancia = () => t.scrollWidth - window.innerWidth
        const corrida = gsap.to(t, {
          x: () => -distancia(),
          ease: 'none',
          scrollTrigger: { trigger: secao, start: 'top top', end: () => `+=${distancia()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        })
        // o celular de cada projeto anda um pouco mais devagar que o card (profundidade)
        for (const cel of t.querySelectorAll('[data-port-celular]')) {
          gsap.fromTo(cel, { yPercent: 12 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: cel, containerAnimation: corrida, start: 'left right', end: 'right left', scrub: true } })
        }
        return () => t.removeAttribute('data-horizontal')
      })
      mm.add(`(max-width: 1023px) and ${MOVIMENTO}`, () => {
        for (const c of gsap.utils.toArray<HTMLElement>('[data-port-cartao]')) {
          gsap.from(c, { autoAlpha: 0, x: -10, y: 30, scrollTrigger: { trigger: c, start: 'top 85%' } })
        }
      })
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id="portfolio" data-escuro="" className="relative isolate overflow-hidden bg-tinta text-papel">
      <div data-port-fundo aria-hidden="true" className="absolute inset-0 -z-10">
        {/* base parada (celular, sem WebGL e enquanto o WebGL carrega) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgb(30_58_95/0.9),transparent_60%),radial-gradient(ellipse_at_85%_90%,rgb(242_107_29/0.22),transparent_55%)]" />
        {webgl && (
          <div className="absolute inset-0 max-lg:hidden">
            <Grainient color1="#1e3a5f" color2="#141414" color3="#c2410c" colorBalance={0.42} timeSpeed={0.18} warpSpeed={1.2} contrast={1.2} grainAmount={0.06} zoom={0.75} />
          </div>
        )}
        {/* camada escura: o gradiente fica de pano de fundo, o conteúdo na frente */}
        <div className="absolute inset-0 bg-tinta/60" />
        <div className="absolute inset-0 opacity-70 max-lg:hidden">
          <GradeDiagonal tom="escuro" />
        </div>
      </div>

      <div
        ref={trilho}
        className="mx-auto grid max-w-6xl gap-16 px-4 py-28 sm:px-8 lg:grid-cols-3 lg:gap-10 lg:py-36 data-[horizontal]:mx-0 data-[horizontal]:flex data-[horizontal]:h-full data-[horizontal]:w-max data-[horizontal]:max-w-none data-[horizontal]:items-center data-[horizontal]:gap-[6vw] data-[horizontal]:py-0 data-[horizontal]:pr-[8vw] data-[horizontal]:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]"
      >
        <header className="lg:col-span-3 [[data-horizontal]_&]:w-[30vw] [[data-horizontal]_&]:shrink-0">
          <p className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-papel/60 uppercase">
            <span aria-hidden="true" className="h-3 w-1.5 bg-laranja" />
            Portfólio
          </p>
          <h2 className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-bold tracking-tight">Projetos-<wbr />modelo.</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-papel/70">
            Sites que criamos para negócios fictícios, para mostrar o que dá para fazer. Os primeiros clientes entram aqui.
          </p>
        </header>

        {PROJETOS.map((p, i) => (
          <article key={p.slug} data-port-cartao className="[[data-horizontal]_&]:w-[min(58vw,62rem)] [[data-horizontal]_&]:shrink-0">
            <div className="relative pr-[12%] pb-[10%]">
              <figure className="overflow-hidden rounded-xl bg-papel shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7)] ring-1 ring-papel/15">
                <div aria-hidden="true" className="flex h-7 items-center gap-1.5 border-b border-tinta/10 px-3 lg:h-8">
                  <span className="size-2 rounded-full bg-tinta/15" />
                  <span className="size-2 rounded-full bg-tinta/15" />
                  <span className="size-2 rounded-full bg-tinta/15" />
                </div>
                <img
                  src={`/portfolio/${p.slug}-desktop.webp`}
                  alt={`Página inicial do projeto-modelo ${p.nome} no computador`}
                  width={1440}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[16/10] w-full object-cover object-top"
                />
              </figure>
              <img
                data-port-celular
                src={`/portfolio/${p.slug}-celular.webp`}
                alt={`Página inicial do projeto-modelo ${p.nome} no celular`}
                width={390}
                height={844}
                loading="lazy"
                decoding="async"
                className="absolute right-0 bottom-0 w-[24%] rounded-[1.1rem] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-[5px] ring-tinta"
              />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-sm font-semibold text-papel/55 tabular-nums">
                {String(i + 1).padStart(2, '0')} · {p.tipo}
              </p>
              <span className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ring-1 ring-papel/25 ring-inset">
                <span aria-hidden="true" className="h-2.5 w-[5px] bg-laranja" />
                Projeto-modelo
              </span>
            </div>
            <h3 className="mt-2 text-3xl font-bold tracking-tight">{p.nome}</h3>
            <p className="mt-3 max-w-xl leading-relaxed text-papel/70">{p.texto}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
