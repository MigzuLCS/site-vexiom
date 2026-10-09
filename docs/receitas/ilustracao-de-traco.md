# Ilustração de traço

Ilustrações de **traço** (linha única, sem preenchimento) feitas por código em SVG: folhas, grãos, objetos. Dão identidade e preenchem a página quando o cliente ainda não tem fotos. Com `Deriva`, flutuam suavemente ao rolar.

**Nível:** Contido (parado) / Expressivo (com `Deriva`) · **Depende de:** nada (`motion` só na `Deriva`) · **Origem:** `docs/repertorio/ilustracao-linha-fundo.md` (Pier88, Mont Rural, ACME)

```jsx
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

// Mesmo traço em todas as peças: é isso que as faz parecer da mesma mão.
function Traco({ children, viewBox, className = '', w = 2.5 }) {
  return (
    <svg aria-hidden="true" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  )
}

// Folha apontando para a direita (72×40). Gire com `rotate-*` no className.
const Folha = (p) => (
  <Traco viewBox="-2 -22 76 44" {...p}>
    <path d="M0 0C16-20 50-22 72 0C50 22 16 20 0 0Z" />
    <path d="M4 0H62M22 0L34-10M22 0L34 10M40 0L50-7M40 0L50 7" />
  </Traco>
)

// Grão de café (56×40).
const Grao = (p) => (
  <Traco viewBox="-2 -2 60 44" {...p}>
    <ellipse cx="28" cy="20" rx="26" ry="18" />
    <path d="M6 24C18 8 34 32 50 14" />
  </Traco>
)

// Xícara com pires e dois fios de vapor (140×150).
const Xicara = (p) => (
  <Traco viewBox="-2 -2 144 154" {...p}>
    <path d="M18 52H108V80C108 108 92 124 63 124C34 124 18 108 18 80Z" />
    <path d="M108 62H122C140 62 140 100 122 100H106" />
    <path d="M4 134H128C124 144 100 150 66 150C32 150 8 144 4 134Z" />
    <path d="M48 40C40 28 56 20 48 8M72 40C64 28 80 20 72 8" />
  </Traco>
)

// Flutua na vertical conforme a rolagem. Com "reduzir movimento", fica parada.
function Deriva({ children, de = 40, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [de, -de])
  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  )
}

// <Deriva de={50} className="absolute right-[6%] top-10 w-40 text-ink"><Folha className="w-full rotate-[-25deg]" /></Deriva>
```

**Cuidados**
- **Um traço só** (`w` igual, pontas redondas) e **uma cor** (`currentColor` herdando do texto). Misturar espessuras estraga a unidade.
- Sempre `aria-hidden`: é decoração. Não coloque informação dentro.
- Posicione com `absolute` e `pointer-events-none`; garanta que não cobre texto nem botões (z-index abaixo do conteúdo).
- Poucas peças, bem posicionadas, valem mais que muitas. No mobile, mostre menos (use `max-md:hidden` nas extras).
- Desenhe novas peças no mesmo estilo: curvas simples, poucos pontos, sem detalhes finos.
