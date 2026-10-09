# Site da Vexiom

Site institucional e portfólio da **Vexiom**, estúdio de 3 sócios que cria sites para negócios (do comércio local a sistemas sob medida). É a vitrine da empresa: **visual próprio, animado e interativo**, no nível **Experimental**. Precisa provar, só de abrir, que a Vexiom sabe fazer o que vende.

> Este site NÃO segue o processo "Contido" dos sites de clientes (Site Maker). Aqui movimento e interação são o produto, dentro das regras abaixo.

## Antes de qualquer tarefa
1. Leia `docs/marca.md` inteiro (cores, fonte, logo e **linguagem de movimento**). Toda decisão visual sai dele.
2. Para movimento: leia `docs/receitas/README.md` e abra só a receita que for usar. Para ideias: `docs/repertorio/INDEX.md`.
3. As instruções de stack, estrutura e conteúdo vêm do usuário. Na dúvida entre opções equivalentes, prefira a mais simples e leve.

## Processo
1. **Direção antes de código.** Escreva `docs/DIRECTION.md` (máx. 30 linhas): conceito, hero, seções e a forma de cada uma, quais gestos da linguagem de movimento entram em cada seção. **Mostre um resumo curto ao usuário e espere o ok** antes de implementar.
2. **Implemente em passos pequenos**, uma seção por vez, e rode o check a cada passo.
3. **Autorrevisão:** `npm run check` sem nenhum `✗`. Olhe **uma** imagem por rodada (`.check/desktop-hero.png`, ou a mobile se mexeu no mobile). Prefira verificar por código a abrir prints.
4. Commits pequenos e descritivos no branch atual. **Não faça push nem PR sem o usuário pedir.**

## Regras que não se negociam
- **Reduzir movimento:** com `prefers-reduced-motion`, todo conteúdo aparece no estado final, sem animação. Sem JS, o site continua legível.
- **Estado final = estado de repouso.** Anime `transform`, `opacity` e `clip-path`; nunca `width/height/top/margin`.
- **Celular primeiro:** cada efeito tem uma versão simples no mobile (a receita diz qual). Nada de hover como única forma de acessar algo.
- **Peso:** até **350 KB de JS (gzip)**; ideal < 250. LCP local < 2,5 s no celular. GSAP/WebGL/Lenis só se o gesto pedir, cada um com fallback.
- **Acessibilidade:** um `h1`, alvos de toque ≥ 44 px, contraste da paleta (`docs/marca.md`), foco visível, cursor próprio nunca esconde o cursor do sistema sem fallback.
- **Segurança:** tudo no build é público. Nenhum segredo, token ou cupom no código nem em `VITE_*`. Links `target="_blank"` com `rel="noopener noreferrer"`. Formulário que envia dados exige link para política de privacidade (LGPD).
- **Conteúdo sem invenção:** números, clientes, depoimentos e preços só se o usuário fornecer. Projetos de demonstração aparecem como "projetos-modelo", nunca como clientes.

## Check automático (`scripts/check.mjs`)
Portado do Site Maker. Faz o build, abre o site em 390 px e 1440 px e com "reduzir movimento", e reprova: rolagem horizontal, erros de console, títulos cortados/sobrepostos por animação, conteúdo invisível com reduzir movimento, âncoras quebradas, menus/acordeões que não abrem, links de contato inválidos, alvos < 44 px, h1 duplicado, segredos no build, source map publicado, `http://`, JS acima de 350 KB.

Configuração (uma vez, quando o projeto Vite existir):
```
npm i -D vite puppeteer-core
npx playwright install chromium-headless-shell   # navegador sem janela (evita janelas fantasmas no Alt-Tab)
```
e no `package.json`: `"check": "node scripts/check.mjs"`. Marque o botão principal com `data-cta`.

## Pesquisa de referências (só quando o usuário pedir)
`node scripts/inspect-site.mjs <url> [<url>...]` analisa sites por código (bibliotecas, fontes, cores, movimento) e salva capturas em `docs/repertorio/.capturas/` (fora do git). Estude técnicas; **não copie** código, imagens, textos ou layouts. Registre o aprendizado em `docs/repertorio/`.

## Onde estão as informações do negócio
- **Notion "Painel da Startup"**: Wiki → *Planos e preços*, *Identidade visual — Vexiom*, *Checklist de segurança*; Projetos → *Site de portfólio da startup* (escopo das seções, critérios de aceite).
- Logo e gerador: `C:\Users\migue\Documents\Vexiom\logo\`.
