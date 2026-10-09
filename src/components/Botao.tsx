import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// Botões da marca (em teste no laboratório: /laboratorio.html).
// Referências: 21st.dev Motion Button / Interactive Hover Button (preenchimento no hover),
// Neobrutalism Button / Pop Button (sombra dura), Shining Button + React Bits GlareHover (brilho).
// Tudo no eixo da logo: 26,6° de inclinação = diagonal de 63,4°.
export type Variante = 'cortina' | 'cursor' | 'sombra' | 'brilho'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { variante?: Variante; escuro?: boolean; forcar?: boolean }

const Seta = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className={cn('size-4 shrink-0', className)}>
    <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
  </svg>
)

export function Botao({ variante = 'cortina', escuro = false, forcar = false, className, children, ...props }: Props) {
  const base = 'group relative isolate inline-flex h-13 items-center gap-3 overflow-hidden px-7 text-base font-semibold select-none'
  const h = forcar ? 'is-forcado' : ''

  if (variante === 'cortina') {
    // laranja; no hover uma cortina Tinta entra na diagonal da marca e o texto inverte
    return (
      <a {...props} className={cn(base, h, 'bg-laranja text-tinta', className)}>
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-0 -left-1/4 -z-10 w-[150%] -translate-x-full -skew-x-[26.6deg] transition-transform duration-500 ease-vexiom group-hover:translate-x-0 group-focus-visible:translate-x-0 group-[.is-forcado]:translate-x-0',
            escuro ? 'bg-papel' : 'bg-tinta',
          )}
        />
        <span className={cn('transition-colors duration-300 group-hover:text-papel group-[.is-forcado]:text-papel', escuro && 'group-hover:text-tinta group-[.is-forcado]:text-tinta')}>
          {children}
        </span>
        <Seta className="transition-[transform,color] duration-500 ease-vexiom group-hover:translate-x-1 group-hover:text-laranja group-[.is-forcado]:translate-x-1 group-[.is-forcado]:text-laranja" />
      </a>
    )
  }

  if (variante === 'cursor') {
    // Tinta com o bloco laranja piscando como cursor; no hover o bloco cresce e vira o botão
    return (
      <a {...props} className={cn(base, h, 'pl-11', escuro ? 'bg-papel text-tinta' : 'bg-tinta text-papel', className)}>
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-laranja transition-[clip-path] duration-500 ease-vexiom [clip-path:inset(calc(50%-9px)_calc(100%-29px)_calc(50%-9px)_20px)] group-hover:[clip-path:inset(0)] group-focus-visible:[clip-path:inset(0)] group-[.is-forcado]:[clip-path:inset(0)] motion-safe:animate-[piscar_1.05s_steps(1)_infinite] group-hover:animate-none group-[.is-forcado]:animate-none"
        />
        <span className="transition-colors duration-300 group-hover:text-tinta group-[.is-forcado]:text-tinta">{children}</span>
        <Seta className="transition-transform duration-500 ease-vexiom group-hover:translate-x-1 group-hover:text-tinta group-[.is-forcado]:translate-x-1 group-[.is-forcado]:text-tinta" />
      </a>
    )
  }

  if (variante === 'sombra') {
    // sombra dura em Azul, separada por um vão (como o vão de 4 px do símbolo); afunda ao clicar
    return (
      <a
        {...props}
        className={cn(
          base,
          h,
          'overflow-visible border-2 transition-[transform,box-shadow] duration-300 ease-vexiom',
          escuro
            ? 'border-papel bg-laranja text-tinta shadow-[6px_6px_0_0_var(--color-papel)] hover:shadow-[10px_10px_0_0_var(--color-papel)] [&.is-forcado]:shadow-[10px_10px_0_0_var(--color-papel)]'
            : 'border-tinta bg-laranja text-tinta shadow-[6px_6px_0_0_var(--color-azul)] hover:shadow-[10px_10px_0_0_var(--color-azul)] [&.is-forcado]:shadow-[10px_10px_0_0_var(--color-azul)]',
          'hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none [&.is-forcado]:-translate-x-1 [&.is-forcado]:-translate-y-1',
          className,
        )}
      >
        <span>{children}</span>
        <Seta />
      </a>
    )
  }

  // brilho: faixa de luz na diagonal da marca atravessa o botão no hover
  return (
    <a {...props} className={cn(base, h, escuro ? 'bg-papel text-tinta' : 'bg-azul text-papel', className)}>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(116.6deg,transparent_40%,rgb(242_107_29/0.9)_50%,transparent_60%)] bg-size-[250%_100%] bg-position-[150%_0] transition-[background-position] duration-700 ease-vexiom group-hover:bg-position-[-50%_0] group-[.is-forcado]:bg-position-[50%_0]"
      />
      <span>{children}</span>
      <Seta className="text-laranja transition-transform duration-500 ease-vexiom group-hover:translate-x-1" />
    </a>
  )
}
