import type { NextConfig } from 'next'

// Exportação estática: o build gera HTML pronto em out/ e hospeda em qualquer lugar.
// Quando precisarmos de servidor (formulário, área do cliente), tira o "export".
const config: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  // os tipos são checados pelo "tsc" no script de build (o TypeScript 7 não tem a API que o Next usa)
  typescript: { ignoreBuildErrors: true },
  // as instruções para agentes ficam no CLAUDE.md (o next dev criaria um AGENTS.md)
  agentRules: false,
}

export default config
