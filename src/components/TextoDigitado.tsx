'use client'

import { useEffect, useState, type ElementType } from 'react'
import { prefereReduzir } from '@/lib/gsap'
import { cn } from '@/lib/utils'

// Adaptado de React Bits "TextType" (uma frase, sem apagar).
// Mudanças: o cursor é o bloco laranja do símbolo; uma cópia invisível da frase inteira
// reserva o espaço desde o início e a digitação corre numa camada por cima, então nada pula;
// leitores de tela e buscadores leem a frase completa; com "reduzir movimento"
// a frase aparece pronta. O HTML do build traz a frase inteira (sem JS ela fica lá);
// com JS, o CSS esconde tudo menos a primeira palavra até a digitação começar
// (global.css, "primeiro quadro"); a digitação continua da primeira palavra.
type Props = {
  texto: string
  as?: ElementType
  className?: string
  atraso?: number
  velocidade?: { min: number; max: number }
}

// Espaço do cursor no fim da frase (0,44em = margem + largura do bloco), nas duas camadas:
// mantém a mesma quebra de linhas de quando o cursor ocupava esse lugar.
const Espaco = () => <span className="inline-block w-[0.44em]" />

export function TextoDigitado({ texto, as: Tag = 'span', className, atraso = 250, velocidade = { min: 16, max: 38 } }: Props) {
  // a primeira palavra (com o espaço) já vem pronta: aparece no primeiro quadro, antes do JS,
  // e a digitação continua dela (o título conta como "maior elemento" logo de cara, LCP)
  const pronta = texto.match(/^\S+\s*/)?.[0].length ?? 0
  const [n, setN] = useState(texto.length)
  const [digitando, setDigitando] = useState(false)

  useEffect(() => {
    if (prefereReduzir()) return
    setN(pronta)
    setDigitando(true)
  }, [texto, pronta])

  useEffect(() => {
    if (!digitando || n >= texto.length) return
    const espera = n === pronta ? atraso : velocidade.min + Math.random() * (velocidade.max - velocidade.min)
    const t = setTimeout(() => setN((v) => v + 1), espera)
    return () => clearTimeout(t)
  }, [n, digitando, texto, pronta, atraso, velocidade.min, velocidade.max])

  return (
    <Tag className={className} data-digitado="" data-digitando={digitando ? '' : undefined}>
      <span className="sr-only">{texto}</span>
      {/* camada invisível com a frase inteira: reserva o tamanho final, então o título nunca
          muda de altura enquanto digita (antes o parágrafo e o botão pulavam a cada quebra de
          linha). A digitação acontece na camada de cima, fora do fluxo. */}
      <span aria-hidden="true" data-digitado-visual="" className="relative block">
        <span className="invisible">
          {texto}
          <Espaco />
        </span>
        <span className="absolute inset-0">
          {texto.slice(0, pronta)}
          {/* antes do JS, o CSS esconde daqui em diante (global.css, "primeiro quadro") */}
          <span data-digitado-resto="">{texto.slice(pronta, n)}</span>
          {/* cursor sem largura no fluxo (margem negativa = a própria largura): não muda onde as
              linhas quebram */}
          <span
            data-digitado-resto=""
            className={cn(
              'mr-[-0.44em] ml-[0.06em] inline-block h-[0.82em] w-[0.38em] translate-y-[0.06em] bg-laranja align-baseline',
              n >= texto.length && 'animate-[piscar_1.05s_steps(1)_infinite]',
            )}
          />
          <span className="invisible">
            {texto.slice(n)}
            <Espaco />
          </span>
        </span>
      </span>
    </Tag>
  )
}
