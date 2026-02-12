'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from './shared'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useAfterTransition, useTransitionProvider } from '../hooks/use-transition-provider'
import { ViewTransitionContext } from './shared'

export interface ViewTransitionProviderProps {
  children: ReactNode
  strategy: ViewTransitionStrategy
  initialViewId?: string
}

/**
 * ビュー切り替え（ページ遷移なし）アニメーション管理プロバイダー
 * ページ遷移なしで複数ビューを切り替える際に使用
 */
export function ViewTransitionProvider({ children, strategy, initialViewId }: ViewTransitionProviderProps) {
  const [currentViewId, setCurrentViewId] = useState<string | null>(initialViewId ?? null)
  const strategyRef = useRef<ViewTransitionStrategy>(strategy)
  const pendingViewRef = useRef<string | null>(null)

  const onExecute = useCallback(async () => {
    const next = pendingViewRef.current
    if (!next)
      return

    setCurrentViewId(next)

    pendingViewRef.current = null
  }, [])

  const { containerRef, execute, isAnimatingRef } = useTransitionProvider(
    strategy,
    onExecute,
  )

  useAfterTransition(strategyRef, containerRef, currentViewId, isAnimatingRef)

  const switchView = useCallback(
    async (toViewId: string) => {
      if (toViewId === currentViewId || isAnimatingRef.current)
        return

      pendingViewRef.current = toViewId

      await execute()
    },
    [currentViewId, execute],
  )

  const value = useMemo(
    () => ({
      switchView,
      currentViewId,
    }),
    [switchView, currentViewId],
  )

  return (
    <ViewTransitionContext.Provider value={value}>
      <div ref={containerRef} className="h-full">
        {children}
      </div>
    </ViewTransitionContext.Provider>
  )
}
