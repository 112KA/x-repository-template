import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { vi } from 'vitest'

export function getMocks() {
  const { pushSpy, replaceSpy, backSpy, forwardSpy, refreshSpy, prefetchSpy } = vi.hoisted(() => {
    const pushSpy = vi.fn<(href: string, options?: NavigateOptions) => void>()
    const replaceSpy = vi.fn<(href: string, options?: NavigateOptions) => void>()
    const backSpy = vi.fn()
    const forwardSpy = vi.fn()
    const refreshSpy = vi.fn()
    const prefetchSpy = vi.fn()

    return {
      pushSpy,
      replaceSpy,
      backSpy,
      forwardSpy,
      refreshSpy,
      prefetchSpy,
    }
  })

  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: pushSpy,
      replace: replaceSpy,
      back: backSpy,
      forward: forwardSpy,
      refresh: refreshSpy,
      prefetch: prefetchSpy,
    }),
    usePathname: () => '/',
  }))

  return { pushSpy, replaceSpy, backSpy, forwardSpy, refreshSpy, prefetchSpy }
}
