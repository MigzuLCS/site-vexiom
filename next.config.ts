import type { NextConfig } from 'next'

// Exportação estática: o build gera HTML pronto em out/ e hospeda em qualquer lugar.
// Quando precisarmos de servidor (formulário, área do cliente), tira o "export".
//
// GitHub Pages de projeto publica em usuario.github.io/<repositorio>/: o caminho vem de
// PAGES_BASE_PATH na hora do build (o workflow .github/workflows/deploy.yml preenche com o
// valor que o próprio GitHub informa). Sem a variável (dev, check), o site fica na raiz.
const base = process.env.PAGES_BASE_PATH?.replace(/\/$/, '') ?? ''

const config: NextConfig = {
  output: 'export',
  basePath: base || undefined,
  // o Next prefixa os próprios arquivos (_next/) e links; imagens e ícones em public/ usam
  // caminho() de src/lib/caminho.ts, que lê esta variável
  env: { NEXT_PUBLIC_BASE_PATH: base },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  // os tipos são checados pelo "tsc" no script de build (o TypeScript 7 não tem a API que o Next usa)
  typescript: { ignoreBuildErrors: true },
  // as instruções para agentes ficam no CLAUDE.md (o next dev criaria um AGENTS.md)
  agentRules: false,
}

export default config
