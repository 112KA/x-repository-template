'use client'

import type { RefObject } from 'react'
import type { ViewTransitionStrategy } from '../strategies/types'
import { useCallback, useEffect, useRef } from 'react'

/**
 * トランジション用の Ref 管理と Cleanup 処理
 *
 * @param strategy - ViewTransitionStrategy インスタンス
 * @returns pendingToRef, containerRef, strategyRef, isAnimatingRef
 */
export function useTransitionSetup(strategy: ViewTransitionStrategy, initialTo: string) {
  const pendingToRef = useRef<string>(initialTo)
  const containerRef = useRef<HTMLDivElement>(null)
  const strategyRef = useRef<ViewTransitionStrategy>(strategy)
  const isAnimatingRef = useRef(false)

  // strategy の更新
  strategyRef.current = strategy

  // Cleanup 処理
  useEffect(() => {
    return () => {
      strategy.cleanup()
    }
  }, [strategy])

  return { pendingToRef, containerRef, strategyRef, isAnimatingRef }
}

/**
 * beforeTransition 処理を実行する関数を返す
 *
 * @param strategyRef - strategy の参照（useTransitionSetup から返却される）
 * @param containerRef - コンテナ要素の参照（useTransitionSetup から返却される）
 * @param onExecute - 実際の遷移処理
 * @param isAnimatingRef - isAnimatingRef（親フックから返却される）
 * @returns 実行関数
 */
export function useBeforeTransition(
  strategyRef: RefObject<ViewTransitionStrategy>,
  containerRef: RefObject<HTMLDivElement | null>,
  onExecute: () => Promise<void> | void,
  isAnimatingRef: RefObject<boolean>,
) {
  return useCallback(
    async () => {
      // アニメーション開始
      isAnimatingRef.current = true
      await strategyRef.current.beforeTransition({
        element: containerRef.current,
      })

      // 実際の遷移処理を実行
      await onExecute()
    },
    [onExecute],
  )
}

/**
 * afterTransition 処理を実行する
 * 状態変更時（pathname または currentViewId）に実行される
 *
 * @param strategyRef - strategy の参照（useTransitionSetup から返却される）
 * @param containerRef - コンテナ要素の参照（useTransitionSetup から返却される）
 * @param dependency - 監視対象（pathname または currentViewId）
 * @param isAnimatingRef - isAnimatingRef（親フックから返却される）
 */
export function useAfterTransition(
  strategyRef: RefObject<ViewTransitionStrategy>,
  containerRef: RefObject<HTMLDivElement | null>,
  dependency: string | null,
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
  }, [dependency])
}
