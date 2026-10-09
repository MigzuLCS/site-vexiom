// Testa o site como ficará no GitHub Pages de projeto (usuario.github.io/site-vexiom/):
// faz o build com o prefixo, serve em /site-vexiom/ e abre em http://127.0.0.1:3000/site-vexiom/.
// Depois de testar, um "npm run build" normal volta o out/ para a raiz.
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { servir } from './servir.mjs'

const base = process.env.PAGES_BASE_PATH || '/site-vexiom'
execSync('npm run build', { stdio: 'inherit', env: { ...process.env, PAGES_BASE_PATH: base } })
const { url } = await servir(join(process.cwd(), 'out'), Number(process.env.PORT) || 3000, base)
console.log(`\nComo no GitHub Pages: ${url}  (Ctrl+C para parar)`)
