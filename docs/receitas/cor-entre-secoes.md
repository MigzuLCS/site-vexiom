# Cor entre seções

O fundo da página inteira muda de cor quando uma seção chega ao meio da tela, como luz que muda de um ambiente para outro: dia → noite, salão → cozinha. Um gesto grande com quase nenhum código.

**Nível:** Contido · **Depende de:** nada

```jsx
import { useEffect } from 'react'

function useCorEntreSecoes() {
  useEffect(() => {
    const sections = document.querySelectorAll('[data-tema]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) document.documentElement.dataset.tema = e.target.dataset.tema
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
}

// No Site(): useCorEntreSecoes()
// Em cada seção: <section data-tema="dia"> ... <section data-tema="noite">
```

```css
/* theme.css */
body { transition: background-color 700ms var(--ease-out), color 700ms var(--ease-out); }
html[data-tema="noite"] body { background: var(--color-ink); color: var(--color-paper); }
@media (prefers-reduced-motion: reduce) { body { transition: none; } }
```

**Cuidados**
- As seções que participam ficam **sem fundo próprio** e herdam a cor do texto (`text-current`, nada de `text-ink` fixo dentro delas).
- Dê `data-tema` a todas as seções do trecho, inclusive a que volta ao tema inicial; senão a cor "gruda".
- Confira o contraste nos dois temas, incluindo o acento sobre o fundo escuro.
- Sem JS, a página fica no tema padrão do `body`, que precisa funcionar sozinho.
