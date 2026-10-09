# Padrão geométrico tom sobre tom

Um padrão repetido de formas simples (círculos, meios-círculos), **num tom um pouco mais escuro (ou claro) que o fundo**, atrás do conteúdo, que some em degradê. Dá textura e identidade e não precisa de foto.

**Nível:** Contido · **Depende de:** nada · **Origem:** `docs/repertorio/padrao-geometrico-tom-sobre-tom.md` (Best Bean Best Cup)

```jsx
import { useId } from 'react'

// A cor vem do `color` do elemento: use um tom perto do fundo (ex.: `text-surface`).
// `fade`: 'baixo' some para baixo, 'cima' some para cima, 'nenhum' não some.
function PadraoGeo({ fade = 'baixo', className = '' }) {
  const id = useId()
  const mask = fade === 'nenhum' ? undefined : `linear-gradient(to ${fade === 'baixo' ? 'bottom' : 'top'}, #000 0%, transparent 88%)`
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} style={{ maskImage: mask, WebkitMaskImage: mask }}>
      <defs>
        <pattern id={id} width="112" height="112" patternUnits="userSpaceOnUse">
          <circle cx="26" cy="26" r="18" fill="currentColor" />
          <path d="M62 52A22 22 0 0 1 106 52Z" fill="currentColor" />
          <path d="M6 112V82A30 30 0 0 1 36 112Z" fill="currentColor" />
          <circle cx="82" cy="92" r="9" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// <section className="relative isolate overflow-hidden">
//   <PadraoGeo className="text-surface -z-10" />
//   ...conteúdo...
// </section>
```

**Cuidados**
- O padrão é **ruído**, não protagonista: o contraste com o fundo deve ser baixo (aprox. 1.1:1 a 1.3:1). Texto sobre ele continua com contraste AA contra o **fundo**, e isso é conferido sem o padrão.
- Use `isolate` na seção e `-z-10` no padrão, para ele nunca ficar por cima do conteúdo.
- Um padrão por página, em 1 ou 2 seções. Repetir em todas vira papel de parede.
- Muda o tamanho do `pattern` (112) para mudar a escala; formas diferentes pedem outro desenho, mas sempre simples.
