'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from '../strategies/types'
import { createContext, useCallback, useMemo, useState } from 'react'
import { useAfterTransition, useBeforeTransition, useTransitionSetup } from '../hooks/use-transition'

/**
 * ビュー切り替え用Context値
 * ページ遷移なしでビュー切り替え
 */
export interface ViewTransitionContextValue {
  to: (viewId: string) => Promise<void>
  currentViewId: string | null
}

/**
 * ViewTransitionProvider用Context
 */
export const ViewTransitionContext = createContext<ViewTransitionContextValue | null>(null)

export interface ViewTransitionProviderProps {
  children: ReactNode
  strategy: ViewTransitionStrategy
  initialViewId: string
}

/**
 * ビュー切り替え（ページ遷移なし）アニメーション管理プロバイダー
 * ページ遷移なしで複数ビューを切り替える際に使用
 */
export function ViewTransitionProvider({ children, strategy, initialViewId }: ViewTransitionProviderProps) {
  const [currentViewId, setCurrentViewId] = useState<string>(initialViewId)

  const { pendingToRef, containerRef, strategyRef, isAnimatingRef } = useTransitionSetup(strategy, currentViewId)

  const onExecute = useCallback(async () => {
    setCurrentViewId(pendingToRef.current)
  }, [])

  const execute = useBeforeTransition(strategyRef, containerRef, onExecute, isAnimatingRef)

  useAfterTransition(strategyRef, containerRef, currentViewId, isAnimatingRef)

  const to = useCallback(
    async (toViewId: string) => {
      if (toViewId === pendingToRef.current || isAnimatingRef.current)
        return

      pendingToRef.current = toViewId

      await execute()
    },
    [execute],
  )

  const viewValue = useMemo(
    () => ({
      to,
      currentViewId,
    }),
    [to, currentViewId],
  )

  return (
    <ViewTransitionContext.Provider value={viewValue}>
      <div ref={containerRef} className="h-full">
        {children}
      </div>
    </ViewTransitionContext.Provider>
  )
}
