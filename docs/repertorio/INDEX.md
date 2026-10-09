# Repertório de técnicas

Índice compacto: leia só este arquivo e abra a nota de uma técnica (`<id>.md`) quando for usá-la. Os sites estudados estão em `SITES.md`.

**Status:** `observada` (vista num site, sem código testado) → `prototipada` (feita no laboratório (`src/laboratorio/` ou uma página de teste)) → `testada` (usada num site e aprovada no `check`) → `aposentada`.
**Regra:** técnica `observada` sem receita só entra num site com protótipo no laboratório, ou com o risco avisado ao usuário.

| id | técnica | categoria | nível | material | status | confiança | fontes |
|---|---|---|---|---|---|---|---|
| hero-video-fundo | Hero com vídeo em loop escurecido e nome em serifa | hero | Expressivo | vídeo | observada | alta | qissa.co.uk |
| faixa-cor-marquee | Faixa de cor cheia com palavras em itálico e ornamento (usa a receita `marquee`) | ritmo | Contido | — | observada | alta | qissa.co.uk |
| titulo-acento-italico | Trecho do título em itálico e cor de acento | tipografia | Contido | — | observada | alta | qissa, pier88, mont-rural |
| titulo-em-arco | Título do hero em arco sobre a foto | tipografia | Expressivo | foto | observada | média | pier88coast.com |
| titulo-palavras-espalhadas | Palavras do título espalhadas em alturas diferentes (colagem tipográfica). Receita: `palavras-espalhadas` | tipografia | Expressivo | — | prototipada | alta | mont-rural |
| objeto-recortado-borda-ondulada | Objeto recortado invadindo a seção seguinte, com borda ondulada | composição | Expressivo | recorte PNG | observada | média | pier88coast.com |
| ilustracao-linha-fundo | Ilustrações de traço (rabiscos, botânica) como identidade, sem depender de foto. Receita: `ilustracao-de-traco` | imagem | Contido | SVG | prototipada | alta | pier88, mont-rural, acmecups |
| lista-sticky-troca-imagem | Lista fixa em que o item ativo destaca e a imagem troca | scroll | Expressivo | 1 imagem/item | observada | média | pier88, acmecups |
| paineis-sobrepostos | Painel de cor sobreposto a uma foto, fora da grade | composição | Contido | — | observada | alta | mont-rural |
| cta-duplo-fixo | Dois botões em pílula fixos (principal cheio, secundário contornado) | conversão | Contido | — | observada | alta | mont-rural, qissa |
| blocos-de-cor-por-item | Painéis de cor saturada por produto, o item grande no centro | composição | Contido | foto/ilustração | observada | média | bestbeanbestcup.com.au |
| padrao-geometrico-tom-sobre-tom | Padrão de formas geométricas em tom sobre tom como fundo, sem foto. Receita: `padrao-geometrico` | imagem | Contido | — | prototipada | média | bestbeanbestcup.com.au |
| snap-por-secao | Rolagem que encaixa em cada seção (risco: conflita com Lenis) | scroll | Expressivo | — | observada | média | pier88, mont-rural |

## Técnicas já cobertas por receitas testadas
Não estão acima porque já têm código em `docs/receitas/`: texto que se monta, máscara de imagem, seção horizontal fixa, marquee, rolagem suave (Lenis) e cor entre seções.
