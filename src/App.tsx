import { Hero } from '@/secoes/Hero'

// Seções entram uma a uma (docs/DIRECTION.md). Contato provisório até a seção existir.
export default function App() {
  return (
    <main>
      <Hero />
      <section id="contato" className="min-h-svh bg-azul px-4 py-24 text-papel sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">Contato</h2>
          <p className="mt-3 text-papel/80">[PREENCHER] WhatsApp, Instagram e e-mail.</p>
        </div>
      </section>
    </main>
  )
}
