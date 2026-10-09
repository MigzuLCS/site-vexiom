'use client'

import { useEffect, useRef, useState } from 'react'
import NumberFlow from '@number-flow/react'
import { Check } from 'lucide-react'
import { gsap, useGSAP, REDUZIR, MOVIMENTO } from '@/lib/gsap'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { PLANOS, VAGAS_FUNDADOR, linkWhatsapp } from '@/conteudo'
import { cn } from '@/lib/utils'

type Tabela = 'fundador' | 'tabela'
const REAIS = { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 } as const

// Valor em reais. O HTML do build leva o número como texto (Google, prévia de link, sem JS);
// depois de montar, o NumberFlow assume e anima as trocas.
function Valor({ valor, className }: { valor: number; className?: string }) {
  const [vivo, setVivo] = useState(false)
  useEffect(() => setVivo(true), [])
  if (!vivo) return <span className={className}>{valor.toLocaleString('pt-BR', REAIS)}</span>
  return <NumberFlow value={valor} locales="pt-BR" format={REAIS} className={className} />
}

// Preços. Estrutura do 21st.dev "Pricing Section with Frequency Toggle" (efferd), refeita
// com a marca (sem o código do 21st: a cota do dia tinha acabado): chave em pílula, 3 planos
// com o do meio em destaque, números que rolam ao trocar (NumberFlow). A chave troca preço
// de fundador (−40%, poucas vagas) e de tabela. Fundo Azul com as listras diagonais do
// style guide, que deslizam devagar com a rolagem.
export function Precos() {
  const raiz = useRef<HTMLElement>(null)
  const [modo, setModo] = useState<Tabela>('fundador')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOVIMENTO, () => {
        gsap.fromTo('[data-precos-listras]', { backgroundPositionY: '0px' }, { backgroundPositionY: '-240px', ease: 'none', scrollTrigger: { trigger: raiz.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      mm.add(`not all and ${REDUZIR}`, () => {
        gsap.from('[data-precos-entra]', { autoAlpha: 0, x: -10, y: 20, stagger: 0.08, scrollTrigger: { trigger: raiz.current, start: 'top 70%' } })
        gsap.from('[data-plano]', { autoAlpha: 0, y: 48, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: '[data-planos]', start: 'top 80%' } })
      })
    },
    { scope: raiz },
  )

  const fundador = modo === 'fundador'

  return (
    <section ref={raiz} id="precos" data-escuro="" className="relative isolate overflow-hidden bg-azul text-papel">
      <div
        data-precos-listras
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[url('/brand/vexiom-padrao-azul.svg')] bg-[length:540px_540px] bg-repeat opacity-70"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,transparent_20%,rgb(30_58_95/0.85)_75%)]" />

      <div className="mx-auto max-w-6xl px-4 py-28 sm:px-8 lg:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <p data-precos-entra className="flex items-center justify-center gap-3 text-sm font-medium tracking-[0.18em] text-papel/65 uppercase">
            <span aria-hidden="true" className="h-3 w-1.5 bg-laranja" />
            Preços
          </p>
          <h2 data-precos-entra className="mt-6 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] font-bold tracking-tight">
            Criação mais uma mensalidade. Só isso.
          </h2>
          <p data-precos-entra className="mt-6 text-lg leading-relaxed text-papel/75">
            Você paga a criação do site uma vez. A mensalidade cobre hospedagem, domínio, segurança e as alterações do dia a dia.
          </p>
        </div>

        {/* chave Fundador ↔ Tabela */}
        <div data-precos-entra className="mt-10 flex flex-col items-center gap-4">
          <div role="radiogroup" aria-label="Tipo de preço" className="relative grid grid-cols-2 rounded-full bg-tinta/35 p-1 ring-1 ring-papel/15 ring-inset">
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-papel transition-transform duration-500 ease-vexiom',
                !fundador && 'translate-x-full',
              )}
            />
            {(['fundador', 'tabela'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={modo === m}
                onClick={() => setModo(m)}
                className={cn(
                  'relative z-10 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-300',
                  modo === m ? 'text-tinta' : 'text-papel/75 hover:text-papel',
                )}
              >
                {m === 'fundador' ? (
                  <>
                    Fundador <span className="rounded-full bg-laranja px-2 py-0.5 text-xs text-tinta">−40%</span>
                  </>
                ) : (
                  'Tabela'
                )}
              </button>
            ))}
          </div>
          <p className="flex items-center gap-2 text-sm text-papel/75">
            <span aria-hidden="true" className="h-3 w-1.5 bg-laranja" />
            Preço de fundador: só para os primeiros {VAGAS_FUNDADOR} clientes.
          </p>
        </div>

        <div data-planos className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-center">
          {PLANOS.map((p) => {
            const destaque = 'destaque' in p && p.destaque
            return (
              <article
                key={p.nome}
                data-plano
                className={cn(
                  'relative flex flex-col rounded-2xl p-7 sm:p-8',
                  destaque ? 'bg-papel text-tinta shadow-[0_40px_90px_-30px_rgb(0_0_0/0.6)] lg:py-11' : 'bg-tinta/30 ring-1 ring-papel/15 ring-inset backdrop-blur-[2px]',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{p.nome}</h3>
                    <p className={cn('mt-1 text-sm', destaque ? 'text-cinza' : 'text-papel/65')}>{p.tipo}</p>
                  </div>
                  {destaque && (
                    <span className="flex items-center gap-2 rounded-full bg-tinta px-3 py-1 text-xs font-semibold text-papel">
                      <span aria-hidden="true" className="h-2.5 w-[5px] bg-laranja" />
                      Recomendado
                    </span>
                  )}
                </div>

                <div className="mt-8">
                  <p className={cn('text-sm', destaque ? 'text-cinza' : 'text-papel/65')}>{p.aPartirDe ? 'Criação, a partir de' : 'Criação'}</p>
                  <p className="mt-1 flex items-baseline gap-3">
                    <Valor valor={fundador ? p.criacao.fundador : p.criacao.tabela} className="text-5xl font-bold tracking-tight tabular-nums" />
                    {fundador && (
                      <span className={cn('text-base line-through', destaque ? 'text-cinza' : 'text-papel/50')}>
                        {p.criacao.tabela.toLocaleString('pt-BR', REAIS)}
                      </span>
                    )}
                  </p>
                  <p className="mt-3 flex items-baseline gap-1 text-lg font-semibold">
                    + {p.aPartirDe && <span className="text-sm font-normal">a partir de</span>}
                    <Valor valor={fundador ? p.mensal.fundador : p.mensal.tabela} className="tabular-nums" />
                    <span className={cn('text-sm font-normal', destaque ? 'text-cinza' : 'text-papel/65')}>/mês</span>
                  </p>
                </div>

                <ul className={cn('mt-8 space-y-3 border-t pt-8', destaque ? 'border-tinta/10' : 'border-papel/15')}>
                  {p.itens.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check aria-hidden="true" className={cn('size-4 shrink-0', destaque ? 'text-laranja-escuro' : 'text-laranja')} strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                  <li className={cn('flex items-center gap-3 text-sm', destaque ? 'text-cinza' : 'text-papel/65')}>
                    <span aria-hidden="true" className="w-4" />
                    {p.prazo}
                  </li>
                </ul>

                <InteractiveHoverButton
                  href={linkWhatsapp(`Quero o plano ${p.nome} para o meu negócio`)}
                  texto={`Quero o ${p.nome}`}
                  tom={destaque ? 'solido' : 'escuro'}
                  className="mt-9 w-full"
                />
              </article>
            )
          })}
        </div>

        <div data-precos-entra className="mx-auto mt-14 grid max-w-4xl gap-6 text-sm leading-relaxed text-papel/70 sm:grid-cols-2">
          <p>
            <strong className="font-semibold text-papel">Em todos os planos:</strong> hospedagem, domínio, certificado de segurança (SSL), backup e até 4 alterações
            por mês (pedidos pequenos, como trocar texto, foto, preço ou horário). Resposta em até 2 dias úteis.
          </p>
          <p>
            <strong className="font-semibold text-papel">Preço de fundador:</strong> mensalidade travada por 12 meses, com contrato mínimo de 6. Em troca, o seu
            site entra no nosso portfólio e você deixa um depoimento e uma avaliação no Google. Criação paga em duas partes: metade no início, metade na entrega.
          </p>
        </div>
      </div>
    </section>
  )
}
