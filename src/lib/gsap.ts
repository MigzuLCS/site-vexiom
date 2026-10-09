// Ponto único de entrada do GSAP: importe daqui, nunca de 'gsap' direto,
// para os plugins serem registrados uma vez só.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)

// Ritmo da marca (docs/marca.md): cubic-bezier(.2,.7,.1,1) como curva padrão.
CustomEase.create('vexiom', '0.2,0.7,0.1,1')
gsap.defaults({ ease: 'vexiom', duration: 0.6 })

export const REDUZIR = '(prefers-reduced-motion: reduce)'
// Para combinar com outras condições (ex.: largura) use MOVIMENTO: 'not all and' não combina.
export const MOVIMENTO = '(prefers-reduced-motion: no-preference)'
export const prefereReduzir = () => typeof matchMedia !== 'undefined' && matchMedia(REDUZIR).matches

export { gsap, ScrollTrigger, SplitText, useGSAP }
