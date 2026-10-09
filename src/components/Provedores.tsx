'use client'

import { useEffect, type ReactNode } from 'react'
import { SmoothScroll } from '@/components/SmoothScroll'

// Tudo que precisa do navegador para o site inteiro: rolagem suave e o aviso de que o app
// montou (desliga a trava de segurança do layout). Quando entrar um componente que usa
// "motion", envolva aqui com <MotionConfig reducedMotion="user"> (hoje nenhum usa, e o
// motion sozinho pesa na primeira carga).
export function Provedores({ children }: { children: ReactNode }) {
  useEffect(() => {
    ;(window as Window & { __vexiomPronto?: boolean }).__vexiomPronto = true
  }, [])
  return <SmoothScroll>{children}</SmoothScroll>
}
