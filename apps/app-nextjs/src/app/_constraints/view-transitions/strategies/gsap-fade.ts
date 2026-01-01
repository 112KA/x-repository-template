import type { ViewTransitionStrategy } from '../types'
import gsap from 'gsap'

export interface FadeStrategyOptions {
  duration?: number
  ease?: string
}

export function createFadeStrategy(options?: FadeStrategyOptions): ViewTransitionStrategy {
  const { duration = 0.5, ease = 'power1.out' } = options ?? {}
  let tween: gsap.core.Tween | null = null

  const killTween = () => {
    if (!tween) {
      return
    }

    tween.kill()
    tween = null
  }

  const animate = (element: HTMLDivElement | null, opacity: number) =>
    new Promise<void>((resolve) => {
      if (!element) {
        resolve()
        return
      }

      killTween()
      tween = gsap.to(element, {
        duration,
        opacity,
        ease,
        overwrite: 'auto',
        onComplete: () => {
          tween = null
          resolve()
        },
      })
    })

  return {
    beforeNavigate: async ({ element, navigate }) => {
      await animate(element, 0)
      navigate()
    },
    afterEnter: async ({ element }) => {
      await animate(element, 1)
    },
    cleanup: () => {
      killTween()
    },
  }
}
