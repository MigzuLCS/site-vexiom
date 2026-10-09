---
id: paineis-sobrepostos
categoria: composicao
nivel: Contido
status: observada
confianca: alta
material: foto (opcional)
fontes: [mont-rural.emblematica.agency]
---
**O que é:** um painel de cor sólida com texto **sobrepõe parte de uma foto**, deslocado do alinhamento da grade, criando camadas em vez de colunas lado a lado.

**Visto em:** Mont Rural. Painel verde-oliva com uma lista ("para quem é") por cima do canto de uma foto interna; em outro trecho, texto em serifa clara num painel verde-escuro com a foto invadindo ao lado.

**Viabilidade:** CSS puro (grid com áreas sobrepostas). Sem foto, o painel sobrepõe um bloco de cor ou uma ilustração. No mobile, empilhar com leve sobreposição.

**Para implementar:** `grid` com as duas células na mesma área (`col-start` e `row-start` sobrepostos) e `z-index`; sombra pesada é proibida, use contraste de cor.
