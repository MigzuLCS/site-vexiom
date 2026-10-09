import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Adaptado de 21st.dev "Interactive Hover Button" (dillionverma).
// Mudanças: é um link (<a>), não <button>; largura pelo texto (o original fixava w-32);
// o ponto que cresce é o bloco laranja da logo (retângulo 1:2), parado (só o cursor do
// título pisca, para não competir); ao crescer vira o fundo laranja e o texto entra com a seta.
// Contorno é ring interno (não border): o laranja que cresce cobre tudo, sem sobrar aro.
// Tamanhos: "md" e "lg". Tom "claro"/"escuro" conforme o fundo; "solido" (Tinta) para a ação principal.
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  texto: string
  tamanho?: 'md' | 'lg'
  tom?: 'claro' | 'escuro' | 'solido' | 'solido-inverso'
}

export const InteractiveHoverButton = forwardRef<HTMLAnchorElement, Props>(
  ({ texto, tamanho = 'md', tom = 'claro', className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        'group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full font-semibold ring-1 ring-inset whitespace-nowrap transition-[background-color,box-shadow] delay-150 duration-200 hover:bg-laranja hover:ring-transparent focus-visible:bg-laranja focus-visible:ring-transparent',
        tamanho === 'md' ? 'h-11 pr-5 pl-9 text-sm' : 'h-14 pr-8 pl-12 text-sm',
        tom === 'claro' && 'bg-papel/70 text-tinta ring-tinta/15',
        tom === 'escuro' && 'bg-papel/10 text-papel ring-papel/25',
        tom === 'solido' && 'bg-tinta text-papel ring-transparent',
        tom === 'solido-inverso' && 'bg-papel text-tinta ring-transparent',
        className,
      )}
      {...props}
    >
      <span className="inline-block transition-[transform,opacity] duration-300 ease-vexiom group-hover:translate-x-12 group-hover:opacity-0 group-focus-visible:translate-x-12 group-focus-visible:opacity-0">
        {texto}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 text-tinta opacity-0 transition-[transform,opacity] duration-300 ease-vexiom group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        <span>{texto}</span>
        <ArrowRight className="size-4" />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1/2 -z-10 -translate-y-1/2 rounded-[1px] bg-laranja transition-all duration-400 ease-vexiom',
          'group-hover:top-0 group-hover:left-0 group-hover:h-full group-hover:w-full group-hover:translate-y-0 group-hover:scale-[1.8]',
          'group-focus-visible:top-0 group-focus-visible:left-0 group-focus-visible:h-full group-focus-visible:w-full group-focus-visible:translate-y-0 group-focus-visible:scale-[1.8]',
          tamanho === 'md' ? 'left-4 h-3 w-1.5' : 'left-6 h-4 w-2',
        )}
      />
    </a>
  ),
)
InteractiveHoverButton.displayName = 'InteractiveHoverButton'
