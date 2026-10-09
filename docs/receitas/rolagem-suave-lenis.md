# Rolagem suave (Lenis)

A rolagem ganha inércia e fica macia. Sozinha não aparece; é a base que faz parallax, máscaras e seções fixas parecerem fluidas. Todo site Expressivo começa por ela.

**Nível:** Expressivo · **Depende de:** `lenis` (~5 KB), `motion`

```jsx
import { MotionConfig, useReducedMotion } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import './theme.css'

export default function Site() {
  const reduce = useReducedMotion()
  return (
    <MotionConfig reducedMotion="user">
      {!reduce && <ReactLenis root options={{ lerp: 0.1, anchors: true }} />}
      {/* ...resto do site */}
    </MotionConfig>
  )
}
```

```css
/* theme.css: o Lenis cuida das âncoras; a rolagem suave do CSS atrapalharia. */
html { scroll-behavior: auto; }
```

**Cuidados**
- Com "reduzir movimento", o Lenis nem é criado: a rolagem volta a ser a nativa.
- `useScroll` do `motion` e `animation-timeline: view()` continuam funcionando, porque o Lenis move a rolagem real da página.
- Elementos com rolagem própria (um acordeão alto, uma lista) precisam de `data-lenis-prevent`, senão a roda do mouse rola a página em vez deles.
- Durante a rolagem suave, o Lenis desliga cliques em iframes (o mapa). Parada a rolagem, o mapa volta a responder.
- Clique num link de âncora e confira se o título da seção não fica escondido sob o cabeçalho. Se ficar, use `anchors: { offset: -80 }` com a altura do cabeçalho.
- `lerp` entre 0.08 (mais macio) e 0.12 (mais firme). Abaixo de 0.07 parece que a página está "atrasada".
