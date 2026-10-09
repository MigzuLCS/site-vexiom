# Sites estudados

Estudo de **técnicas**, nunca cópia de código, imagens ou layouts. Capturas ficam só no computador (`docs/repertorio/.capturas/`, fora do git). Dados lidos por código (bibliotecas, fontes, cores) são fatos; a leitura das capturas é interpretação nossa.

| site | data | por que foi escolhido | bibliotecas | JS | o que aprender |
|---|---|---|---|---|---|
| [qissa.co.uk](https://www.qissa.co.uk/) | 2026-10-08 | restaurante local pequeno (Awwwards) | nenhuma | 40 KB | vídeo de fundo + foto de comida + tipografia fazem o trabalho; faixa dourada de palavras; cabeçalho com dois botões |
| [pier88coast.com](https://pier88coast.com) | 2026-10-08 | restaurante de grife, composição ousada | GSAP, Lenis, Lottie | 321 KB | título em arco, objeto recortado com borda ondulada, doodles, lista fixa com troca de imagem |
| [mont-rural.emblematica.agency](https://mont-rural.emblematica.agency) | 2026-10-08 | hospedagem editorial | GSAP, ScrollTrigger, SplitType | 97 KB | título com palavras espalhadas, painéis sobrepostos, botânica em traço, CTA duplo fixo |
| [bestbeanbestcup.com.au](https://bestbeanbestcup.com.au) | 2026-10-08 | torrefação lúdica | Shopify | 1,5 MB | painéis de cor saturada por produto; padrão geométrico em tom sobre tom; mascote ilustrado |
| [acmecups.nz](https://acmecups.nz/) | 2026-10-08 | objeto de café, visual limpo | GSAP, ScrollTrigger, SplitText, Lottie, Swiper | 2,4 MB | contorno do produto em traço; lista de modelos em que o ativo destaca (muito pesado: não copiar o peso) |
| [lesaintgeorges.ch](https://lesaintgeorges.ch/) | 2026-10-08 | hotel (WordPress) | Swiper | 290 KB | só dados por código; **não revisado visualmente** |

## Lições da primeira rodada
- **O restaurante pequeno mais convincente é também o mais leve** (Qissa: 40 KB, sem bibliotecas). O impacto vem de vídeo, fotos de comida e tipografia, não de efeito. Isso reforça que o material real do cliente pesa mais do que a técnica.
- Os sites premiados mais pesados (ACME, Best Bean) são lojas virtuais. Para landing pages de negócios locais, o modelo útil é Qissa e Mont Rural.
- Limites da ferramenta: um site (Santioni Spirits) não abriu sem WebGL real e foi trocado; a primeira captura de Best Bean e ACME saiu coberta por popup (o script agora esconde popups reconhecidos pelo texto, e foi confirmado no Best Bean; **o ACME não foi refeito** e continua com captura coberta); a medida de "elementos que reagem à rolagem" só vê o que já está na primeira tela, então efeitos que disparam ao rolar não aparecem; "fonte" e "cor" são fatos lidos do código, mas a técnica por trás de um efeito (por exemplo, como o título em arco é feito) é interpretação.
