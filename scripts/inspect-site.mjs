// Inspeção de sites de referência (estudo de técnicas, nunca cópia): node scripts/inspect-site.mjs <url> [<url>...]
// Para cada site: abre em 1440x900, rola em 4 pontos, lê por código bibliotecas, fontes, cores, tipografia e sinais de
// movimento, e salva em docs/repertorio/.capturas/<site>/ (fora do git): folha.jpg (4 quadros numa imagem) e relatorio.json.
// Imprime um resumo curto. Olhe a folha.jpg só dos sites que o resumo marcar como interessantes.
import puppeteer from 'puppeteer-core'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const urls = process.argv.slice(2)
if (!urls.length) {
  console.error('Uso: node scripts/inspect-site.mjs <url> [<url>...]')
  process.exit(1)
}

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
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p))
if (!browserPath) {
  console.error('Nenhum navegador encontrado. Defina CHROME_PATH.')
  process.exit(1)
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const root = fileURLToPath(new URL('../docs/repertorio/.capturas/', import.meta.url))

// Roda dentro da página.
function probe() {
  const hex = (c) => {
    const m = c && c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1].split(/[ ,/]+/).map(Number)
    if (p.length >= 4 && p[3] === 0) return null
    return '#' + p.slice(0, 3).map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')
  }
  const top = (map, n) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k)
  const vw = innerWidth
  const vh = innerHeight

  const bg = new Map()
  const fg = new Map()
  for (const el of [...document.querySelectorAll('body *')].slice(0, 900)) {
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) continue
    const cs = getComputedStyle(el)
    const b = hex(cs.backgroundColor)
    if (b) bg.set(b, (bg.get(b) || 0) + r.width * r.height)
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('').length
    if (text) {
      const c = hex(cs.color)
      if (c) fg.set(c, (fg.get(c) || 0) + text)
    }
  }
  const bodyBg = hex(getComputedStyle(document.body).backgroundColor) || hex(getComputedStyle(document.documentElement).backgroundColor)

  const libs = {}
  if (window.gsap) libs.gsap = window.gsap.version || true
  if (window.ScrollTrigger) libs.ScrollTrigger = true
  if (window.ScrollSmoother) libs.ScrollSmoother = true
  if (window.Lenis || document.documentElement.classList.contains('lenis')) libs.lenis = true
  if (/has-scroll-smooth/.test(document.documentElement.className)) libs.locomotive = true
  if (window.THREE) libs.three = window.THREE.REVISION
  if (window.PIXI) libs.pixi = true
  if (window.lottie || window.bodymovin) libs.lottie = true
  if (window.barba) libs.barba = true
  if (window.Swiper) libs.swiper = true
  if (window.Webflow) libs.webflow = true
  if (window.__NUXT__ || window.useNuxtApp) libs.nuxt = true
  if (window.__NEXT_DATA__ || document.getElementById('__next')) libs.next = true
  if (document.querySelector('[data-framer-name],[data-framer-component-type]')) libs.framer = true
  if (window.Shopify) libs.shopify = true
  const scripts = performance.getEntriesByType('resource').filter((e) => e.initiatorType === 'script' || /\.js(\?|$)/.test(e.name))
  const jsKb = Math.round(scripts.reduce((s, e) => s + (e.transferSize || e.encodedBodySize || 0), 0) / 1024)
  const named = scripts.map((e) => e.name.split('/').pop().split('?')[0]).filter((n) => /gsap|lenis|three|locomotive|swiper|barba|lottie|pixi|scrolltrigger|split|motion|ogl|curtains/i.test(n))

  const h1 = document.querySelector('h1')
  const typo = (el) => {
    if (!el) return null
    const cs = getComputedStyle(el)
    return { familia: cs.fontFamily.split(',')[0].replace(/["']/g, ''), tamanho: cs.fontSize, peso: cs.fontWeight, caixa: cs.textTransform, espacamento: cs.letterSpacing, linha: cs.lineHeight }
  }
  const fonts = [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/["']/g, '')))]

  const canvases = [...document.querySelectorAll('canvas')].slice(0, 4).map((c) => `${c.clientWidth}x${c.clientHeight}`)
  const videos = [...document.querySelectorAll('video')].map((v) => (v.autoplay || v.hasAttribute('autoplay') ? 'auto' : 'manual') + (v.loop ? '+loop' : ''))
  const all = [...document.querySelectorAll('body *')]
  const sticky = all.filter((e) => getComputedStyle(e).position === 'sticky').length
  const snap = all.some((e) => { const s = getComputedStyle(e).scrollSnapType; return s && s !== 'none' })
  const cursor = getComputedStyle(document.body).cursor === 'none' || !!document.querySelector('[class*="cursor" i]:not(html):not(body)')

  return {
    titulo: document.title,
    h1: h1 ? h1.innerText.trim().replace(/\s+/g, ' ').slice(0, 90) : null,
    h2: [...document.querySelectorAll('h2')].slice(0, 6).map((h) => h.innerText.trim().replace(/\s+/g, ' ').slice(0, 50)),
    nav: [...document.querySelectorAll('nav a, header a')].slice(0, 8).map((a) => a.innerText.trim().replace(/\s+/g, ' ').slice(0, 20)).filter(Boolean),
    bibliotecas: libs,
    scriptsLidos: [...new Set(named)].slice(0, 8),
    jsKb,
    fontes: fonts.slice(0, 6),
    tipografiaH1: typo(h1),
    tipografiaCorpo: typo(document.body),
    fundoBody: bodyBg,
    fundos: top(bg, 5),
    textos: top(fg, 4),
    animacoesAtivas: document.getAnimations().length,
    canvas: canvases,
    videos,
    sticky,
    scrollSnap: snap,
    cursorProprio: cursor,
    imagens: document.querySelectorAll('img, picture').length,
    svgs: document.querySelectorAll('svg').length,
    altura: document.documentElement.scrollHeight,
    secoes: document.querySelectorAll('main > *, body > section').length,
    vh,
    vw,
  }
}

// Rastreia sempre os MESMOS elementos (guardados na página) para separar o que muda com o tempo do que muda com a rolagem.
function installTracker() {
  const read = () =>
    window.__tracked.map((e) => {
      const cs = getComputedStyle(e)
      return cs.transform + '|' + cs.opacity + '|' + cs.clipPath + '|' + cs.filter
    })
  window.__trackRead = read
  window.__trackStart = () => {
    window.__tracked = [...document.querySelectorAll('body *')]
      .filter((e) => {
        const r = e.getBoundingClientRect()
        return r.width > 40 && r.height > 20 && r.bottom > 0 && r.top < innerHeight
      })
      .slice(0, 200)
    return read()
  }
  window.__trackNames = (indices) =>
    indices.slice(0, 5).map((i) => {
      const e = window.__tracked[i]
      return e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/)[0].slice(0, 24) : '')
    })
}

async function scrollTo(page, target) {
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => scrollY)
    const diff = target - y
    if (Math.abs(diff) < 30) break
    await page.mouse.wheel({ deltaY: Math.max(-900, Math.min(900, diff)) })
    await wait(260)
  }
}

