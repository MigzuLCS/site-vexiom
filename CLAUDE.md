# Site da Vexiom

Site institucional e portfólio da **Vexiom**, estúdio de 3 sócios que cria sites para negócios (do comércio local a sistemas sob medida). É a vitrine da empresa: **visual próprio, muito dinâmico e interativo**, no nível **Experimental**. Precisa provar, só de abrir, que a Vexiom sabe fazer o que vende.

> Este site NÃO segue o processo "Contido" dos sites de clientes (Site Maker). Aqui movimento e interação são o produto.

## Stack
- **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4.** Alias `@/` = `src/`. Exportação estática (`output: 'export'`): `npm run build` gera HTML pronto em `out/`, que hospeda em qualquer lugar. Quando precisar de servidor (formulário, área do cliente), tira o `export` em `next.config.ts`.
  - Esta versão do Next mudou APIs e convenções: antes de usar algo do Next, leia o guia em `node_modules/next/dist/docs/`.
  - Página em `src/app/page.tsx` (componente de servidor); seções e componentes com hooks, GSAP ou acesso ao navegador levam `'use client'` na primeira linha. Nada de `window`/`document` durante o render, só em efeitos (o HTML é gerado no build, sem navegador).
  - **Primeira tela:** o que entra animado logo ao abrir leva `data-primeiro-quadro` e anima com `gsap.from(..., { autoAlpha: 0 })`; o CSS o esconde só quando há JS e movimento permitido (`global.css`), então não pisca nem some sem JS.
  - Tipos: o `tsc` roda no `npm run build` (o TypeScript 7 não tem a API que o Next usaria).
  - **Arquivos de `public/`** (imagens, ícones, `url()` em estilo inline) sempre com `caminho('/pasta/arquivo')` de `src/lib/caminho.ts`: no GitHub Pages o site fica em `/<repositorio>/` e o Next não prefixa esses caminhos sozinho. Publicação: `docs/ferramentas.md`.
- **GSAP** (com ScrollTrigger, SplitText, CustomEase; todos os plugins são gratuitos) é o motor principal: timelines, rolagem, texto. Importe sempre de `@/lib/gsap` (registra plugins e a curva `vexiom`) e use `useGSAP` nos componentes.
- **Lenis** para rolagem suave, já ligado ao relógio do GSAP em `src/components/SmoothScroll.tsx`. Não crie outra instância. Links `#secao` passam por `irParaSecao` (mira o começo real de seções presas e, em saltos longos, cobre a tela com a cortina diagonal e pula direto, sem atravessar animações de rolagem).
- **motion** (`motion/react`): instalado porque muitos componentes do React Bits dependem dele. Hoje nenhum componente usa; o primeiro que usar deve entrar com `<MotionConfig reducedMotion="user">` em `src/components/Provedores.tsx`.
- **React Bits** e **21st.dev**: fontes de componentes prontos, instalados pelo CLI do shadcn. Como trazer e adaptar: `docs/componentes.md`.

## Antes de qualquer tarefa
1. Leia `docs/marca.md` inteiro (cores, fonte, logo e **linguagem de movimento**). Toda decisão visual sai dele.
2. Vai trazer componente pronto? Leia `docs/componentes.md`.
3. Para movimento: `docs/receitas/README.md` (abra só a receita que for usar). Para ideias: `docs/repertorio/INDEX.md`.
4. As instruções de estrutura e conteúdo vêm do usuário.
5. Máquina nova ou colaborador novo: `docs/ferramentas.md` (o que instalar, contas e skills).

## Processo
1. **Direção antes de código.** Escreva `docs/DIRECTION.md` (máx. 30 linhas): conceito, hero, seções e a forma de cada uma, quais efeitos/componentes entram em cada seção. **Mostre um resumo curto ao usuário e espere o ok** antes de implementar.
2. **Implemente em passos pequenos**, uma seção por vez, e rode o check a cada passo.
3. **Autorrevisão:** `npm run check` sem nenhum `✗`. Olhe **uma** imagem por rodada (`.check/desktop-hero.png`, ou a mobile se mexeu no mobile). Prefira verificar por código a abrir prints.
4. Commits pequenos e descritivos no branch atual. **Não faça push nem PR sem o usuário pedir.**

