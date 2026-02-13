'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from '../strategies/types'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useMemo, useRef } from 'react'
import { useAfterTransition, useBeforeTransition, useTransitionSetup } from '../hooks/use-transition'

/**
 * ページ遷移用Context値
 * router.push/replace を実行する
 */
export interface PageTransitionRouterValue {
  push: (href: string) => Promise<void>
  replace: (href: string) => Promise<void>
}

/**
 * PageTransitionProvider用Context
 */
export const PageTransitionContext = createContext<PageTransitionRouterValue | null>(null)

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
  const isReplaceRef = useRef<boolean>(false)

  const { pendingToRef, containerRef, strategyRef, isAnimatingRef } = useTransitionSetup(strategy, pathname)

  const onExecute = useCallback(async () => {
    if (pendingToRef.current) {
      isReplaceRef.current
        ? router.replace(pendingToRef.current)
        : router.push(pendingToRef.current)
    }
  }, [router])

  const execute = useBeforeTransition(strategyRef, containerRef, onExecute, isAnimatingRef)

  // pathname 変更時に afterTransition を実行
  useAfterTransition(strategyRef, containerRef, pathname, isAnimatingRef)

  const transitionTo = useCallback(
    async (href: string, replace: boolean = false) => {
      if (href === pendingToRef.current || isAnimatingRef.current)
        return

      pendingToRef.current = href
      isReplaceRef.current = replace

      try {
        await execute()
      }
      catch (error) {
        isAnimatingRef.current = false
        throw error
      }
    },
    [execute],
  )

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
