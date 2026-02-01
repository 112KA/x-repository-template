'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from './shared'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useAfterTransition } from '../hooks/use-transition-provider'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
  const strategyRef = useRef<ViewTransitionStrategy>(strategy)

  const [currentViewId, setCurrentViewId] = useState<string | null>(initialViewId ?? null)

  // strategy の更新
  strategyRef.current = strategy

  const switchView = useCallback(
    async (toViewId: string) => {
      if (toViewId === currentViewId || isAnimatingRef.current)
        return

      isAnimatingRef.current = true

      try {
        // アニメーション開始
        await strategyRef.current?.beforeTransition({
          element: containerRef.current,
        })

        // ビュー切り替え
        setCurrentViewId(toViewId)
      }
      catch (error) {
        isAnimatingRef.current = false
        throw error
      }
    },
    [currentViewId],
  )

  // currentViewId 変更時に afterTransition を実行
  useAfterTransition(strategyRef, containerRef, currentViewId, isAnimatingRef)

  const viewSwitchValue = useMemo(
    () => ({
      switchView,
      currentViewId,
    }),
    [switchView, currentViewId],
  )

  return (
    <ViewTransitionContext.Provider value={viewSwitchValue}>
      <div ref={containerRef} className="h-full">
        {children}
      </div>
    </ViewTransitionContext.Provider>
  )
}