## Regras que não se negociam
- **Reduzir movimento (meio-termo, decidido pelo usuário):** com `prefers-reduced-motion`, todo conteúdo aparece no estado final, sem entrada animada, e efeitos grandes (cortinas, seção horizontal, parallax, Lenis) ficam desligados. **Fundos decorativos continuam vivos, em deriva bem lenta** (≈ ¼ da velocidade) e sem reagir ao cursor. Motivo: muita gente desliga os efeitos de animação do Windows só por desempenho. O `npm run check` testa as duas versões.
- **Conteúdo nunca depende da animação.** Texto e botões ficam visíveis se o efeito falhar, não carregar ou o WebGL não existir. Animação parte do estado de repouso (`gsap.from`, não esconder no CSS e revelar no JS).
- **Celular primeiro:** cada efeito tem versão simples ou desligada no mobile (use `gsap.matchMedia()`). Nada de hover como única forma de acessar algo.
- **Peso:** JS da **primeira carga até 400 KB gzip** (ideal < 250). Efeitos pesados (three.js, ogl, cenas WebGL) entram com `React.lazy`/`import()` só quando a seção chega perto da tela. LCP local < 2,5 s no celular.
- **Desempenho:** prefira animar `transform`, `opacity`, `clip-path` e `filter`. Animar layout (`width/height/top/margin`) só com motivo e sem travar a rolagem. Limpe tudo ao desmontar (`useGSAP` faz isso; WebGL precisa de `dispose`).
- **Acessibilidade:** um `h1`, alvos de toque ≥ 44 px, contraste da paleta (`docs/marca.md`), foco visível, cursor próprio nunca esconde o cursor do sistema sem fallback, texto dividido por SplitText continua legível por leitor de tela (`aria-label` no título original).
- **Segurança:** tudo no build é público. Nenhum segredo, token ou cupom no código nem em `NEXT_PUBLIC_*`. Links `target="_blank"` com `rel="noopener noreferrer"`. Formulário que envia dados exige link para política de privacidade (LGPD). Componente copiado de fora é código de terceiro: leia antes de usar.
- **Conteúdo sem invenção:** números, clientes, depoimentos e preços só se o usuário fornecer. Projetos de demonstração aparecem como "projetos-modelo", nunca como clientes. Componentes de demonstração vêm com texto falso: troque tudo.

## Check automático (`scripts/check.mjs`)
`npm run check`. Faz o build, abre o site em 390 px e 1440 px e com "reduzir movimento", e reprova: rolagem horizontal, erros de console, títulos cortados/sobrepostos por animação, conteúdo invisível com reduzir movimento, âncoras quebradas, menus/acordeões que não abrem, links de contato inválidos, alvos < 44 px, h1 duplicado, `<h1>` ausente do HTML gerado, segredos no build, source map publicado, `http://`, JS da primeira carga acima de 400 KB (o sob demanda só avisa acima de 900 KB). Marque o botão principal com `data-cta`.

Usa o Chromium headless do Playwright (`npx playwright install chromium-headless-shell`, já instalado nesta máquina).

## Pesquisa de referências (só quando o usuário pedir)
`node scripts/inspect-site.mjs <url> [<url>...]` analisa sites por código (bibliotecas, fontes, cores, movimento) e salva capturas em `docs/repertorio/.capturas/` (fora do git). Estude técnicas; **não copie** código, imagens, textos ou layouts. Registre o aprendizado em `docs/repertorio/`.

## Onde estão as informações do negócio
- **Notion "Painel da Startup"**: Wiki → *Planos e preços*, *Identidade visual — Vexiom*, *Checklist de segurança*; Projetos → *Site de portfólio da startup* (escopo das seções, critérios de aceite).
- Logo e gerador: `C:\Users\migue\Documents\Vexiom\logo\`.
