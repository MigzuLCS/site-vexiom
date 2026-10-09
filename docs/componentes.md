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
| — | — | — | — | — |

## MCP do 21st.dev (opcional)
O 21st.dev tem um servidor MCP que deixa o Claude buscar componentes no catálogo direto daqui (`npx @21st-dev/cli@latest init --client claude`). Precisa de uma chave de API criada em https://21st.dev/mcp, e buscar o código de componentes pelo MCP é pago no plano gratuito. Sem ele, basta colar a URL de instalação do componente na conversa.
