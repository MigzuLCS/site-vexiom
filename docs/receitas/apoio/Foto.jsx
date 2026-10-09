import { useEffect, useState } from 'react'

// Foto de um site: a imagem real de public/img ou, enquanto ela não existe, um placeholder honesto.
// Modo de teste (só no `npm run dev`): abra o site com ?fotos=teste e os placeholders que têm `busca`
// recebem fotos livres do Openverse (licença de uso comercial), só para avaliar ritmo e composição.
// Nada disso entra no build: em produção, sem `src`, o placeholder aparece.
const TEST = import.meta.env.DEV && new URLSearchParams(window.location.search).get('fotos') === 'teste'
const cache = new Map()

function proportions(ratio) {
  const [w, h] = String(ratio).split('/').map(Number)
  return h ? w / h : 1
}

function aspect(ratio) {
  const r = proportions(ratio)
  if (Math.abs(r - 1) < 0.15) return 'square'
  return r > 1 ? 'wide' : 'tall'
}

function hash(text) {
  let h = 0
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

function search(query, shape) {
  const key = `${query}|${shape}`
  if (!cache.has(key)) {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license_type=commercial&aspect_ratio=${shape}&mature=false&page_size=20`
    cache.set(
      key,
      fetch(url)
        .then((r) => (r.ok ? r.json() : { results: [] }))
        .then((j) => j.results ?? [])
        .catch(() => []),
    )
  }
  return cache.get(key)
}

export function useTestPhoto(busca, ratio, seed) {
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    if (!TEST || !busca) return
    let alive = true
    search(busca, aspect(ratio)).then((results) => {
      if (!alive) return
      if (results.length) {
        const r = results[hash(seed) % results.length]
        setPhoto({ src: r.width > 2400 && r.thumbnail ? r.thumbnail : r.url, credit: `${r.creator || 'autor desconhecido'} · ${r.license.toUpperCase()} · ${r.source}` })
      } else {
        const h = Math.round(1200 / proportions(ratio))
        setPhoto({ src: `https://picsum.photos/seed/${hash(seed)}/1200/${h}`, credit: 'Picsum (busca sem resultado)' })
      }
    })
    return () => {
      alive = false
    }
  }, [busca, ratio, seed])

  return photo
}

/**
 * <Foto alt="o balcão visto da porta" ratio="4 / 5" busca="coffee shop counter" />
 * - src: caminho real (/img/balcao.jpg). Sem ele, aparece o placeholder com o `alt` como legenda.
 * - busca: termos em inglês para o modo de teste. Não afeta produção.
 * - Img: troque por motion.img para animar a imagem (parallax, máscara); imgStyle vai para ela.
 */
export default function Foto({ src, alt, ratio = '4 / 5', busca, priority = false, className = '', imgClassName = '', Img = 'img', imgStyle }) {
  const test = useTestPhoto(src ? null : busca, ratio, alt)
  const url = src ?? test?.src

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
      {url ? (
        <Img
          src={url}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          style={imgStyle}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div
          role="img"
          aria-label={`Foto a definir: ${alt}`}
          className="absolute inset-0 grid place-items-end p-4"
          style={{ background: 'color-mix(in srgb, var(--color-muted) 16%, var(--color-paper))' }}
        >
          <span className="justify-self-start text-xs font-medium uppercase tracking-[0.14em] text-muted">Foto: {alt}</span>
        </div>
      )}
      {test && !src && (
        <span className="absolute bottom-1 right-1 max-w-[90%] truncate bg-black/65 px-1.5 py-0.5 text-[10px] leading-tight text-white">
          teste · {test.credit}
        </span>
      )}
    </div>
  )
}
