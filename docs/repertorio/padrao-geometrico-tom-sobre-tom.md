---
id: padrao-geometrico-tom-sobre-tom
categoria: imagem
nivel: Contido
status: prototipada
receita: docs/receitas/padrao-geometrico.md
confianca: media
material: nenhum
fontes: [bestbeanbestcup.com.au]
---
**O que é:** um padrão repetido de formas geométricas simples (círculos, meios-círculos, quartos) em **um tom um pouco mais claro ou escuro que o fundo**, atrás do conteúdo. Dá textura e identidade sem competir com o texto, e funciona sem foto.

**Visto em:** Best Bean Best Cup. Faixa de formas em tom sobre tom atrás do hero amarelo e dos painéis de produto, repetida em outras cores nas outras seções.

**Viabilidade:** alta e leve (SVG ou `background-image` com padrão em SVG; não precisa de JS). Cuidados: contraste do texto sobre o padrão, e fazer o padrão **desaparecer em degradê** (máscara) para não pesar. Combina com `ilustracao-linha-fundo` (traço) como alternativa mais sólida.

**Para implementar:** SVG com as formas em `currentColor` e `opacity` baixa, `aria-hidden`, como fundo de seção; máscara em degradê com `mask-image`.
