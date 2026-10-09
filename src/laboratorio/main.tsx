// Laboratório: só no `npm run dev` (http://localhost:5173/laboratorio.html). Não entra no build.
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/red-hat-display'
import '@/styles/global.css'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Magnetico } from '@/components/Magnetico'

createRoot(document.getElementById('root')!).render(
  <main className="min-h-svh bg-papel">
    <h1 className="px-8 pt-10 text-2xl font-bold">Botões · laboratório</h1>
    <div className="flex flex-wrap items-center gap-6 px-8 py-12">
      <Magnetico>
        <InteractiveHoverButton href="#" texto="Quero meu site" tamanho="lg" />
      </Magnetico>
      <InteractiveHoverButton href="#" texto="Fale com a gente" />
    </div>
    <div className="flex flex-wrap items-center gap-6 bg-azul px-8 py-12">
      <InteractiveHoverButton href="#" texto="Quero meu site" tamanho="lg" tom="escuro" />
      <InteractiveHoverButton href="#" texto="Fale com a gente" tom="escuro" />
    </div>
  </main>,
)
