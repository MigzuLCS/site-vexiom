# Marquee

Uma faixa de texto que corre sem parar. Dá ritmo e voz, desde que o conteúdo seja real e curto: pratos, ingredientes, bairros atendidos. Nunca coloque informação essencial **só** no marquee.

**Nível:** Contido (é só CSS) · **Depende de:** nada

```css
/* theme.css */
.marquee { overflow: hidden; }
.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee var(--marquee-speed, 40s) linear infinite;
}
.marquee:hover .marquee__track { animation-play-state: paused; }
@keyframes marquee { to { translate: -50% 0; } }

@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none; width: auto; flex-wrap: wrap; }
  .marquee__track > [aria-hidden] { display: none; }
}
```

```jsx
function Marquee({ children, className = '' }) {
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee__track">
        <div className="flex shrink-0 items-center gap-12 pr-12">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center gap-12 pr-12">{children}</div>
      </div>
    </div>
  )
}

// <Marquee className="py-6 font-display text-[clamp(2rem,6vw,5rem)]">
//   <span>Café coado</span><span aria-hidden="true">·</span><span>Pão de fermentação natural</span>
// </Marquee>
```

**Cuidados**
- As duas cópias precisam ser idênticas (inclusive o `pr-12`, igual ao `gap`), senão o laço dá um salto.
- A segunda cópia tem `aria-hidden` para o leitor de tela não ler tudo duas vezes.
- Velocidade: 30–60s para uma volta. Mais rápido que isso cansa.
