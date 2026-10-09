# Texto que se monta

Cada palavra sobe de dentro de uma "janela" própria, em sequência. Dá peso a um título sem mexer no layout, porque o texto quebra normalmente em qualquer largura.

**Nível:** Expressivo · **Depende de:** `motion`

```jsx
import { motion, useReducedMotion } from 'motion/react'

function TextoQueSeMonta({ text, as: Tag = 'h2', accent = [], delay = 0, className = '', ...props }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[Tag]
  const words = text.split(' ')
  const isAccent = (word) => accent.includes(word.replace(/[.,;:!?]/g, ''))

  if (reduce) {
    return (
      <Tag className={className} {...props}>
        {words.map((word, i) => (
          <span key={i} className={isAccent(word) ? 'text-accent' : undefined}>{word}{' '}</span>
        ))}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, show: { transition: { delayChildren: delay, staggerChildren: 0.045 } } }}
      {...props}
    >
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
            <motion.span
              className={`inline-block ${isAccent(word) ? 'text-accent' : ''}`}
              variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] } } }}
            >
              {word}
            </motion.span>
          </span>{' '}
        </span>
      ))}
    </MotionTag>
  )
}

// <TextoQueSeMonta as="h1" id="hero-t" text="Tudo aqui é vegano." accent={['vegano']} className="..." />
```

**Cuidados**
- **O gatilho observa o título inteiro, nunca a palavra.** A palavra começa 100% dentro de uma janela com `overflow: hidden`; para o navegador ela está fora da tela, então um `whileInView` posto nela nunca dispara e o título fica invisível. (Esta receita já teve esse defeito: o `npm run check` agora reprova títulos cortados.)
- Com "reduzir movimento", o título vira texto comum, sem janelas nem animação.
- O `pb-[0.1em]` evita cortar descendentes (g, p, ç). Com `leading` muito apertado, aumente.
- Use em 1 título por tela, no máximo. Em todos os títulos vira ruído.
- Títulos longos (mais de ~10 palavras): reduza o atraso por palavra de `0.045` para `0.025`.
