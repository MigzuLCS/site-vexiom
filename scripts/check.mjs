// Checagem automática do site: npm run check (portada do Site Maker, nível Experimental)
// Faz build, verifica segurança e peso do JS, abre o site em 390px e 1440px (com barra de rolagem real),
// testa a interação (âncoras, menus, acordeões, links de contato) e repete em 390px com "reduzir movimento".
// Imprime um relatório curto em texto. Prints ficam em .check/ (olhe só se algo falhar).
import { build, preview } from 'vite'
import puppeteer from 'puppeteer-core'
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const projeto = process.cwd()
const OUT_DIR = process.env.CHECK_OUTDIR || 'dist'
if (!existsSync(join(projeto, 'index.html'))) {
  console.error('Rode na raiz do projeto Vite (onde fica o index.html): npm run check')
  process.exit(1)
}

// Preferência: o headless shell que o Playwright baixa (npx playwright install chromium-headless-shell).
// Ele não cria janela com o título da página; o Chrome/Edge "sem janela" cria uma por execução,
// e o Alt-Tab do Windows guarda miniaturas fantasmas delas.
const playwrightDir = process.env.LOCALAPPDATA ? `${process.env.LOCALAPPDATA}\\ms-playwright` : null
const headlessShell = playwrightDir && existsSync(playwrightDir)
  ? readdirSync(playwrightDir)
      .filter((d) => d.startsWith('chromium_headless_shell-'))
      .sort()
      .reverse()
      .map((d) => `${playwrightDir}\\${d}\\chrome-headless-shell-win64\\chrome-headless-shell.exe`)
      .find((p) => existsSync(p))
  : null

const browserPath = [
  process.env.CHROME_PATH,
  headlessShell,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p))
if (!browserPath) {
  console.error('Nenhum Chrome/Edge encontrado. Defina CHROME_PATH com o caminho do executável.')
  process.exit(1)
}
if (!browserPath.includes('headless-shell')) console.log('! sem o headless shell do Playwright: podem surgir janelas fantasmas no Alt-Tab (npx playwright install chromium-headless-shell)')

const BANNED = ['soluções inovadoras', 'excelência', 'experiência única', 'transformamos', 'referência em', 'compromisso com você', 'venha nos conhecer', 'o melhor do']
const LCP_WARN_MS = 2500

// Segurança: tudo que vai para dist/ é público. Nada de segredo, source map ou bundle gigante.
const SECRETS = [
  [/sk_(live|test)_[0-9a-zA-Z]{16,}/, 'chave secreta Stripe'],
  [/APP_USR-\d{10,}-\d{6}-[0-9a-f]{32}-\d+/, 'access token Mercado Pago'],
  [/AKIA[0-9A-Z]{16}/, 'chave AWS'],
  [/gh[pousr]_[0-9a-zA-Z]{36}/, 'token GitHub'],
  [/xox[abpr]-[0-9a-zA-Z-]{10,}/, 'token Slack'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'chave privada'],
  [/(password|senha|secret|api_?key|token|cupom|coupon)["']?\s*[:=]\s*["'][^"'\s]{6,}["']/i, 'possível segredo em texto'],
]
const SECRET_WARN = [
  [/AIza[0-9A-Za-z_-]{35}/, 'chave Google (ok só se restrita por domínio)'],
  [/eyJ[0-9A-Za-z_-]{10,}\.eyJ[0-9A-Za-z_-]{10,}\./, 'JWT embutido'],
]
const ENV_SUSPECT = /VITE_\w*(SECRET|TOKEN|PASS|SENHA|PRIVATE|ADMIN|CUPOM|COUPON)\w*/g
// Nível Experimental: animação é o produto, mas o celular ainda precisa abrir rápido.
const JS_GZ_WARN = 250 * 1024
const JS_GZ_FAIL = 350 * 1024

const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? files(join(dir, d.name)) : [join(dir, d.name)]))
const root = (p) => join(projeto, p)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const fails = []
const warns = []

await build({ root: projeto, logLevel: 'error' })

