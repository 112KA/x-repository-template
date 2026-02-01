'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from './shared'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { PageTransitionContext } from './shared'

export interface PageTransitionProviderProps {
  children: ReactNode
  strategy: ViewTransitionStrategy
}

/**
 * ページ遷移時のアニメーション管理プロバイダー
 * router.push/replace と連携してアニメーションを実行
 */
export function PageTransitionProvider({ children, strategy }: PageTransitionProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)

  const strategyRef = useRef<ViewTransitionStrategy>(strategy)
  strategyRef.current = strategy

  useEffect(() => {
    return () => {
      strategy.cleanup()
    }
  }, [strategy])

  const transitionTo = useCallback(
    async (href: string, replace: boolean = false) => {
      if (href === pathname || isAnimatingRef.current)
        return

      isAnimatingRef.current = true

      try {
        // アニメーション開始
        await strategyRef.current?.beforeTransition(
          { element: containerRef.current },
        )

        // ページ遷移を実行
        replace ? router.replace(href) : router.push(href)
      }
      catch (error) {
        isAnimatingRef.current = false
        throw error
      }
    },
    [pathname, router],
  )

  // ページ遷移後のアニメーション完了処理
  useEffect(() => {
    let isCancelled = false

    const run = async () => {
      try {
        await strategyRef.current?.afterTransition(
          { element: containerRef.current },
        )
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

  const routerValue = useMemo(
    () => ({
      push: (href: string) => transitionTo(href, false),
      replace: (href: string) => transitionTo(href, true),
    }),
    [transitionTo],
  )

  return (
    <PageTransitionContext.Provider value={routerValue}>
      <div ref={containerRef} className="h-full">
        {children}
      </div>
    </PageTransitionContext.Provider>
  )
}
