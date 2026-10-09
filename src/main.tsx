import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/red-hat-display'
import '@fontsource-variable/red-hat-display/wght-italic.css'
import '@/styles/global.css'
import { SmoothScroll } from '@/components/SmoothScroll'
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </MotionConfig>
  </StrictMode>,
)
