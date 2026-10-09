# Marca Vexiom

Fonte da verdade da identidade. O site aplica isto; não inventa cores, fontes ou versões da logo.

## Nome
- **Vexiom** (nome fantasia; "Vexiom Studio" quando precisar de contexto). Razão social sugerida: Vexiom Tecnologia LTDA.
- No logotipo o nome é **VEXiOM**: maiúsculas com o **"i" minúsculo**, cujo pingo é um **quadrado laranja**.
- **Sem slogan definido.** "Sites para o comércio local" foi rejeitado. Não invente outro na logo; frases de apoio vivem no texto do site.

## Logo (arquivos em `public/brand/`)
Gerados por `C:\Users\migue\Documents\Vexiom\logo\_gerador` (fonte da verdade: `vexiom-logo-V2.svg`). Não redesenhe; se precisar de outra versão, peça.

| Uso | Arquivo |
|---|---|
| Topo do site (fundo claro / escuro) | `vexiom-horizontal-claro.svg` / `vexiom-horizontal-negativo.svg` |
| Só o símbolo | `vexiom-simbolo-claro.svg` / `-negativo` / `-mono-preto` / `-mono-branco` |
| Só o nome | `vexiom-nome-claro.svg` / `-negativo` |
| Favicon | `vexiom-favicon.svg` + `vexiom-favicon-32.png` (fallback) + `vexiom-favicon-180.png` (apple-touch-icon) |
| Prévia de link (og:image) | gerar 1200×630 a partir de `vexiom-horizontal-negativo.svg` |
| Fundos | `vexiom-padrao-azul/tinta/papel.svg` (diagonais da marca) |

**Anatomia do símbolo:** um V, uma barra `\` que cruza o braço direito do V (forma o X) e uma segunda barra `\` paralela (fecha o M). As barras do meio e da direita **passam por baixo** da barra `/`, com um **vão de 4 px** recortado (é recorte real, não contorno branco). Embaixo à esquerda, um **bloco laranja**. Todas as diagonais têm o mesmo ângulo (**≈ 63,4°**, ou seja, anda 1 na horizontal a cada 2 na vertical) e a mesma espessura; as pontas são retas em cima e embaixo.

## Paleta
```css
:root {
  --tinta: #141414;        /* texto e logo */
  --papel: #F5F2EC;        /* fundo principal (off-white quente) */
  --laranja: #F26B1D;      /* ACENTO ÚNICO: bloco da logo, pingo do i, botão principal */
  --laranja-escuro: #C2410C; /* texto/link laranja pequeno sobre o papel (contraste 4,6) */
  --azul: #1E3A5F;         /* seções escuras e institucionais */
  --cinza: #6B6760;        /* texto secundário */
}
```
Regras:
- **Laranja é tempero**: bloco, pingo, botão principal e um ou outro destaque. A página é quase toda Tinta + Papel.
- **Azul substitui o preto, não soma**: uma seção escura é Azul *ou* Tinta.
- **Azul some sobre preto** (contraste ~1,9): nunca coloque elemento azul em fundo Tinta.
- Laranja normal sobre Papel tem contraste 2,7: só para formas e textos grandes. Texto pequeno laranja = `--laranja-escuro`.
- Gradientes, brilhos e fundos animados (ex.: os do React Bits) só com cores da paleta e em efeito de fundo, nunca atrás de texto pequeno. Nada de roxo, neon ou arco-íris.

## Tipografia
Definida no style guide do Figma ("Vexiom — Site", página 01 · Identidade Visual):
- **Red Hat Display** (fonte do logotipo): títulos (`h1`–`h3` já usam) e palavras/números de destaque (classe `font-display`: faixa de tecnologias, preços, e-mail grande, nomes dos passos).
- **Montserrat**: textos, botões, menu, rótulos e legendas (fonte padrão do `body`, `--font-sans`).
- As duas são auto-hospedadas via `@fontsource-variable` (nada de Google Fonts em tempo de execução).
- **Escala** (classes em `global.css`; use-as em vez de tamanhos soltos):
  | Classe | Guia | Celular → desktop | Onde |
  |---|---|---|---|
  | `texto-hero` | Hero, Red Hat Medium | 44 → 100 | só o título do hero |
  | `texto-display` | Display, Red Hat Medium | 40/46 → 72/80 | títulos de seção (frases de destaque) |
  | `texto-h1` | H1, Red Hat Medium | 32/38 → 48/56 | links do menu do celular |
  | `texto-h3` | H3, Red Hat SemiBold | 20/26 → 22/30 | nomes de passos, capacidades, projetos, planos, perguntas |
  | `texto-corpo` | Body, Montserrat Regular | 16/24 → 16/26 | parágrafos |
  | botões | Button, Montserrat SemiBold | 14/20 | `InteractiveHoverButton` |
  | `texto-legenda` | Caption, Montserrat Regular | 12/16 → 12/18 | rótulos de seção em caixa alta |
- O H2 do guia (32/40) não é usado: os títulos de seção do site são frases de destaque e ficam no Display. Sem Bold na Red Hat; destaques decorativos (faixa de tecnologias, preços, e-mail) usam Medium.

## Linguagem de movimento (o que torna o site "Vexiom")
O site é bem dinâmico e pode usar efeitos de biblioteca (GSAP, React Bits, 21st.dev). Os gestos abaixo saem da logo e são a **assinatura**: aparecem nos momentos-chave (abertura, transições, CTA) e dão unidade ao resto. Efeito de biblioteca entra recolorido e no ritmo da marca (`docs/componentes.md`).

1. **Eixo diagonal 63,4°.** Revelações, cortinas e transições entre seções andam na diagonal da marca (máscaras `clip-path` com o mesmo ângulo), nunca de baixo para cima genérico.
2. **Entrelaçado.** Elementos que se cruzam passam *por cima e por baixo* com o vão de 4 px, como as barras do símbolo. Ex.: na abertura, as barras do símbolo entram deslizando cada uma pelo próprio eixo e se encaixam; no fim, o nome aparece.
3. **Cursor.** O quadrado laranja (pingo do i / bloco do símbolo) é um cursor: pisca (`steps`, ~1 s) enquanto um título "se digita", marca o item ativo de um menu, segue o foco. É o gesto-assinatura: "a gente constrói sites".
4. **Padrão de diagonais** como textura viva: desloca devagar com a rolagem (parallax leve) atrás de seções escuras.
5. **Ritmo padrão:** 300–700 ms, curva `vexiom` = `cubic-bezier(.2,.7,.1,1)`, escalonamento de 40–80 ms. Sequências longas guiadas pela rolagem (scrub) podem durar o que a rolagem durar. Bounce, elástico e rotação só quando o efeito pedir, nunca como padrão.

Proibido: cursor próprio sem fallback, animação que esconde conteúdo quando o efeito falha, efeito que trava a rolagem no celular.
