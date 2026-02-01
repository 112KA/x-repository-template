'use client'

import type { ViewTransitionStrategy } from '../providers/shared'
import { useCallback, useEffect, useRef } from 'react'

/**
 * ページ遷移またはビュー切り替え時のアニメーション管理フック
 * 共通ロジックをここに集約
 *
 * @param strategy - アニメーション戦略
 * @param onExecute - 実際の遷移処理（router.push または setCurrentViewId）
 * @param shouldSkip - 実行をスキップすべきかを判定する関数
 * @returns 以下のプロパティを持つオブジェクト
 * @returns {RefObject} containerRef - アニメーション対象のコンテナ参照
 * @returns {Function} execute - アニメーション実行関数
 * @returns {MutableRefObject} isAnimatingRef - アニメーション中フラグ
 */
export function useTransitionProvider(
  strategy: ViewTransitionStrategy,
  onExecute: () => Promise<void> | void,
  shouldSkip: () => boolean,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
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
      if (shouldSkip() || isAnimatingRef.current)
        return

      isAnimatingRef.current = true

      try {
        // アニメーション開始
        await strategyRef.current?.beforeTransition({
          element: containerRef.current,
        })

        // 実際の遷移処理を実行
        await onExecute()
      }
      catch (error) {
        isAnimatingRef.current = false
        throw error
      }
    },
    [onExecute, shouldSkip],
  )

  // 後処理用 useEffect フック
  // 呼び出し側で依存性を管理して呼び出すこと
  useEffect(() => {
    let isCancelled = false

    const run = async () => {
      try {
        await strategyRef.current?.afterTransition({
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
  }, []) // 注：呼び出し側で setupAfterTransition を通じて依存性を管理

  return { containerRef, execute, isAnimatingRef, strategyRef }
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
  strategyRef: React.MutableRefObject<ViewTransitionStrategy>,
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  dependency: any,
  isAnimatingRef: React.MutableRefObject<boolean>,
) {
  useEffect(() => {
    let isCancelled = false

    const run = async () => {
      try {
        await strategyRef.current?.afterTransition({
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