// Segurança estática: build final + código-fonte do site
let jsGz = 0
for (const f of files(root(OUT_DIR))) {
  const name = f.split(/[\\/]/).pop()
  if (f.endsWith('.map')) fails.push(`segurança: source map publicado (${name})`)
  if (!/\.(js|html|css|json|txt|svg)$/.test(f)) continue
  const src = readFileSync(f, 'utf8')
  if (f.endsWith('.js')) jsGz += gzipSync(src).length
  for (const [re, what] of SECRETS) if (re.test(src)) fails.push(`segurança: ${what} em ${name}`)
  for (const [re, what] of SECRET_WARN) if (re.test(src)) warns.push(`segurança: ${what} em ${name}`)
}
const kb = Math.round(jsGz / 1024)
if (jsGz > JS_GZ_FAIL) fails.push(`performance: ${kb} KB de JS (gzip), limite ${JS_GZ_FAIL / 1024} KB`)
else if (jsGz > JS_GZ_WARN) warns.push(`performance: ${kb} KB de JS (gzip), ideal < ${JS_GZ_WARN / 1024} KB`)

const siteSrc = [...(existsSync(root('src')) ? files(root('src')) : []), root('index.html')].filter((f) => /\.(jsx?|tsx?|html|vue|svelte)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n')
const envFiles = readdirSync(root('')).filter((f) => f.startsWith('.env')).map((f) => readFileSync(root(f), 'utf8')).join('\n')
const suspectEnv = [...new Set([...siteSrc.matchAll(ENV_SUSPECT), ...envFiles.matchAll(ENV_SUSPECT)].map((m) => m[0]))]
if (suspectEnv.length) fails.push(`segurança: variável VITE_ é pública, não guarde segredo nela: ${suspectEnv.join(', ')}`)
if (siteSrc.includes('dangerouslySetInnerHTML')) warns.push('segurança: dangerouslySetInnerHTML no site (só com conteúdo fixo, nunca de usuário)')
const sendsData = /fetch\(|axios|XMLHttpRequest|action=/.test(siteSrc)

const server = await preview({ root: projeto, logLevel: 'silent', preview: { port: 0, open: false } })
const url = server.resolvedUrls.local[0]

const outDir = root('.check/')
mkdirSync(outDir, { recursive: true })

// Títulos cortados: palavra dentro de uma janela com overflow escondido que nunca se abre (animação que não disparou).
// Opacidade não pega isso, porque o texto fica opaco e simplesmente fora da janela.
function clippedHeadings() {
  const share = (el) => {
    const r = el.getBoundingClientRect()
    const area = r.width * r.height
    if (!area) return 1
    let box = { l: r.left, t: r.top, r: r.right, b: r.bottom }
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n)
      if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue
      const p = n.getBoundingClientRect()
      box = { l: Math.max(box.l, p.left), t: Math.max(box.t, p.top), r: Math.min(box.r, p.right), b: Math.min(box.b, p.bottom) }
    }
    return Math.max(0, box.r - box.l) * Math.max(0, box.b - box.t) / area
  }
  const bad = []
  for (const h of document.querySelectorAll('main h1, main h2, main h3')) {
    if (!h.getClientRects().length) continue
    const leaves = [...h.querySelectorAll('*')].filter((e) => !e.children.length && e.textContent.trim())
    const worst = Math.min(...(leaves.length ? leaves : [h]).map(share))
    if (worst < 0.6) bad.push(`${h.tagName.toLowerCase()} "${h.textContent.trim().slice(0, 32)}"`)

    // Palavras que se sobrepõem na mesma linha (título espalhado com palavra larga demais para a coluna).
    const boxes = leaves.map((e) => ({ t: e.textContent.trim().slice(0, 14), r: e.getBoundingClientRect() })).filter((x) => x.r.width > 8 && x.r.height > 8)
    outer: for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].r
        const b = boxes[j].r
        const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left)
        const sameLine = Math.abs((a.top + a.bottom) / 2 - (b.top + b.bottom) / 2) < 0.3 * Math.min(a.height, b.height)
        if (sameLine && ox > Math.max(8, 0.06 * Math.min(a.width, b.width))) {
          bad.push(`${h.tagName.toLowerCase()} "${h.textContent.trim().slice(0, 32)}" (palavras sobrepostas: "${boxes[i].t}" × "${boxes[j].t}")`)
          break outer
        }
      }
    }
  }
  return bad
}

async function scrollThrough(page, height) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < total; y += height / 2) {
    await page.evaluate((v) => scrollTo({ top: v, behavior: 'instant' }), y)
    await wait(80)
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await wait(300)
}

