---
id: hero-video-fundo
categoria: hero
nivel: Expressivo
status: observada
confianca: alta
material: vídeo curto do lugar (10–15 s) + foto de reserva
fontes: [qissa.co.uk]
---
**O que é:** hero em tela cheia com vídeo em loop (mudo) por trás, escurecido, com o nome em serifa grande no centro e dois botões em pílula (cardápio, reservar).

**Visto em:** Qissa (restaurante indiano de Sevenoaks). Por código: um `canvas` de 1440×900 e um vídeo com autoplay e loop; nenhuma biblioteca de animação; 40 KB de JS no total. Na captura, o título (Cormorant Garamond, peso 330, ~120px) fica sobre o vídeo com película escura.

**Viabilidade:** depende de material real do cliente. O peso do vídeo é o risco: comprimir (≤ 2 MB), `poster` com a foto, `preload="metadata"`. Com "reduzir movimento", mostrar só o `poster`. Sem vídeo, não use.

**Para implementar:** `<video autoplay muted loop playsinline poster=...>`, camada escura com `bg-black/40`, texto por cima. Nenhuma biblioteca necessária.
