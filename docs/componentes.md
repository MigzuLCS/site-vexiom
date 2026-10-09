# Componentes prontos: React Bits e 21st.dev

Componentes de fora são **ponto de partida, não produto final**. Entram no site só depois de adaptados à marca (`docs/marca.md`).

## Como instalar
O projeto já tem `components.json` (CLI do shadcn) com o registro do React Bits configurado.

```bash
# React Bits: sempre a variante TS + Tailwind (sufixo -TS-TW)
npx shadcn@latest add @react-bits/BlurText-TS-TW

# 21st.dev: a URL do registro aparece na página de cada componente ("Install")
npx shadcn@latest add "https://21st.dev/r/<autor>/<componente>"
```
- O arquivo cai em `src/components/` (React Bits) ou `src/components/ui/` (21st.dev, primitivos do shadcn).
- O CLI instala as dependências sozinho. **Confira o que entrou no `package.json`**: uma dependência nova de 100 KB (three, ogl, matter-js...) obriga a carregar o componente sob demanda (`React.lazy`).
- Se o CLI trocar a versão de um pacote que já existe (ex.: `motion`), confirme que o resto continua funcionando.

## Checklist de adaptação (antes do commit)
1. **Cores:** troque toda cor de fábrica pelos tokens da marca (`bg-papel`, `text-tinta`, `bg-laranja`, `bg-azul`, `text-cinza` ou `var(--color-*)`). Nada de roxo, neon ou degradê arco-íris. Componentes no padrão shadcn já herdam `primary`/`background`/etc. de `src/styles/global.css`.
2. **Fonte:** só Red Hat Display. Remova `font-*` de outras famílias.
3. **Ritmo:** troque as curvas e durações de fábrica pela curva `vexiom` (`ease: 'vexiom'` no GSAP, `ease-vexiom` no Tailwind, `[0.2, 0.7, 0.1, 1]` no motion), a não ser que o efeito precise de outra.
4. **GSAP:** importe de `@/lib/gsap`, não de `gsap`. Troque `useEffect` + `gsap.context` por `useGSAP`. Não registre plugins de novo.
5. **Reduzir movimento:** com `prefers-reduced-motion`, o componente mostra o estado final. Teste com `npm run check` (linha "reduzir").
6. **Mobile:** defina a versão simples (menos partículas, sem WebGL, sem hover).
7. **Acessibilidade:** texto dividido em letras/palavras mantém o original em `aria-label` (ou `sr-only`); decoração ganha `aria-hidden="true"`; botões ≥ 44 px.
8. **Limpeza:** remova props, variantes e textos de demonstração que não vamos usar. Componente de WebGL precisa liberar contexto ao desmontar.
9. **Registre abaixo.**

## Componentes em uso
| componente | origem | onde no site | dependências extras | adaptações |
|---|---|---|---|---|
| GradeDiagonal | React Bits ShapeGrid | fundo do hero | — | cores da marca, retina, deriva 63,4°, blocos laranja 1:2, cursor pela janela, para fora da tela |
| TextoDigitado | React Bits TextType | título do hero | — | cursor = bloco laranja, texto reserva espaço, frase completa para leitor de tela, reduzir movimento |
| Button | shadcn | base dos botões | radix-ui, cva | import do cn corrigido |

## Pesquisa no 21st.dev
As skills do 21st (`npx @21st-dev/cli install-skill`) e o CLI `21st` estão instalados para o usuário. Login uma vez com `npx @21st-dev/cli login` (abre o navegador; nada de chave na conversa).
- **Busca é gratuita:** `npx @21st-dev/cli search "<termo>" --type c --limit 10`. Fluxo: o Claude pesquisa e devolve uma lista curta de links; o usuário escolhe; o Claude instala.
- **Baixar código conta na cota diária** (plano gratuito: 2 por dia, renova 00:00 UTC = 21h de Brasília; `npx @21st-dev/cli usage`), seja por `21st get`, `21st add` ou pela URL do registro (`https://21st.dev/r/...` exige `api_key`). **Cada tentativa conta, mesmo se a instalação falhar depois.** Instale só o que o usuário escolheu.
- **Como instalar sem desperdiçar cota** (`21st add` não funciona no Windows: "spawn npx ENOENT"):
  1. Baixe o JSON **uma vez** para um arquivo, com o token do login (`~/.config/21st/auth.json`, campo `token`) em `API_KEY_21ST`, sem imprimir o token:
     `curl -s "https://21st.dev/r/<autor>/<slug>?api_key=$API_KEY_21ST" -o .check/<slug>.json`
  2. Confira se veio o componente (e não `retrieval_limit_reached`) e veja `registryDependencies`. Instale antes as que forem do shadcn oficial (`npx shadcn@latest add button`, gratuito) e retire-as do JSON: o CLI não resolve nomes como `shadcn/button`.
  3. `npx shadcn@latest add ./.check/<slug>.json --yes`
- O CLI do shadcn às vezes escreve `import { cn } from "cn"` e instala o pacote `cn` do npm (nada a ver com o projeto). Corrija para `@/lib/utils` e desinstale `cn`.
- **React Bits não tem cota**: quando houver equivalente lá, prefira.
- Não usar a geração por IA do 21st (`21st-ai`) sem o usuário pedir: gasta créditos.
