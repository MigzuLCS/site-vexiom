// Laboratório: só no `npm run dev` (http://localhost:5173/laboratorio.html). Não entra no build.
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/red-hat-display'
import '@/styles/global.css'
import { Botao, type Variante } from '@/components/Botao'
import { Magnetico } from '@/components/Magnetico'

const variantes: { v: Variante; nome: string; ref: string }[] = [
  { v: 'cortina', nome: 'A · Cortina diagonal', ref: '21st Motion Button / Interactive Hover Button' },
  { v: 'cursor', nome: 'B · Cursor que vira botão', ref: 'bloco laranja da logo; 21st Flip/Hover Button' },
  { v: 'sombra', nome: 'C · Sombra dura com vão', ref: '21st Neobrutalism Button / Pop Button' },
  { v: 'brilho', nome: 'D · Brilho diagonal', ref: 'React Bits GlareHover / 21st Shining Button' },
]

function Linha({ escuro }: { escuro?: boolean }) {
  return (
    <div className={escuro ? 'bg-azul px-8 py-12 text-papel' : 'px-8 py-12'}>
      <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
        {variantes.map(({ v, nome, ref }) => (
          <div key={v}>
            <p className="text-sm font-semibold">{nome}</p>
            <p className={escuro ? 'mb-5 text-xs text-papel/60' : 'mb-5 text-xs text-cinza'}>{ref}</p>
            <div className="flex flex-wrap items-center gap-6">
              <Magnetico>
                <Botao href="#" variante={v} escuro={escuro}>
                  Quero meu site
                </Botao>
              </Magnetico>
              <Botao href="#" variante={v} escuro={escuro} forcar>
                Quero meu site
              </Botao>
              <span className={escuro ? 'text-xs text-papel/50' : 'text-xs text-cinza'}>← normal · com hover →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <main className="min-h-svh bg-papel">
    <h1 className="px-8 pt-10 text-2xl font-bold">Botões · laboratório</h1>
    <Linha />
    <Linha escuro />
  </main>,
)