// Clica como uma pessoa: centraliza o elemento na tela e só clica se nada (ex.: barra fixa) estiver por cima.
async function realClick(handle) {
  const free = await handle.evaluate(async (el) => {
    el.scrollIntoView({ block: 'center', behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 150))
    const r = el.getBoundingClientRect()
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    return !!hit && (el === hit || el.contains(hit))
  })
  if (free) await handle.click()
  return free
}

// Interação: o que parece clicável precisa funcionar de verdade.
async function testInteraction(page, name) {
  const problems = []

  // Links de contato com formato válido (wa.me com número, tel: e mailto: preenchidos).
  const contact = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'))
    .filter((h) => /wa\.me|api\.whatsapp|^tel:|^mailto:/.test(h))
    .filter((h) => !(/wa\.me\/\d{10,15}(\?|$)|api\.whatsapp\.com\/send\?phone=\d{10,15}|^tel:\+?[\d\s()-]{8,}$|^mailto:[^@\s]+@[^@\s]+\.\w+/.test(h))))
  for (const h of [...new Set(contact)].slice(0, 3)) problems.push(`link de contato inválido: ${h.slice(0, 50)}`)

  // Âncoras internas: o alvo existe e o clique leva até ele.
  const anchors = await page.$$('a[href^="#"]:not([href="#"])')
  const seen = new Set()
  let clicked = 0
  for (const a of anchors) {
    const info = await a.evaluate((el) => ({ href: el.getAttribute('href'), visible: !!el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' }))
    if (seen.has(info.href)) continue
    seen.add(info.href)
    const id = decodeURIComponent(info.href.slice(1))
    if (!(await page.evaluate((i) => !!document.getElementById(i), id))) {
      problems.push(`âncora quebrada: ${info.href} não existe na página`)
      continue
    }
    if (!info.visible || clicked >= 8) continue
    clicked++
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await wait(150)
    if (!(await realClick(a).catch(() => false))) continue
    await wait(1100)
    const top = await page.evaluate((i) => document.getElementById(i).getBoundingClientRect().top, id)
    const vh = await page.evaluate(() => innerHeight)
    if (top < -40 || top > vh * 0.6) problems.push(`clicar em ${info.href} não levou até a seção (ficou a ${Math.round(top)}px do topo)`)
  }

  // Menus e acordeões: aria-expanded precisa alternar no clique.
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  for (const b of (await page.$$('button[aria-expanded], [role="button"][aria-expanded]')).slice(0, 6)) {
    const before = await b.evaluate((el) => (el.getClientRects().length ? el.getAttribute('aria-expanded') : null))
    if (before === null) continue
    if (!(await realClick(b).catch(() => false))) continue
    await wait(350)
    const after = await b.evaluate((el) => el.getAttribute('aria-expanded'))
    const label = await b.evaluate((el) => (el.getAttribute('aria-label') || el.innerText || '').trim().slice(0, 24))
    if (after === before) problems.push(`botão "${label}" não abre/fecha (aria-expanded continua ${before})`)
    else await realClick(b).catch(() => {})
    await wait(200)
  }

  // <details>: o summary abre o conteúdo.
  for (const s of (await page.$$('details > summary')).slice(0, 4)) {
    const before = await s.evaluate((el) => el.parentElement.open)
    if (!(await s.evaluate((el) => !!el.getClientRects().length))) continue
    if (!(await realClick(s).catch(() => false))) continue
    await wait(250)
    if ((await s.evaluate((el) => el.parentElement.open)) === before) problems.push(`acordeão "${(await s.evaluate((el) => el.innerText)).trim().slice(0, 24)}" não abre`)
  }

  for (const p of problems) fails.push(`${name}: interação: ${p}`)
  return { anchors: seen.size, clicked }
}

// Sem --hide-scrollbars: no desktop a página tem a barra de 15px que o Windows desenha de verdade.
const browser = await puppeteer.launch({
  executablePath: browserPath,
  headless: browserPath.includes('headless-shell') ? 'shell' : true,
  ignoreDefaultArgs: ['--hide-scrollbars'],
})

try {
  for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1440, 900]]) {
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && !m.text().includes('favicon') && !m.text().includes('404') && errors.push(m.text()))
    await page.evaluateOnNewDocument(() => {
      window.__lcp = 0
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__lcp = e.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })
    })
    await page.setViewport({ width, height })
    if (name === 'mobile') await page.emulateCPUThrottling(4)
    await page.goto(url, { waitUntil: 'networkidle0' })
    await wait(1200)

    const first = await page.evaluate(() => {
      const ctas = [...document.querySelectorAll('[data-cta]')].filter((el) => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden')
      const above = ctas.some((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.top >= 0 && r.bottom <= innerHeight
      })
      return { lcp: Math.round(window.__lcp), ctas: ctas.length, above, viewport: document.documentElement.clientWidth }
    })
    if (name === 'mobile') await page.emulateCPUThrottling(1)

    await scrollThrough(page, height)

    const clipped = await page.evaluate(`(${clippedHeadings.toString()})()`)
    if (clipped.length) fails.push(`${name}: título(s) com problema depois de rolar a página (cortado = animação não disparou; sobreposto = palavra larga demais para a coluna): ${clipped.slice(0, 3).join('; ')}`)

    const r = await page.evaluate((banned) => {
      const text = document.body.innerText.toLowerCase()
      const vw = document.documentElement.clientWidth
      const small = [...document.querySelectorAll('button, summary, textarea, input:not(.sr-only), label:has(> input.sr-only) > span')]
        .filter((el) => el.offsetParent !== null)
        .map((el) => ({ el, h: el.getBoundingClientRect().height }))
        .filter((x) => x.h > 0 && x.h < 44)
        .map((x) => `${x.el.tagName.toLowerCase()} "${(x.el.innerText || x.el.name || '').trim().slice(0, 24)}" (${Math.round(x.h)}px)`)
      const footer = document.querySelector('footer')
      const hscroll = document.documentElement.scrollWidth > vw
      return {
        hscroll,
        culprits: hscroll
          ? [...document.querySelectorAll('body *')]
              .filter((e) => e.getBoundingClientRect().right > vw + 1)
              .filter((e) => ![...e.children].some((c) => c.getBoundingClientRect().right > vw + 1))
              .slice(0, 4)
              .map((e) => `${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/)[0] : ''} "${(e.textContent || '').trim().slice(0, 18)}" (direita em ${Math.round(e.getBoundingClientRect().right)}px)`)
          : [],
        pageHeight: document.documentElement.scrollHeight,
        h1: document.querySelectorAll('h1').length,
        noAlt: [...document.querySelectorAll('img:not([alt])')].length,
        small,
        footerH: footer ? Math.round(footer.getBoundingClientRect().height) : 0,
        placeholders: (text.match(/\[preencher/g) || []).length,
        banned: banned.filter((b) => text.includes(b)),
        hasTitle: document.title.trim().length > 0 && document.title !== 'Site',
        hasDesc: !!document.querySelector('meta[name="description"]'),
        thirdParty: [...new Set([...document.querySelectorAll('script[src], iframe[src]')]
          .map((el) => new URL(el.src, location.href)).filter((u) => u.origin !== location.origin).map((u) => u.host))],
        blankNoRel: [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener|noreferrer/.test(a.rel)).length,
        insecure: [...document.querySelectorAll('[src], link[href], form[action]')]
          .map((el) => el.getAttribute('src') || el.getAttribute('href') || el.getAttribute('action')).filter((v) => v?.startsWith('http://')),
        formNoPrivacy: !!document.querySelector('form, input:not([type=hidden]), textarea') &&
          ![...document.querySelectorAll('a')].some((a) => /privacidade|privacy/i.test(a.innerText + a.href)),
      }
    }, BANNED)

    await page.screenshot({ path: `${outDir}${name}-full.png`, fullPage: true })
    await page.screenshot({ path: `${outDir}${name}-hero.png` })

    const inter = await testInteraction(page, name)

    if (r.hscroll) fails.push(`${name}: scroll horizontal. Elementos que passam da borda: ${r.culprits.join('; ') || '(não identificados)'}`)
    if (errors.length) fails.push(`${name}: erros no console: ${errors.slice(0, 2).join(' | ')}`)
    if (first.ctas && !first.above) fails.push(`${name}: nenhum [data-cta] inteiro na primeira tela`)
    if (name === 'mobile') {
      if (!first.ctas) warns.push('nenhum elemento com data-cta (marque o CTA primário)')
      if (r.small.length) fails.push(`mobile: alvos de toque < 44px: ${r.small.slice(0, 4).join('; ')}`)
      if (r.h1 !== 1) fails.push(`h1 deve ser único (achei ${r.h1})`)
      if (r.noAlt) fails.push(`${r.noAlt} imagem(ns) sem alt`)
      if (!r.hasTitle) fails.push('falta <title> específico')
      if (!r.hasDesc) fails.push('falta meta description')
      if (r.banned.length) fails.push(`jargão proibido: ${r.banned.join(', ')}`)
      if (r.placeholders) warns.push(`${r.placeholders} [PREENCHER] visível(is)`)
      if (first.lcp > LCP_WARN_MS) warns.push(`LCP local de ${first.lcp}ms no mobile (CPU 4×), acima de ${LCP_WARN_MS}ms`)
      if (r.thirdParty.length) warns.push(`segurança: scripts/iframes de terceiros (confirme cada um): ${r.thirdParty.join(', ')}`)
      if (r.blankNoRel) fails.push(`segurança: ${r.blankNoRel} link(s) target="_blank" sem rel="noopener noreferrer"`)
      if (r.insecure.length) fails.push(`segurança: recurso em http:// (sem HTTPS): ${r.insecure.slice(0, 3).join(', ')}`)
      if (r.formNoPrivacy) {
        if (sendsData) fails.push('LGPD: o site envia dados de formulário mas não tem link para política de privacidade')
        else warns.push('LGPD: formulário só monta mensagem (ex.: WhatsApp); considere um aviso de privacidade curto')
      }
      console.log(`mobile  : ${r.pageHeight}px de altura · LCP local ${first.lcp}ms (CPU 4×) · ${inter.anchors} âncora(s), ${inter.clicked} clicada(s)`)
    } else {
      if (r.footerH > 220) warns.push(`desktop: footer com ${r.footerH}px (está ocupando muito espaço?)`)
      console.log(`desktop : ${r.pageHeight}px de altura, footer ${r.footerH}px, área útil ${first.viewport}px · ${inter.clicked} âncora(s) clicada(s)`)
    }
    await page.close()
  }

  // "Reduzir movimento": tudo o que é para ler precisa estar visível sem animação.
  const page = await browser.newPage()
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(url, { waitUntil: 'networkidle0' })
  await scrollThrough(page, 844)
  await wait(500)
  const hidden = await page.evaluate(() => {
    const els = [...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main img, main [data-cta]')]
      .filter((el) => el.getClientRects().length && !el.closest('[aria-hidden="true"]'))
    return els
      .filter((el) => {
        let opacity = 1
        for (let n = el; n && n !== document.body; n = n.parentElement) {
          const cs = getComputedStyle(n)
          if (cs.visibility === 'hidden') return true
          opacity *= parseFloat(cs.opacity)
        }
        return opacity < 0.5
      })
      .map((el) => `${el.tagName.toLowerCase()} "${(el.innerText || el.alt || '').trim().slice(0, 30)}"`)
  })
  const clippedReduced = await page.evaluate(`(${clippedHeadings.toString()})()`)
  hidden.push(...clippedReduced.map((c) => `${c} (cortado)`))
  if (hidden.length) fails.push(`reduzir movimento: ${hidden.length} elemento(s) invisível(is): ${hidden.slice(0, 3).join('; ')}`)
  console.log(`reduzir : ${hidden.length ? `${hidden.length} elemento(s) invisível(is)` : 'tudo visível'}`)
  await page.close()
} finally {
  await browser.close()
  server.httpServer.close()
}

for (const w of warns) console.log(`! ${w}`)
if (fails.length) {
  console.log(`\nFALHOU (${fails.length}):`)
  for (const f of fails) console.log(`✗ ${f}`)
} else {
  console.log('\nOK: sem overflow, sem erros, âncoras/menus funcionando, tudo visível com reduzir movimento, alvos ≥ 44px, h1 único, footer curto, sem jargão.')
  console.log(`OK segurança: sem segredos no build, sem source maps, links seguros, ${kb} KB de JS (gzip).`)
}
console.log('Prints: .check/ (hero e página inteira, mobile e desktop)')
process.exit(fails.length ? 1 : 0)
