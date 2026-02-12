'use client'

import type { RefObject } from 'react'
import type { ViewTransitionStrategy } from '../providers/shared'
import { useCallback, useEffect, useRef } from 'react'

export function useTransitionProvider(
  strategy: ViewTransitionStrategy,
  onExecute: () => Promise<void> | void,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const strategyRef = useRef<ViewTransitionStrategy>(strategy)

  // strategy の更新
  strategyRef.current = strategy

  // Cleanup 処理
  useEffect(() => {
    return () => {
      strategy.cleanup()
    }
  }, [strategy])

  // 実行関数（共通）
  const execute = useCallback(
    async () => {
      // アニメーション開始
      await strategyRef.current.beforeTransition({
        element: containerRef.current,
      })

      // 実際の遷移処理を実行
      await onExecute()
    },
    [onExecute],
  )

  return { containerRef, execute, strategyRef }
}

/**
 * useTransitionProvider の afterTransition ロジック用フック
 * 状態変更時（pathname または currentViewId）に実行される
 *
 * @param strategyRef - strategy の参照（useTransitionProvider から返却される）
 * @param containerRef - コンテナ要素の参照（useTransitionProvider から返却される）
 * @param dependency - 監視対象（pathname または currentViewId）
 * @param isAnimatingRef - isAnimatingRef（親フックから返却される）
 */
export function useAfterTransition(
  strategyRef: RefObject<ViewTransitionStrategy>,
  containerRef: RefObject<HTMLDivElement | null>,
  dependency: any,
  isAnimatingRef: RefObject<boolean>,
) {
  useEffect(() => {
    let isCancelled = false

    const run = async () => {
      try {
        await strategyRef.current.afterTransition({
          element: containerRef.current,
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
  }, [strategyRef, containerRef, dependency, isAnimatingRef])
}
