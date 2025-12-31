'use client'

import type { ReactNode } from 'react'
import gsap from 'gsap'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useEffect, useMemo, useRef } from 'react'

export interface ViewTransitionRouterValue {
  push: (href: string) => Promise<void>
  replace: (href: string) => Promise<void>
}

interface ViewTransitionNavigateOptions {
  replace?: boolean
}

export const ViewTransitionContext = createContext<ViewTransitionRouterValue | null>(null)

const FADE_DURATION = 0.5
const EASE = 'power1.out'

export function ViewTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)

  const fadeTo = useCallback(
    (opacity: number) =>
      new Promise<void>((resolve) => {
        const element = containerRef.current

        if (!element) {
          resolve()
          return
        }

        gsap.to(element, {
          duration: FADE_DURATION,
          opacity,
          ease: EASE,
          overwrite: 'auto',
          onComplete: () => resolve(),
        })
      }),
    [],
  )

  const transitionTo = useCallback(
    async (href: string, options?: ViewTransitionNavigateOptions) => {
      const shouldSkipNavigation = href === pathname || isAnimatingRef.current

      if (shouldSkipNavigation) {
        return
      }

      isAnimatingRef.current = true
      await fadeTo(0)

      const performNavigation = options?.replace ? router.replace : router.push
      performNavigation(href)
    },
    [fadeTo, pathname, router],
  )

  useEffect(() => {
    const element = containerRef.current

    if (!element) {
      return
    }

    const tween = gsap.to(element, {
      duration: FADE_DURATION,
      opacity: 1,
      ease: EASE,
      overwrite: 'auto',
      onComplete: () => {
        isAnimatingRef.current = false
      },
    })

    return () => {
      tween.kill()
    }
  }, [pathname])

  const value = useMemo(
    () => ({
      push: (href: string) => transitionTo(href),
      replace: (href: string) => transitionTo(href, { replace: true }),
    }),
    [transitionTo],
  )

  return (
    <ViewTransitionContext.Provider value={value}>
      <div ref={containerRef} className="h-full">
        {children}
      </div>
    </ViewTransitionContext.Provider>
  )
}
