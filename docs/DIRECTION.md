# Direção: site da Vexiom

**Conceito: "a gente constrói, e rápido".** O site se monta na frente da pessoa. As diagonais da logo (63,4°) são a estrutura de tudo: linhas em velocidade, cortes entre seções, revelações. O quadrado laranja é o cursor de quem está construindo. Papel e Tinta na maior parte; Laranja só no cursor, nos destaques e no botão; Azul nas seções escuras. Red Hat Display em tudo, com o peso 700 grande só em três momentos (hero, portfólio, preços).
**Para quem:** dono de comércio local, no celular. Em 10 s: o que fazemos, quanto custa, WhatsApp (Notion). O dinamismo não pode atrasar isso.

## Seções
1. **Menu** fixo e fino: logo horizontal, âncoras, botão WhatsApp. O quadrado laranja desliza até o item ativo. No celular, tela cheia com cortina diagonal.
2. **Hero** (Papel): **campo de velocidade**. Traços finos na diagonal da marca correm pela tela como luz em longa exposição. Na abertura chegam em alta velocidade, desaceleram e se juntam formando as barras do símbolo; o bloco laranja "cai" no lugar e vira o cursor do título. Depois, deriva lenta: a rolagem acelera os traços (quanto mais rápido rola, mais longos ficam) e o cursor/dedo abre um rastro onde eles aceleram. Canvas 2D próprio, sem biblioteca.
   Título digitado (proposta): **"Um site que traz clientes. Agora é simples."** Apoio: "A gente cria, publica e cuida do site do seu negócio. Você só responde os clientes no WhatsApp." + botão WhatsApp sem rolar.
3. **Quem somos: o que é a Vexiom** (Papel): resumo da empresa e de como ela se aplica ao negócio do cliente: estúdio que cria sites para comércio local até sistemas sob medida; como funciona em 3 passos (conversa → prévia → site no ar), que se revelam em diagonal conforme a rolagem. Sem fotos dos sócios.
4. **Capacidades** (Papel → faixa Tinta): o que construímos ligado aos planos: landing page rápida (Vite/React), site editável (WordPress), loja e agenda (WooCommerce e integrações), SEO local e Google Meu Negócio. Faixa de tecnologias que acelera com a velocidade da rolagem (mesma física do hero).
5. **Portfólio** (escuro): cortina diagonal para Tinta/Azul. Fundo WebGL de warp/gradiente granulado em azul, tinta e um fio de laranja (sob demanda). Os 4 projetos-modelo em seção horizontal fixa no desktop (print celular + desktop, tipo de negócio, link), selo "projeto-modelo"; no celular, lista vertical e fundo parado.
6. **Preços** (Papel, por cortina diagonal): Essencial, Profissional (destaque), Sob medida. Chave **Tabela ↔ Fundador** que troca os números com animação (−40%), mensalidade e o que inclui. Selo "Preço de fundador: 10 vagas" (número num só lugar do código, para atualizar). Valores = Notion.
7. **FAQ** (Papel): prazo, mensalidade, domínio, alterações, "preciso entender de internet?". Acordeão acessível.
8. **Contato / rodapé** (Azul): padrão de diagonais com parallax leve, CTA WhatsApp grande, Instagram, e-mail.

## Técnica
- GSAP + ScrollTrigger (cortinas, revelações, horizontal), SplitText no título, Lenis na rolagem.
- Componentes prontos como base (adaptados à marca, `docs/componentes.md`): preços = 21st *Pricing Section with Frequency Toggle* (efferd, aprovado); título = React Bits *Text Type*; faixa = React Bits *Scroll Velocity*; warp do portfólio = React Bits *Grainient* (ou 21st *Warp · Kelp*); fundo do hero = partir de um componente de velocidade (21st *Light Speed*, React Bits *Hyperspeed*), a escolher pelo usuário.
- Celular: traços com menos densidade e sem rastro do dedo; portfólio sem WebGL. Reduzir movimento: símbolo montado e tudo parado.
- HTML pré-renderizado no build (Google e prévia de link no WhatsApp).
