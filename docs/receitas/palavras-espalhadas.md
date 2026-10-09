# Palavras espalhadas

As palavras de um título ficam distribuídas na grade, em colunas e alturas diferentes, formando uma colagem tipográfica em vez de um bloco de texto. Cada palavra se revela de dentro de uma "janela" própria. Não precisa de foto.

**Nível:** Expressivo · **Depende de:** `motion` · **Origem:** observada em Mont Rural (ver `docs/repertorio/titulo-palavras-espalhadas.md`)
**Mobile e "reduzir movimento":** as palavras viram um título normal, em linhas, sem animação.

```jsx
import { motion, useReducedMotion } from 'motion/react'

// itens: [{ t: 'Café', col: '1 / span 4', row: 1, dy: '0rem', className: 'text-accent' }, ...]
// col e dy valem no desktop (md:). No mobile o título corre em linhas, na ordem do HTML.
function PalavrasEspalhadas({ itens, as: Tag = 'h2', className = '', ...props }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[Tag]
  const palavra = (it) => (reduce ? it.t : (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className="block"
        variants={{ hidden: { y: '108%' }, show: { y: '0%', transition: { duration: 0.85, ease: [0.2, 0.7, 0.2, 1] } } }}
      >
        {it.t}
      </motion.span>
    </span>
  ))
  const cell = (it, i) => (
    <span
      key={i}
      className={`inline-block max-md:mr-[0.25em] md:[grid-column:var(--c)] md:[grid-row:var(--r)] md:translate-y-[var(--dy)] ${it.className ?? ''}`}
      style={{ '--c': it.col, '--r': it.row, '--dy': it.dy ?? '0rem' }}
    >
      {palavra(it)}
    </span>
  )
  const base = `md:grid md:grid-cols-12 md:items-start ${className}`

  if (reduce) return <Tag className={base} {...props}>{itens.map(cell)}</Tag>
  return (
    <MotionTag
      className={base}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      {...props}
    >
      {itens.map(cell)}
    </MotionTag>
  )
}
```

**Cuidados**
- **O gatilho observa o título inteiro, nunca a palavra** (mesma regra de `texto-que-se-monta`): a palavra começa cortada pela janela e nunca dispararia sozinha.
- Mantenha a **ordem do HTML igual à ordem de leitura**; só a posição visual muda.
- **Um item = uma palavra.** No celular cada item é um bloco que não quebra de linha: um item com espaço ("no centro.") fica mais largo que a tela e causa rolagem horizontal (aconteceu no piloto). Separe em palavras; frases só se couberem em 340px no tamanho de fonte do mobile.
- **O `dy` não pode invadir a linha de baixo.** Deslocar uma palavra para baixo (ex.: `2rem`) sem espaço sobre ela faz as letras se tocarem na linha seguinte (aconteceu no laboratório). Use `dy` pequeno (até ~0.5 da altura da linha) e confira a imagem.
- Se duas palavras do desktop ocupam a mesma linha da grade, confira se somam ≤ 12 colunas com o tamanho da fonte escolhido (teste em 1425px, a largura de 1440 com barra de rolagem).
- Use em no máximo 2 títulos da página (o hero e o fecho). Em todos, perde o efeito.
- Fontes gordas e curtas funcionam melhor; tracking apertado (`-0.02em`) e `leading-[0.9]`.
