'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from './shared'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef } from 'react'
import { useAfterTransition, useTransitionProvider } from '../hooks/use-transition-provider'
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

  // 遷移先URL を保持する ref（useCallback で参照するため）
  const hrefRef = useRef<string | null>(null)
  const isReplaceRef = useRef<boolean>(false)

  const shouldSkip = useCallback(
    () => hrefRef.current === pathname,
    [pathname],
  )

  const onExecute = useCallback(async () => {
    if (hrefRef.current) {
      isReplaceRef.current
        ? router.replace(hrefRef.current)
        : router.push(hrefRef.current)
    }
  }, [router])

  const { containerRef, execute, isAnimatingRef, strategyRef } = useTransitionProvider(
    strategy,
    onExecute,
    shouldSkip,
  )

  // pathname 変更時に afterTransition を実行
  useAfterTransition(strategyRef, containerRef, pathname, isAnimatingRef)

  const transitionTo = useCallback(
    async (href: string, replace: boolean = false) => {
      hrefRef.current = href
      isReplaceRef.current = replace
      await execute()
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
