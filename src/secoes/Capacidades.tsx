'use client'

import { useRef } from 'react'
import { gsap, useGSAP, REDUZIR } from '@/lib/gsap'
import { FaixaVelocidade } from '@/components/FaixaVelocidade'

// O que a gente constrói, ligado aos planos (Notion > Planos e preços).
const CAPACIDADES = [
  {
    nome: 'Landing page',
    texto: 'Uma página que resolve: botão de WhatsApp, mapa, horários e Google Meu Negócio configurado.',
    tecnologias: ['Vite', 'React'],
    plano: 'Essencial · até 7 dias',
  },
  {
    nome: 'Site institucional',
    texto: 'De 3 a 6 páginas, com blog e novidades. Você mesmo edita textos e fotos quando quiser.',
    tecnologias: ['WordPress'],
    plano: 'Profissional · até 21 dias',
  },
  {
    nome: 'Sob medida',
    texto: 'Agendamento, cardápio com pedidos, loja e área do cliente, com banco de dados.',
    tecnologias: ['WooCommerce', 'Integrações'],
    plano: 'Sob medida',
  },
  {
    nome: 'Aparecer no Google',
    texto: 'Quem procura perto de você encontra o seu negócio: perfil no Google Meu Negócio e SEO local.',
    tecnologias: ['Google Meu Negócio', 'SEO local'],
    plano: 'Perfil no Essencial · SEO local no Profissional',
  },
]

const FAIXA = [
  ['Vite', 'React', 'WordPress', 'WooCommerce', 'Google Meu Negócio', 'SEO local', 'Tailwind', 'GSAP'],
  ['WhatsApp', 'Mapa', 'Horários', 'Agendamento', 'Cardápio com pedidos', 'Loja', 'Blog', 'Área do cliente'],
]

// Lista de capacidades (referência: 21st.dev Super Hover List): no hover/foco uma faixa
// Tinta atravessa a linha na diagonal da marca e o texto inverte. Todo o conteúdo fica
// visível sem hover. Embaixo, a faixa de tecnologias que acelera com a rolagem e já
// prepara o escuro do portfólio.
export function Capacidades() {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(`not all and ${REDUZIR}`, () => {
        gsap.from('[data-cap-entra]', { opacity: 0, x: -10, y: 20, stagger: 0.08, scrollTrigger: { trigger: '[data-cap-entra]', start: 'top 85%' } })
        // linhas entram cortadas na diagonal, da esquerda
        gsap.fromTo('[data-cap-linha]', { clipPath: 'polygon(0% 0%, 0% 0%, -12% 100%, -12% 100%)' }, {
          clipPath: 'polygon(0% 0%, 112% 0%, 100% 100%, -12% 100%)',
          duration: 0.9,
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-cap-lista]', start: 'top 80%' },
          clearProps: 'clipPath',
        })
      })
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id="capacidades" className="relative z-10 bg-papel">
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-8 lg:pt-36 lg:pb-28">
        <p data-cap-entra className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-cinza uppercase">
          <span aria-hidden="true" className="h-3 w-1.5 bg-laranja" />
          Capacidades
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <h2 data-cap-entra className="max-w-[16ch] text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-bold tracking-tight">
            Do site de uma página ao sistema sob medida.
          </h2>
          <p data-cap-entra className="max-w-md text-lg leading-relaxed text-cinza lg:justify-self-end">
            Cada tipo de site tem a tecnologia certa por trás. Você não precisa escolher: a gente indica na conversa.
          </p>
        </div>

        <ol data-cap-lista className="mt-14 border-t border-tinta/15 lg:mt-20">
          {CAPACIDADES.map((c, i) => (
            <li
              key={c.nome}
              data-cap-linha
              className="group relative isolate border-b border-tinta/15 [--d:3.5rem]"
            >
              {/* faixa Tinta na diagonal: fechada à esquerda, abre no hover/foco */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-tinta transition-[clip-path] duration-500 ease-vexiom [clip-path:polygon(0_0,0_0,calc(var(--d)*-1)_100%,calc(var(--d)*-1)_100%)] group-hover:[clip-path:polygon(0_0,calc(100%+var(--d))_0,100%_100%,calc(var(--d)*-1)_100%)]"
              />
              <div className="grid gap-x-8 gap-y-3 px-1 py-7 transition-colors duration-300 group-hover:text-papel sm:px-4 lg:grid-cols-[3rem_1.4fr_1fr_12rem] lg:items-center lg:py-9">
                <span className="text-sm font-semibold text-cinza tabular-nums transition-colors group-hover:text-laranja">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    {c.nome}
                    <span aria-hidden="true" className="h-[0.6em] w-[0.3em] scale-y-0 bg-laranja transition-transform duration-300 ease-vexiom group-hover:scale-y-100" />
                  </h3>
                  <p className="mt-2 max-w-md leading-relaxed text-cinza transition-colors group-hover:text-papel/75">{c.texto}</p>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label="Tecnologias">
                  {c.tecnologias.map((t) => (
                    <li key={t} className="rounded-full px-3 py-1 text-sm font-medium ring-1 ring-tinta/20 transition-colors ring-inset group-hover:ring-papel/30">
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-semibold lg:text-right">{c.plano}</p>
              </div>
            </li>
          ))}
        </ol>
        <p data-cap-entra className="mt-8 max-w-2xl text-cinza">
          Em todos os planos: hospedagem, domínio, certificado de segurança, backup e até 4 alterações por mês na mensalidade.
        </p>
      </div>

      <FaixaVelocidade
        linhas={FAIXA}
        className="bg-tinta py-10 text-[clamp(2.25rem,6vw,5rem)] leading-[1.15] font-bold tracking-tight text-papel [&_[data-trilho]:nth-of-type(2)]:text-papel/35 sm:py-14"
      />
    </section>
  )
}
