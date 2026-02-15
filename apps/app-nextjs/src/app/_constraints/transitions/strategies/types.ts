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
