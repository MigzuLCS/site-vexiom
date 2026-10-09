---
id: lista-sticky-troca-imagem
categoria: scroll
nivel: Expressivo
status: observada
confianca: media
material: uma imagem por item
fontes: [pier88coast.com, acmecups.nz]
---
**O que é:** título e **lista** ficam fixos na tela; conforme se rola, o item ativo ganha destaque (os outros esmaecem) e a imagem ao lado troca para a do item.

**Visto em:** Pier88 ("August by the sea": lista vertical de datas à direita do título, com o item ativo mais escuro e a foto ao lado) e ACME (lista de modelos em que um fica em negrito e os demais em cinza).

**Viabilidade:** alternativa à seção horizontal fixa, mais simples no celular (vira lista com foto). Peso: só `motion`. Cuidado com a altura da seção (mais itens, mais rolagem) e com "reduzir movimento" (mostrar todos).

**Para implementar:** contêiner alto com bloco `sticky top-0`; `useScroll` + `useTransform` para o índice ativo; troca de imagem por opacidade.
