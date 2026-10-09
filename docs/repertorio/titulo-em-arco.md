---
id: titulo-em-arco
categoria: tipografia
nivel: Expressivo
status: observada
confianca: media
material: foto de fundo
fontes: [pier88coast.com]
---
**O que é:** o título do hero acompanha uma curva (arco) sobre a foto, em vez de ficar numa linha reta.

**Visto em:** Pier88 Coast, "Coastal Summer Dining" em arco sobre o mar, com um objeto recortado (camarão no garfo) embaixo. A técnica usada (provavelmente texto em caminho SVG) **não foi verificada no código**.

**Viabilidade:** leve (SVG). Cuidados: leitura de tela (manter o texto real em `sr-only` ou no `aria-label`), quebra no mobile (reduzir o raio da curva) e contraste do texto sobre a foto.

**Para implementar:** `<svg><path id="arco" d="M..."/><text><textPath href="#arco">...</textPath></text></svg>`; animar `startOffset` com `motion` é opcional.
