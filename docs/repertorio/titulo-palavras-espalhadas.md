---
id: titulo-palavras-espalhadas
categoria: tipografia
nivel: Contido
status: prototipada
receita: docs/receitas/palavras-espalhadas.md
confianca: alta
material: nenhum
fontes: [mont-rural.emblematica.agency]
---
**O que é:** as palavras de um título são distribuídas ao longo da largura da tela, com grandes vazios entre elas e **alturas diferentes** na mesma linha, formando uma colagem tipográfica em vez de um bloco de texto.

**Visto em:** Mont Rural. "Private Masia · Among the Vineyards · of Penedès" no hero e "we organise unforgettable stays in Catalonia" no fim, com cada palavra em posição própria e mistura de serifa reta e itálica (Playfair).

**Viabilidade:** alta e **não precisa de foto**, o que ajuda quando o cliente não tem material. No mobile, voltar para linhas normais. Cuidado: a ordem de leitura no HTML precisa continuar certa.

**Para implementar:** grid de 12 colunas, cada palavra num `<span>` com `justify-self`, `translate-y` e `col-start` próprios; combinar com a receita `texto-que-se-monta` para a entrada.
