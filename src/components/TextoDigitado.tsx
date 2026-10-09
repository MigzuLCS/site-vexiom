'use client'

import { useEffect, useState, type ElementType } from 'react'
import { prefereReduzir } from '@/lib/gsap'
import { cn } from '@/lib/utils'

// Adaptado de React Bits "TextType" (uma frase, sem apagar).
// Mudanças: o cursor é o bloco laranja do símbolo; o texto inteiro já ocupa o espaço
// desde o início (a parte ainda não digitada fica transparente), então nada pula;
// leitores de tela e buscadores leem a frase completa; com "reduzir movimento"
// a frase aparece pronta. O HTML do build traz a frase inteira (sem JS ela fica lá);
// com JS, o CSS a esconde até a digitação começar (global.css, "primeiro quadro").
type Props = {
  texto: string
  as?: ElementType
  className?: string
  atraso?: number
  velocidade?: { min: number; max: number }
}

export function TextoDigitado({ texto, as: Tag = 'span', className, atraso = 250, velocidade = { min: 16, max: 38 } }: Props) {
  const [n, setN] = useState(texto.length)
  const [digitando, setDigitando] = useState(false)

  useEffect(() => {
    if (prefereReduzir()) return
    setN(0)
    setDigitando(true)
  }, [texto])

  useEffect(() => {
    if (!digitando || n >= texto.length) return
    const espera = n === 0 ? atraso : velocidade.min + Math.random() * (velocidade.max - velocidade.min)
    const t = setTimeout(() => setN((v) => v + 1), espera)
    return () => clearTimeout(t)
  }, [n, digitando, texto, atraso, velocidade.min, velocidade.max])

  return (
    <Tag className={className} data-digitado="" data-digitando={digitando ? '' : undefined}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true" data-digitado-visual="">
        {texto.slice(0, n)}
        <span
          className={cn(
            'ml-[0.06em] inline-block h-[0.82em] w-[0.38em] translate-y-[0.06em] bg-laranja align-baseline',
            n >= texto.length && 'animate-[piscar_1.05s_steps(1)_infinite]',
          )}
        />
        <span className="text-transparent">{texto.slice(n)}</span>
      </span>
    </Tag>
  )
}
