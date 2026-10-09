import { useRef, useState } from 'react'
import { gsap, useGSAP, REDUZIR, MOVIMENTO } from '@/lib/gsap'
import { TextoRevelado } from '@/components/TextoRevelado'
import { cn } from '@/lib/utils'

const PASSOS = [
  { titulo: 'Conversa', texto: 'Você conta como funciona o seu negócio pelo WhatsApp. Sem formulário e sem termo técnico.' },
  { titulo: 'Prévia', texto: 'Em poucos dias você vê o site pronto no celular e pede os ajustes que quiser.' },
  { titulo: 'No ar', texto: 'Publicamos com domínio próprio e colocamos o seu negócio no Google. Depois, a gente cuida.' },
]

// Quem somos: apresentação + "o site se monta".
// No desktop a parte de baixo fica fixa enquanto a rolagem conduz a montagem de um site
// numa janela de navegador: rascunho tracejado (Conversa) → cores e imagem (Prévia) →
// endereço digitado e selo "no ar" (No ar). Referências: 21st.dev Sticky Content Wrapper,
// Scroll 01 e Safari mockup. No celular, a montagem toca uma vez ao entrar.
// Estado de repouso (sem JS / reduzir movimento) = site montado e os 3 passos visíveis.
export function QuemSomos() {
  const raiz = useRef<HTMLElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const [passo, setPasso] = useState<number | null>(null)

  useGSAP(
    () => {
      // três terços iguais, um por passo: 0–1 rascunho, 1–2 cores, 2–3 publicação
      const montagem = (tl: gsap.core.Timeline) =>
        tl
          .from('[data-esboco]', { scaleX: 0, transformOrigin: '0% 50%', stagger: 0.05, duration: 0.4 }, 0)
          // tracejado fica visível de 0 até as cores entrarem (repouso sem JS = sem tracejado)
          .fromTo('[data-esboco]', { borderColor: 'rgba(20,20,20,0.45)' }, { borderColor: 'rgba(20,20,20,0.45)', duration: 0.01 }, 0)
          .from('[data-cor]', { scaleX: 0, transformOrigin: '0% 50%', stagger: 0.04, duration: 0.4 }, 1)
          .to('[data-esboco]', { borderColor: 'rgba(20,20,20,0)', duration: 0.3 }, 1.5)
          .from('[data-url]', { clipPath: 'inset(0 100% 0 0)', duration: 0.5, ease: 'steps(18)' }, 2)
          .from('[data-cadeado]', { opacity: 0, duration: 0.15 }, 2.45)
          .from('[data-publicado]', { scale: 0, opacity: 0, duration: 0.3, ease: 'back.out(2)' }, 2.5)
          .to({}, { duration: 0.2 }, 2.8)

      const mm = gsap.matchMedia()
      mm.add(`(min-width: 1024px) and ${MOVIMENTO}`, () => {
        setPasso(0)
        montagem(
          gsap.timeline({
            defaults: { ease: 'vexiom' },
            scrollTrigger: {
              trigger: palco.current,
              start: 'top top+=96',
              end: '+=1600',
              pin: true,
              scrub: 0.6,
              onUpdate: (st) => setPasso(Math.min(2, Math.floor(st.progress * 3))),
            },
          }),
        )
        return () => setPasso(null)
      })
      mm.add(`(max-width: 1023px) and ${MOVIMENTO}`, () => {
        montagem(gsap.timeline({ defaults: { ease: 'vexiom' }, scrollTrigger: { trigger: '[data-janela]', start: 'top 75%' } }))
      })
      mm.add(`not all and ${REDUZIR}`, () => {
        gsap.from('[data-qs-entra]', { opacity: 0, x: -10, y: 20, stagger: 0.08, scrollTrigger: { trigger: '[data-qs-entra]', start: 'top 85%' } })
      })
    },
    { scope: raiz },
  )

  return (
    <section
      ref={raiz}
      id="quem-somos"
      className="relative z-10 bg-papel shadow-[0_-24px_48px_-36px_rgb(20_20_20/0.22)]"
    >
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-8 lg:pt-36">
        <p data-qs-entra className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-cinza uppercase">
          <span aria-hidden="true" className="h-3 w-1.5 bg-laranja" />
          Quem somos
        </p>
        <TextoRevelado
          texto="Somos a Vexiom, um estúdio de três sócios que cria sites para negócios: da loja do bairro ao sistema sob medida."
          className="mt-6 max-w-[22ch] text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-bold tracking-tight"
        />
        <p data-qs-entra className="mt-8 max-w-xl text-lg leading-relaxed text-cinza">
          A gente cuida de tudo: texto, visual, domínio, Google e as alterações do dia a dia. Você continua focado no seu negócio.
        </p>
      </div>

      <div ref={palco} className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-28 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:pb-0">
        <ol className="space-y-8 lg:py-16">
          {PASSOS.map((p, i) => {
            const ativo = passo === null || passo === i
            return (
              <li key={p.titulo} className={cn('flex gap-5 transition-opacity duration-500', ativo ? 'opacity-100' : 'opacity-35')}>
                <span
                  aria-hidden="true"
                  className={cn('mt-1 flex h-9 w-9 shrink-0 items-center justify-center text-sm font-bold transition-colors duration-500', ativo ? 'bg-tinta text-papel' : 'bg-tinta/10 text-tinta')}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{p.titulo}</h3>
                  <p className="mt-2 max-w-sm leading-relaxed text-cinza">{p.texto}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <Janela />
      </div>
    </section>
  )
}

// Janela de navegador com um site que se monta. Decorativa: aria-hidden.
function Janela() {
  const esboco = 'relative overflow-hidden border-[1.5px] border-dashed border-transparent'
  const cor = 'absolute inset-0'
  return (
    <div data-janela aria-hidden="true" className="relative overflow-hidden rounded-xl bg-[#fbfaf7] shadow-[0_30px_80px_-30px_rgb(20_20_20/0.35)] ring-1 ring-tinta/10">
      <div className="flex h-10 items-center gap-2 border-b border-tinta/10 px-4">
        <span className="size-2.5 rounded-full bg-tinta/15" />
        <span className="size-2.5 rounded-full bg-tinta/15" />
        <span className="size-2.5 rounded-full bg-tinta/15" />
        <div className="mx-auto flex h-6 w-56 items-center gap-1.5 rounded-full bg-tinta/5 px-3 text-[11px] text-cinza">
          <svg data-cadeado viewBox="0 0 12 12" className="size-3 shrink-0">
            <rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="currentColor" />
            <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span data-url className="whitespace-nowrap">seunegocio.com.br</span>
        </div>
      </div>

      <div className="relative space-y-7 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <span data-esboco className={cn(esboco, 'h-3.5 w-20')}><span data-cor className={cn(cor, 'bg-tinta')} /></span>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <span key={i} data-esboco className={cn(esboco, 'h-2 w-10')}><span data-cor className={cn(cor, 'bg-tinta/25')} /></span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1.15fr_1fr] items-center gap-6">
          <div className="space-y-3">
            <span data-esboco className={cn(esboco, 'block h-5 w-[92%]')}><span data-cor className={cn(cor, 'bg-tinta')} /></span>
            <span data-esboco className={cn(esboco, 'block h-5 w-[68%]')}><span data-cor className={cn(cor, 'bg-tinta')} /></span>
            <span data-esboco className={cn(esboco, 'mt-5 block h-2 w-full')}><span data-cor className={cn(cor, 'bg-tinta/20')} /></span>
            <span data-esboco className={cn(esboco, 'block h-2 w-[80%]')}><span data-cor className={cn(cor, 'bg-tinta/20')} /></span>
            <span data-esboco className={cn(esboco, 'mt-5 block h-8 w-28 rounded-full')}><span data-cor className={cn(cor, 'rounded-full bg-laranja')} /></span>
          </div>
          <span data-esboco className={cn(esboco, 'block aspect-[4/3] rounded-md')}>
            <span data-cor className={cn(cor, "bg-azul bg-[url('/brand/vexiom-padrao-azul.svg')] bg-cover")} />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['bg-[#ece7dd]', 'bg-azul', 'bg-[#ece7dd]'].map((c, i) => (
            <span key={i} data-esboco className={cn(esboco, 'block h-16 rounded-md')}><span data-cor className={cn(cor, c)} /></span>
          ))}
        </div>

        <span data-publicado className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-tinta px-3 py-1.5 text-xs font-semibold text-papel">
          <span className="h-2.5 w-[5px] bg-laranja" />
          No ar
        </span>
      </div>
    </div>
  )
}
