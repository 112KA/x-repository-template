// UI コンポーネント
export { View } from './components/view'
export type { ViewProps } from './components/view'
export { useViewSwitch, useViewTransitionRouter } from './hook'
// 個別プロバイダー
export { CombinedTransitionProvider } from './providers/combined-provider'
export type { CombinedTransitionProviderProps } from './providers/combined-provider'
export { PageTransitionProvider } from './providers/page-transition-provider'
export type { PageTransitionProviderProps } from './providers/page-transition-provider'
// 型とコンテキスト
export {
  PageTransitionContext,
  type PageTransitionRouterValue,
  type TransitionContext,
  ViewTransitionContext,
  type ViewTransitionContextValue,
  type ViewTransitionStrategy,
} from './providers/shared'
export { ViewTransitionProvider } from './providers/view-transition-provider'
export type { ViewTransitionProviderProps } from './providers/view-transition-provider'
// 戦略
export * from './strategies'
