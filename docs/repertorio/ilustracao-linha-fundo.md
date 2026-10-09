---
id: ilustracao-linha-fundo
categoria: imagem
nivel: Contido
status: prototipada
receita: docs/receitas/ilustracao-de-traco.md
confianca: alta
material: ilustrações em SVG (feitas por código ou compradas)
fontes: [pier88coast.com, mont-rural.emblematica.agency, acmecups.nz]
---
**O que é:** ilustrações de **traço** (rabiscos, botânica, contorno do produto) espalhadas pela página ou como marca d'água atrás do conteúdo. Dão identidade e preenchem espaço sem depender de foto.

**Visto em:** Pier88 (doodles verdes de camarão, coquetel e peixe ao redor do prato), Mont Rural (folhas de figueira em traço sobre o verde, vinhedo em marca d'água no bege) e ACME (contorno de xícara e pires em cinza).

**Viabilidade:** **muito alta para o nosso caso**: SVG é leve, funciona sem foto e pode ser feito por código. Pede consistência de traço (mesma espessura e estilo em todas) e cuidado para não competir com o texto.

**Para implementar:** SVGs inline com `stroke="currentColor"`, posicionados com `absolute`; leve deriva com `motion` (`useScroll`) é opcional. Marcar como `aria-hidden`.
