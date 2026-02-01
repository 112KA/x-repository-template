import { createContext } from 'react'

/**
 * 遷移アニメーション対象要素のコンテキスト
 */
export interface TransitionContext {
  /** アニメーション対象のコンテナ要素 */
  element: HTMLDivElement | null
}

/**
 * 統一されたView Transition戦略インターフェース
 * 各プロバイダーで独立して使用可能
 */
export interface ViewTransitionStrategy {
  /**
   * 遷移前のアニメーション処理
   * @param context - アニメーション対象のコンテナ
   */
  beforeTransition: (context: TransitionContext) => Promise<void>

  /**
   * 遷移後のアニメーション処理
   * @param context - アニメーション対象のコンテナ
   */
  afterTransition: (context: TransitionContext) => Promise<void>

  /**
   * クリーンアップ処理
   */
  cleanup: () => void
}

/**
 * ページ遷移用Context値
 * router.push/replace を実行する
 */
export interface PageTransitionRouterValue {
  push: (href: string) => Promise<void>
  replace: (href: string) => Promise<void>
}

/**
 * ビュー切り替え用Context値
 * ページ遷移なしでビュー切り替え
 */
export interface ViewTransitionContextValue {
  switchView: (viewId: string) => Promise<void>
  currentViewId: string | null
}

/**
 * PageTransitionProvider用Context
 */
export const PageTransitionContext = createContext<PageTransitionRouterValue | null>(null)

/**
 * ViewTransitionProvider用Context
 */
export const ViewTransitionContext = createContext<ViewTransitionContextValue | null>(null)
