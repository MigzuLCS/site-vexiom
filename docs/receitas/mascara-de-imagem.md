# Máscara de imagem

A foto se revela por um recorte que abre (de baixo para cima, da esquerda ou do centro), enquanto a imagem dentro dela assenta de um leve zoom. É o gesto clássico de site de restaurante e moda premiados.

**Nível:** Expressivo · **Depende de:** `motion`, `src/Foto.jsx`

```jsx
import { motion, useReducedMotion } from 'motion/react'
import Foto from '../../src/Foto.jsx'

const masks = {
  baixo: 'inset(100% 0% 0% 0%)',
  esquerda: 'inset(0% 100% 0% 0%)',
  centro: 'inset(50% 50% 50% 50%)',
}

function MascaraDeImagem({ from = 'baixo', className = '', ...foto }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: masks[from] }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      <Foto {...foto} />
    </motion.div>
  )
}

// <MascaraDeImagem from="esquerda" alt="o balcão visto da porta" ratio="4 / 5" busca="coffee shop counter" />
```

Para o zoom que assenta, passe ao `Foto` um `Img` animado:

```jsx
const ImgQueAssenta = (props) => (
  <motion.img initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }} {...props} />
)
// <MascaraDeImagem Img={ImgQueAssenta} alt="..." ratio="4 / 5" busca="..." />
```

**Cuidados**
- Na foto do hero (acima da dobra), troque `whileInView` por `animate` e passe `priority` ao `Foto`.
- `clip-path` em uma imagem com `inset(50%...)` começa invisível: nunca use em texto.
- Com "reduzir movimento", `initial={false}` mostra a foto inteira desde o início.
- Uma ou duas fotos por página com máscara. Em todas, perde o efeito.
