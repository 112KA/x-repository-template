import { vi } from 'vitest'

interface GsapToOptions {
  onComplete?: () => void
}

export function getMocks() {
  const { killSpy } = vi.hoisted(() => {
    const killSpy = vi.fn()
    return { killSpy }
  })

  vi.mock('gsap', () => ({
    default: {
      to: (_el: unknown, opts: GsapToOptions) => {
        setTimeout(() => {
          opts.onComplete?.()
        }, 0)
        return { kill: killSpy }
      },
    },
  }))

  return { killSpy }
}
