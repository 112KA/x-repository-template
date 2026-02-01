'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from './shared'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  strategyRef.current = strategy

  const [currentViewId, setCurrentViewId] = useState<string | null>(initialViewId ?? null)

  useEffect(() => {
    return () => {
      strategy.cleanup()
    }
  }, [strategy])

  const switchView = useCallback(
    async (toViewId: string) => {
      if (toViewId === currentViewId || isAnimatingRef.current)
        return

      isAnimatingRef.current = true

      try {
        // アニメーション開始
        await strategyRef.current?.beforeTransition(
          { element: containerRef.current },
        )

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

  // ビュー切り替え後のアニメーション完了処理
  useEffect(() => {
    if (!currentViewId)
      return

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
  }, [currentViewId])

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
