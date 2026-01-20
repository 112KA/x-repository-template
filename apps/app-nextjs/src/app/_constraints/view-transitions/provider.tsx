'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from './types'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useEffect, useMemo, useRef } from 'react'
import { createFadeStrategy } from './strategies/gsap-fade'

export interface ViewTransitionRouterValue {
  push: (href: string) => Promise<void>
  replace: (href: string) => Promise<void>
}

interface ViewTransitionNavigateOptions {
  replace?: boolean
}

export const ViewTransitionContext = createContext<ViewTransitionRouterValue | null>(null)

export interface ViewTransitionProviderProps {
  children: ReactNode
  strategy?: ViewTransitionStrategy
}

export function ViewTransitionProvider({ children, strategy }: ViewTransitionProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
  const fallbackStrategy = useMemo(() => createFadeStrategy(), [])
  const resolvedStrategy = strategy ?? fallbackStrategy
  const strategyRef = useRef<ViewTransitionStrategy>(resolvedStrategy)
  strategyRef.current = resolvedStrategy

  useEffect(() => {
    return () => {
      resolvedStrategy.cleanup()
    }
  }, [resolvedStrategy])

  const transitionTo = useCallback(
    async (href: string, options?: ViewTransitionNavigateOptions) => {
      if (href === pathname || isAnimatingRef.current)
        return

      isAnimatingRef.current = true

      try {
        await strategyRef.current?.beforeNavigate?.({
          element: containerRef.current,
          href,
          fromPathname: pathname,
          router,
          navigate: () => {
            options?.replace ? router.replace(href) : router.push(href)
          },
        })
      }
      catch (error) {
        isAnimatingRef.current = false
        throw error
      }
    },
    [pathname, router],
  )

  useEffect(() => {
    let isCancelled = false

    const run = async () => {
      try {
        await strategyRef.current?.afterEnter?.({
          element: containerRef.current,
          pathname,
        })
      }
      finally {
        if (!isCancelled) {
          isAnimatingRef.current = false
        }
      }
    }

    run()

    return () => {
      isCancelled = true
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
      {/* h-full: 入れ子にしても破綻しないように縦サイズは親の高さに合わせる */}
      <div ref={containerRef} className="h-full">
        {children}
      </div>
    </ViewTransitionContext.Provider>
  )
}
