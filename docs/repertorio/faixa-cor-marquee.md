---
id: faixa-cor-marquee
categoria: ritmo
nivel: Contido
status: observada
receita: docs/receitas/marquee.md
confianca: alta
material: nenhum
fontes: [qissa.co.uk]
---
**O que é:** uma faixa de cor sólida e saturada (dourado) atravessando a página escura, com palavras em serifa itálica separadas por um ornamento (✦) que correm devagar.

**Visto em:** Qissa, entre a galeria e o cardápio. As palavras (Origin, Spice, Aroma, Texture, Taste, Craft, Gathering…) resumem o conceito da casa.

**Viabilidade:** alta, é só CSS. Já existe a receita `marquee`; a variação nova é a faixa de **cor cheia** como quebra de ritmo, com ornamento entre as palavras. As palavras precisam ser reais, curtas e do negócio.

**Para implementar:** receita `marquee` com `bg-accent text-deep` na faixa e `✦` como separador `aria-hidden`.