const browser = await puppeteer.launch({
  executablePath: browserPath,
  headless: browserPath.includes('headless-shell') ? 'shell' : true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
})

mkdirSync(root, { recursive: true })

try {
  for (const url of urls) {
    const slug = new URL(url).hostname.replace(/^www\./, '').replace(/[^a-z0-9]+/gi, '-')
    const dir = `${root}${slug}\\`
    mkdirSync(dir, { recursive: true })
    const page = await browser.newPage()
    await page.setUserAgent(UA)
    await page.setViewport({ width: 1440, height: 900 })
    const report = { url, data: new Date().toISOString().slice(0, 10) }
    try {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
      } catch (e) {
        report.aviso = 'carregamento lento: ' + String(e.message).slice(0, 60)
      }
      await wait(7000)
      // Fecha popups comuns (newsletter, cookies) para não cobrirem as capturas.
      await page.keyboard.press('Escape').catch(() => {})
      await page.evaluate(() => {
        for (const b of document.querySelectorAll('[aria-label*="close" i], [aria-label*="fechar" i], button[class*="close" i], [id*="cookie" i] button, [class*="cookie" i] button')) {
          if (/close|fechar|×|✕|accept|aceitar|agree/i.test((b.getAttribute('aria-label') || '') + b.textContent)) b.click()
        }
        // Se sobrou popup: esconde caixas fixas com texto de cadastro/cookies e o fundo escurecido atrás delas.
        const area = innerWidth * innerHeight
        for (const el of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(el)
          if (cs.position !== 'fixed' || cs.display === 'none') continue
          const r = el.getBoundingClientRect()
          if (r.width * r.height < area * 0.08 || el.querySelector('h1, nav')) continue
          const scrim = (cs.backgroundColor.match(/rgba\(0, 0, 0, ([\d.]+)\)/) || [])[1]
          const isPopup = /sign up|subscribe|newsletter|% off|cookie|accept all|aceitar|cadastre/i.test(el.innerText || '')
          if (isPopup || (scrim && +scrim > 0.15 && +scrim < 0.95 && r.width * r.height > area * 0.8)) el.style.display = 'none'
        }
      }).catch(() => {})
      await wait(800)
      Object.assign(report, await page.evaluate(probe))

      const shots = []
      const max = Math.max(0, report.altura - report.vh)
      await page.evaluate(installTracker)
      const A = await page.evaluate(() => window.__trackStart())
      await wait(900)
      const B = await page.evaluate(() => window.__trackRead())
      const timeBased = new Set(A.map((v, i) => (v !== B[i] ? i : -1)).filter((i) => i >= 0))
      for (const f of [0, 0.25, 0.5, 0.75]) {
        await scrollTo(page, Math.round(max * f))
        await wait(1200)
        shots.push(await page.screenshot({ type: 'jpeg', quality: 55 }))
        if (f === 0.25) {
          const C = await page.evaluate(() => window.__trackRead())
          const scrollBased = B.map((v, i) => (v !== C[i] && !timeBased.has(i) ? i : -1)).filter((i) => i >= 0)
          report.elementosPorTempo = timeBased.size
          report.elementosReagindoAoScroll = scrollBased.length
          report.exemplosReagindoAoScroll = await page.evaluate((idx) => window.__trackNames(idx), scrollBased)
        }
      }
      report.rolagemFuncionou = (await page.evaluate(() => scrollY)) > 100

      const sheet = await browser.newPage()
      await sheet.setViewport({ width: 1440, height: 900 })
      await sheet.setContent(
        `<body style="margin:0;display:grid;grid-template-columns:1fr 1fr;gap:4px;background:#000">${shots
          .map((b) => `<img style="width:100%;display:block" src="data:image/jpeg;base64,${b.toString('base64')}">`)
          .join('')}</body>`,
      )
      await sheet.screenshot({ path: `${dir}folha.jpg`, type: 'jpeg', quality: 60, fullPage: true })
      await sheet.close()
    } catch (e) {
      report.erro = String(e.message).slice(0, 120)
    }
    await page.close()
    writeFileSync(`${dir}relatorio.json`, JSON.stringify(report, null, 1))

    const b = Object.keys(report.bibliotecas || {}).join(', ') || 'nenhuma detectada'
    console.log(`\n=== ${slug}  (${report.erro ? 'ERRO: ' + report.erro : 'ok'})`)
    if (!report.erro) {
      console.log(`h1: ${report.h1}`)
      console.log(`bibliotecas: ${b}${report.scriptsLidos?.length ? ' | scripts: ' + report.scriptsLidos.join(', ') : ''} | JS ${report.jsKb} KB`)
      console.log(`fontes: ${report.fontes.join(', ')} | h1: ${report.tipografiaH1?.familia} ${report.tipografiaH1?.tamanho}/${report.tipografiaH1?.peso} ${report.tipografiaH1?.caixa}`)
      console.log(`cores: fundo ${report.fundoBody} · áreas ${report.fundos.join(' ')} · texto ${report.textos.join(' ')}`)
      console.log(`movimento: ${report.animacoesAtivas} animações ativas · ${report.elementosReagindoAoScroll} reagem ao scroll (${(report.exemplosReagindoAoScroll || []).join(', ') || '-'}) + ${report.elementosPorTempo} por tempo · canvas ${report.canvas.join(',') || '0'} · vídeos ${report.videos.join(',') || '0'} · sticky ${report.sticky} · cursor próprio ${report.cursorProprio} · snap ${report.scrollSnap}`)
      console.log(`estrutura: ${report.secoes} seções, ${report.altura}px de altura, ${report.imagens} imagens | rolagem ok: ${report.rolagemFuncionou}`)
    }
  }
} finally {
  await browser.close()
}
console.log('\nCapturas em docs/repertorio/.capturas/<site>/folha.jpg (fora do git).')
