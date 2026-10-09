// Servidor estático mínimo para a pasta out/ (build do Next com output: 'export').
// Usado pelo check e por "npm start". Sem dependências.
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { pathToFileURL } from 'node:url'

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
}

export function servir(pasta, porta = 0) {
  const raiz = normalize(pasta)
  const servidor = createServer((req, res) => {
    const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    let arquivo = normalize(join(raiz, caminho))
    if (!arquivo.startsWith(raiz)) return res.writeHead(403).end()
    if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = join(arquivo, 'index.html')
    else if (!existsSync(arquivo) && existsSync(`${arquivo}.html`)) arquivo = `${arquivo}.html`
    if (!existsSync(arquivo)) {
      const nf = join(raiz, '404.html')
      res.writeHead(404, { 'content-type': TIPOS['.html'] })
      return existsSync(nf) ? createReadStream(nf).pipe(res) : res.end('404')
    }
    res.writeHead(200, { 'content-type': TIPOS[extname(arquivo)] ?? 'application/octet-stream' })
    createReadStream(arquivo).pipe(res)
  })
  return new Promise((ok) => servidor.listen(porta, '127.0.0.1', () => ok({ url: `http://127.0.0.1:${servidor.address().port}/`, fechar: () => servidor.close() })))
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { url } = await servir(join(process.cwd(), 'out'), Number(process.env.PORT) || 3000)
  console.log(`servindo out/ em ${url}`)
}
