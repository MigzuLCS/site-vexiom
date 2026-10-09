---
id: objeto-recortado-borda-ondulada
categoria: composicao
nivel: Expressivo
status: observada
confianca: media
material: foto de objeto recortada (PNG sem fundo)
fontes: [pier88coast.com]
---
**O que é:** um objeto recortado (prato, comida) sobrepõe a borda entre duas seções, e a seção de baixo começa com uma borda **ondulada** em vez de reta. Dá profundidade, como se o objeto estivesse sobre a mesa que separa as duas áreas.

**Visto em:** Pier88 Coast. Camarão no garfo sobre um prato, emergindo de uma onda branca que começa a segunda seção.

**Viabilidade:** exige recorte profissional dos produtos. O ganho visual é grande, mas sem esse material a técnica não existe. A borda ondulada sozinha (SVG ou `clip-path`) é fácil e funciona sem foto.

**Para implementar:** seção de baixo com `clip-path` ou máscara SVG ondulada no topo; imagem com `position: relative`, `z-index` e margem negativa para invadir a seção.
