import { Menu } from '@/secoes/Menu'
import { Hero } from '@/secoes/Hero'
import { QuemSomos } from '@/secoes/QuemSomos'
import { Capacidades } from '@/secoes/Capacidades'
import { Portfolio } from '@/secoes/Portfolio'
import { Precos } from '@/secoes/Precos'
import { Duvidas } from '@/secoes/Duvidas'
import { cn } from '@/lib/utils'

// Seções entram uma a uma (docs/DIRECTION.md). As provisórias só existem para o menu
// ter destino; cada uma é substituída pela seção de verdade.
function Provisoria({ id, titulo, escuro }: { id: string; titulo: string; escuro?: boolean }) {
  return (
    <section
      id={id}
      data-escuro={escuro ? '' : undefined}
      className={cn('min-h-svh px-4 py-24 sm:px-8', escuro ? 'bg-tinta text-papel' : 'bg-papel text-tinta')}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold">{titulo}</h2>
        <p className={cn('mt-3', escuro ? 'text-papel/70' : 'text-cinza')}>[PREENCHER] seção em construção.</p>
      </div>
    </section>
  )
}

export default function Pagina() {
  return (
    <>
      <Menu />
      <main>
        <Hero />
        <QuemSomos />
        <Capacidades />
        <Portfolio />
        <Precos />
        <Duvidas />
        <Provisoria id="contato" titulo="Contato" escuro />
      </main>
    </>
  )
}
