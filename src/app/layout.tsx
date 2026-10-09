import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '@fontsource-variable/red-hat-display'
import '@fontsource-variable/red-hat-display/wght-italic.css'
import '@/styles/global.css'
import { Provedores } from '@/components/Provedores'

export const metadata: Metadata = {
  title: 'Vexiom · estúdio de sites',
  description: 'Vexiom: estúdio que cria sites para negócios, do comércio local a sistemas sob medida.',
  icons: {
    icon: [
      { url: '/brand/vexiom-favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/vexiom-favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/brand/vexiom-favicon-180.png',
  },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

// Antes do primeiro quadro: marca que há JS, para o CSS esconder só o que vai entrar
// animado na primeira tela (ver "Entradas do primeiro quadro" em global.css). Se o app
// não montar em 4 s (JS bloqueado ou com erro), tira a marca e tudo aparece.
const marcarJs = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__vexiomPronto)document.documentElement.classList.remove('js')},4000)`

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: marcarJs }} />
      </head>
      <body>
        <Provedores>{children}</Provedores>
      </body>
    </html>
  )
}
