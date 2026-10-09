---
id: snap-por-secao
categoria: scroll
nivel: Expressivo
status: observada
confianca: media
material: nenhum
fontes: [pier88coast.com, mont-rural.emblematica.agency]
---
**O que é:** a rolagem "encaixa" no início de cada seção (`scroll-snap`), dando ritmo de slides.

**Visto em:** Pier88 e Mont Rural. Detectado por código (`scroll-snap-type` ativo), **não confirmado visualmente** como parte da experiência.

**Viabilidade:** risco alto. **Conflita com o Lenis** (rolagem suave) e com seções mais altas que a tela, e atrapalha quem usa teclado ou "reduzir movimento". Se usado, só no desktop, só em seções do tamanho da tela e testado com o Lenis desligado. Na maioria dos sites, não vale a pena.

**Para implementar:** `scroll-snap-type: y proximity` (nunca `mandatory`) e `scroll-snap-align: start` nas seções; desativar no mobile.
