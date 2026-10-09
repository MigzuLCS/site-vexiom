import { Menu } from '@/secoes/Menu'
import { Hero } from '@/secoes/Hero'
import { QuemSomos } from '@/secoes/QuemSomos'
import { Capacidades } from '@/secoes/Capacidades'
import { Portfolio } from '@/secoes/Portfolio'
import { Precos } from '@/secoes/Precos'
import { Duvidas } from '@/secoes/Duvidas'
import { Contato } from '@/secoes/Contato'

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
        <Contato />
      </main>
    </>
  )
}
