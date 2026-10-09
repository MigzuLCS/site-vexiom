# Catálogo de técnicas de movimento

**No site da Vexiom (nível Experimental) todas as receitas estão liberadas**, mas cada uma só entra se contar a ideia do site (veja `docs/marca.md`, "Linguagem de movimento"). As receitas usam React + `motion`; em HTML puro, traduza o gesto para GSAP ou Web Animations API.

Técnicas, não layouts. Cada receita resolve **um** gesto e funciona em qualquer composição. Escolha pelo conceito do site, não pela vontade de ter efeito: se a técnica não conta a ideia do `DIRECTION.md`, ela não entra.

| Receita | Nível mínimo | Peso extra | Bom para |
|---|---|---|---|
| [Texto que se monta](texto-que-se-monta.md) | Expressivo | `motion` | Títulos de seção, frase do hero |
| [Máscara de imagem](mascara-de-imagem.md) | Expressivo | `motion` | Fotos grandes, entrada do hero |
| [Seção horizontal fixa](secao-horizontal-fixa.md) | Expressivo | `motion` | Cardápio, etapas, portfólio (3–6 itens) |
| [Marquee](marquee.md) | Contido | nenhum (CSS) | Lista curta e real: pratos, serviços, bairros |
| [Rolagem suave (Lenis)](rolagem-suave-lenis.md) | Expressivo | ~5 KB | Base de qualquer site Expressivo |
| [Cor entre seções](cor-entre-secoes.md) | Contido | nenhum | Mudança de clima: dia → noite, sala → cozinha |
| [Palavras espalhadas](palavras-espalhadas.md) | Expressivo | `motion` | Título do hero e fecho em colagem tipográfica; **não precisa de foto** |
| [Ilustração de traço](ilustracao-de-traco.md) | Contido (parada) / Expressivo (com deriva) | nenhum / `motion` | Folhas, grãos e objetos em SVG; identidade **sem foto** |
| [Padrão geométrico](padrao-geometrico.md) | Contido | nenhum | Textura tom sobre tom atrás de uma seção, sem foto |

Limites por nível: Contido usa no máximo 1 técnica (só as de CSS). Expressivo usa 2–3, mais o Lenis. Experimental pode somar GSAP/WebGL, mas cada efeito precisa de fallback.

## Vindas do Site Maker
As receitas foram escritas no Site Maker. Ao ler: `theme.css` / `base.css` = a folha de estilos global deste site; `src/Foto.jsx` = componente de foto que mostra um placeholder honesto enquanto a imagem real não existe (cópia em `apoio/Foto.jsx`, para adaptar se for usar). "Nível mínimo" e "Limites por nível" não restringem este site (ele é Experimental), mas o peso de cada técnica continua contando para o limite de 350 KB.

## Regras comuns
- Envolva o site em `<MotionConfig reducedMotion="user">` (de `motion/react`). Com "reduzir movimento", o `motion` pula transformações e o conteúdo aparece no lugar.
- O estado final é o estado de repouso: sem JS, sem suporte ou com "reduzir movimento", tudo fica visível e legível.
- Anime `transform`, `opacity` e `clip-path`. Nunca `width`, `height`, `top` ou `margin`.
- No mobile, prefira a versão mais simples da técnica (a receita diz qual).
- Uma técnica nova que funcionou bem em um site? Vire receita aqui.
