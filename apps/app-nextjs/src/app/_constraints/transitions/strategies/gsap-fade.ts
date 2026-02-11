import type { ViewTransitionStrategy } from '../providers/shared'
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
    beforeTransition: async (context) => {
      // フェードアウト（共通）
      // Strategy はアニメーション処理のみを行う
      // navigate処理はProvider側で実行
      await animate(context.element, 0)
    },
    afterTransition: async (context) => {
      // フェードイン（共通）
      await animate(context.element, 1)
    },
    cleanup: () => {
      killTween()
    },
  }
}
