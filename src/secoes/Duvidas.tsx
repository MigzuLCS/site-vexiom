'use client'

import { useId, useRef, useState } from 'react'
import { gsap, useGSAP, REDUZIR } from '@/lib/gsap'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { VAGAS_FUNDADOR, linkWhatsapp } from '@/conteudo'
import { cn } from '@/lib/utils'

// Respostas só com o que está no Notion (Planos e preços). Sem dado, sem pergunta.
const PERGUNTAS = [
  {
    p: 'Preciso entender de internet?',
    r: 'Não. Você conta como funciona o seu negócio pelo WhatsApp, sem formulário e sem termo técnico. A gente cuida do texto, do visual, do domínio e de colocar o site no Google.',
  },
  {
    p: 'Quanto tempo leva para o site ficar pronto?',
    r: 'O Essencial fica pronto em até 7 dias e o Profissional em até 21 dias. No Sob medida, o prazo depende do que o sistema precisa fazer e é combinado na conversa.',
  },
  {
    p: 'O que a mensalidade cobre?',
    r: 'Hospedagem, domínio, certificado de segurança (SSL), backup e até 4 alterações por mês. Pedidos respondidos em até 2 dias úteis.',
  },
  {
    p: 'Como funcionam as alterações?',
    r: 'São até 4 por mês e não acumulam. Uma alteração é um pedido pequeno, de até uns 30 minutos: trocar um texto, uma foto, um preço, um horário ou anunciar uma promoção. Página nova, seção nova ou funcionalidade nova são orçadas à parte.',
  },
  {
    p: 'Como é o pagamento?',
    r: 'A criação é paga em duas partes: metade no início e metade na entrega. A mensalidade é por Pix ou boleto, com vencimento fixo.',
  },
  {
    p: 'O que é o preço de fundador?',
    r: `É 40% de desconto para os primeiros ${VAGAS_FUNDADOR} clientes. A mensalidade fica travada por 12 meses, com contrato mínimo de 6. Em troca, o seu site entra no nosso portfólio e você deixa um depoimento e uma avaliação no Google.`,
  },
]

// Dúvidas (FAQ). Acordeão acessível (botão com aria-expanded + painel com aria-controls);
// a resposta fica no HTML mesmo fechada (busca e leitores de tela) e o painel abre por
// grid-template-rows. O ícone é o bloco laranja da logo: em pé = "+", deitado = "−".
export function Duvidas() {
  const raiz = useRef<HTMLElement>(null)
  const [aberta, setAberta] = useState<number | null>(0)
  const base = useId()

  useGSAP(
    () => {
      gsap.matchMedia().add(`not all and ${REDUZIR}`, () => {
        gsap.from('[data-duvidas-entra]', { autoAlpha: 0, x: -10, y: 20, stagger: 0.08, scrollTrigger: { trigger: raiz.current, start: 'top 75%' } })
        gsap.from('[data-pergunta]', { autoAlpha: 0, y: 24, stagger: 0.06, scrollTrigger: { trigger: '[data-perguntas]', start: 'top 80%' } })
      })
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id="duvidas" className="relative bg-papel">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-28 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-36">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p data-duvidas-entra className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-cinza uppercase">
            <span aria-hidden="true" className="h-3 w-1.5 bg-laranja" />
            Dúvidas
          </p>
          <h2 data-duvidas-entra className="mt-6 max-w-[12ch] text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-bold tracking-tight">
            Perguntas que todo mundo faz.
          </h2>
          <p data-duvidas-entra className="mt-6 max-w-sm text-lg leading-relaxed text-cinza">
            Não achou a sua? Pergunta direto pra gente.
          </p>
          <div data-duvidas-entra className="mt-8">
            <InteractiveHoverButton href={linkWhatsapp('Tenho uma dúvida sobre o site')} texto="Fale com a gente" tom="solido" />
          </div>
        </div>

        <ul data-perguntas className="border-t border-tinta/15">
          {PERGUNTAS.map((q, i) => {
            const aberto = aberta === i
            const id = `${base}-${i}`
            return (
              <li key={q.p} data-pergunta className="border-b border-tinta/15">
                <h3>
                  <button
                    type="button"
                    aria-expanded={aberto}
                    aria-controls={id}
                    onClick={() => setAberta(aberto ? null : i)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-lg font-semibold sm:text-xl"
                  >
                    {q.p}
                    <span aria-hidden="true" className="relative grid size-6 shrink-0 place-items-center">
                      <span className={cn('absolute h-[3px] w-4 transition-colors duration-300', aberto ? 'bg-laranja' : 'bg-tinta group-hover:bg-laranja')} />
                      <span
                        className={cn(
                          'absolute h-4 w-2 bg-laranja transition-transform duration-500 ease-vexiom',
                          aberto ? 'scale-x-[0.375] rotate-90' : 'group-hover:-skew-x-[26.6deg]',
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={id}
                  role="region"
                  aria-label={q.p}
                  inert={!aberto}
                  className={cn('grid transition-[grid-template-rows] duration-500 ease-vexiom', aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
                >
                  <div className="overflow-hidden">
                    <p className={cn('max-w-2xl pb-7 leading-relaxed text-cinza transition-opacity duration-500', aberto ? 'opacity-100' : 'opacity-0')}>{q.r}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
