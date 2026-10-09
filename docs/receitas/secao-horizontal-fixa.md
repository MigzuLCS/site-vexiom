# Seção horizontal fixa

A seção "trava" na tela e, enquanto a pessoa rola para baixo, o conteúdo anda para o lado. Boa para 3–6 itens que pedem uma sequência: pratos da casa, etapas de um processo, projetos.

**Nível:** Expressivo · **Depende de:** `motion`
**Mobile e "reduzir movimento":** vira uma lista vertical comum.

```jsx
import { useCallback, useRef, useSyncExternalStore } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

function useMedia(query) {
  const subscribe = useCallback(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}

function Trilho({ items, render }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const n = items.length
  // Painéis de 70vw, espaço de 2rem entre eles e 3rem de margem em cada ponta.
  const x = useTransform(scrollYProgress, (p) => `calc(${-p} * (${n} * 70vw + ${n - 1} * 2rem + 6rem - 100vw))`)

  return (
    <div ref={ref} className="relative" style={{ height: `${n * 75}vh` }}>
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <motion.ul style={{ x }} className="flex gap-8 px-12">
          {items.map((item, i) => (
            <li key={i} className="w-[70vw] shrink-0">{render(item, i)}</li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}

function SecaoHorizontal({ items, render }) {
  const desktop = useMedia('(min-width: 768px)')
  const reduce = useReducedMotion()
  if (!desktop || reduce) {
    return <ul className="grid gap-14 px-5">{items.map((item, i) => <li key={i}>{render(item, i)}</li>)}</ul>
  }
  return <Trilho items={items} render={render} />
}
```

**Cuidados**
- O trilho e a lista ficam em componentes separados para o `useScroll` nunca observar um elemento que não existe.
- Não coloque o título da seção dentro do trilho: deixe-o antes, fora da parte fixa, ou fixo no canto do painel.
- Altura da seção (`n * 75vh`) controla a velocidade: mais alto, mais lento.
- O conteúdo de cada painel precisa caber em ~80% da altura da tela, inclusive em notebooks de 700px de altura. Foto 16:10 em painel de 70vw passa disso: use `w-[55vw]`, uma proporção mais baixa (2 / 1) ou `max-h-[65dvh]` na foto.
- O `body` usa `overflow-x: clip` (em `base.css`). Se trocar por `hidden`, o `sticky` para de funcionar.
