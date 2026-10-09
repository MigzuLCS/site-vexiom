import localFont from 'next/font/local'

// Fontes pelo next/font: o mesmo arquivo do @fontsource-variable (só o subconjunto latino,
// que cobre o português e os símbolos do site), com pré-carregamento e uma fonte substituta
// com medidas ajustadas, para o texto não "pular" quando a fonte real chega (CLS).
export const montserrat = localFont({
  src: '../../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--fonte-montserrat',
  adjustFontFallback: 'Arial',
})

export const redHat = localFont({
  src: '../../node_modules/@fontsource-variable/red-hat-display/files/red-hat-display-latin-wght-normal.woff2',
  weight: '300 900',
  display: 'swap',
  variable: '--fonte-red-hat',
  adjustFontFallback: 'Arial',
})
