# Ferramentas do projeto

O que cada pessoa precisa ter na máquina para trabalhar no site, e o que é opcional.
Skills e plugins do Claude Code ficam na pasta do usuário (`~/.claude`), **não no repositório**:
cada colaborador instala os seus.

## Obrigatório
| O quê | Para quê | Como |
|---|---|---|
| Node 20.9+ e npm (mínimo do Next 16) | build e dev | `npm install`; `npm run dev` abre em `localhost:3000`; `npm run build` gera `out/`; `npm start` serve o `out/` |
| Chromium headless do Playwright | `npm run check` (testa 390 px, 1440 px e reduzir movimento) | `npx playwright install chromium-headless-shell` |

GSAP, Lenis, motion e o resto vêm pelo `npm install` (ver `package.json`). Não há skill de GSAP:
o conhecimento de movimento do projeto está em `src/lib/gsap.ts` (plugins, curva `vexiom`,
`MOVIMENTO`/`REDUZIR`) e nas receitas de `docs/receitas/`.

## Componentes prontos
- **React Bits**: não precisa de conta. `npx shadcn@latest add @react-bits/<Nome>-TS-TW`
  (registro já configurado em `components.json`).
- **21st.dev**: cada pessoa usa **a própria conta** (`npx @21st-dev/cli login`). O token fica em
  `~/.config/21st/auth.json`. **Nunca** coloque esse token no repositório, em `.env` ou em chat.
  Plano gratuito: 2 downloads de código por dia por conta, e tentativa que falha também conta.
  Siga o procedimento de `docs/componentes.md`.

## Skills do Claude Code (opcional, por usuário)
Instalação das skills do 21st: `npx @21st-dev/cli install-skill`.

| Skill | Usamos? | Para quê |
|---|---|---|
| `21st-cli-use` | sim | buscar componentes no catálogo do 21st (pesquisa e referência) |
| `21st-ui-build` | às vezes | construir uma seção usando o 21st como inspiração |
| `21st-ui-explore` | às vezes | comparar direções visuais antes de decidir |
| `21st-ui-review` | às vezes | revisão visual/acessibilidade de uma seção |
| `21st-ai`, `21st-registry`, `21st-design-sync`, `21st-video` | não | geração com IA paga, publicar no 21st, vídeo |

## Plugins do Claude Code (opcional)
- `playwright@claude-plugins-official`: navegar no site pelo Claude. O check do projeto **não**
  depende dele (usa `puppeteer-core` em `scripts/check.mjs`).

## Integrações (só para quem tem acesso)
- **Notion "Painel da Startup"**: preços, identidade visual, escopo das seções.
- Logo e gerador: pasta compartilhada `Vexiom/logo/` (fonte dos SVGs em `public/brand/`).
