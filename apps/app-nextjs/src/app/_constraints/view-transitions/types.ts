import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

/**
 * 遷移アニメーションの共通コンテキスト
 */
export interface TransitionContext {
  /** アニメーション対象のコンテナ要素 */
  element: HTMLDivElement | null
}

/**
 * ページ遷移のメタデータ
 */
export interface NavigateMetadata {
  type: 'navigate'
  href: string
  fromPathname: string
  router: AppRouterInstance
  navigate: () => void
}

/**
 * ビュー切り替えのメタデータ
 */
export interface SwitchViewMetadata {
  type: 'switch-view'
  fromViewId: string
  toViewId: string
}

/**
 * ページ遷移完了後のメタデータ
 */
export interface AfterNavigateMetadata {
  type: 'navigate'
  pathname: string
}

/**
 * ビュー切り替え完了後のメタデータ
 */
export interface AfterSwitchViewMetadata {
  type: 'switch-view'
  viewId: string
}

/**
 * 遷移メタデータ（型判別Union）
 */
export type TransitionMetadata = NavigateMetadata | SwitchViewMetadata

/**
 * 遷移完了後メタデータ（型判別Union）
 */
export type AfterTransitionMetadata = AfterNavigateMetadata | AfterSwitchViewMetadata

/**
 * 統一されたView Transition戦略インターフェース
 */
export interface ViewTransitionStrategy {
  /**
   * 遷移前のアニメーション処理
   * @param context - アニメーション対象のコンテナ
   * @param metadata - 遷移の種類に応じたメタデータ
   */
  beforeTransition: (context: TransitionContext, metadata: TransitionMetadata) => Promise<void>

  /**
   * 遷移後のアニメーション処理
   * @param context - アニメーション対象のコンテナ
   * @param metadata - 遷移完了後のメタデータ
   */
  afterTransition: (context: TransitionContext, metadata: AfterTransitionMetadata) => Promise<void>

  /**
   * クリーンアップ処理
   */
  cleanup: () => void
}

/**
 * ビュー切り替え用Context値
 */
export interface ViewSwitchContextValue {
  switchView: (viewId: string) => Promise<void>
  currentViewId: string | null
}
