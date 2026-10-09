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
- Sem gradiente, sem sombra colorida.

## Tipografia
- **Red Hat Display** (Google Fonts): é a fonte do logotipo. Títulos em 600–700, texto em 400–500.
- Um segundo par só se houver motivo forte; o padrão é uma família só.

## Linguagem de movimento (o que torna o site "Vexiom")
As animações saem da logo, não de um catálogo genérico. Use estes gestos e evite o resto.

1. **Eixo diagonal 63,4°.** Revelações, cortinas e transições entre seções andam na diagonal da marca (máscaras `clip-path` com o mesmo ângulo), nunca de baixo para cima genérico.
2. **Entrelaçado.** Elementos que se cruzam passam *por cima e por baixo* com o vão de 4 px, como as barras do símbolo. Ex.: na abertura, as barras do símbolo entram deslizando cada uma pelo próprio eixo e se encaixam; no fim, o nome aparece.
3. **Cursor.** O quadrado laranja (pingo do i / bloco do símbolo) é um cursor: pisca (`steps`, ~1 s) enquanto um título "se digita", marca o item ativo de um menu, segue o foco. É o gesto-assinatura: "a gente constrói sites".
4. **Padrão de diagonais** como textura viva: desloca devagar com a rolagem (parallax leve) atrás de seções escuras.
5. **Ritmo:** 300–700 ms, `cubic-bezier(.2,.7,.1,1)`, escalonamento de 40–80 ms. Nada de bounce, elástico ou rotação gratuita.

Proibido: partículas, parallax em toda imagem, cursor próprio sem fallback, animação que esconde conteúdo quando o JS falha.
