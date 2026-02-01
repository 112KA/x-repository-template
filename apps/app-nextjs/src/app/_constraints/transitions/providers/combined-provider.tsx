'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from './shared'
import { PageTransitionProvider } from './page-transition-provider'
import { ViewTransitionProvider } from './view-transition-provider'

export interface CombinedTransitionProviderProps {
  children: ReactNode
  strategy: ViewTransitionStrategy
  initialViewId?: string
}

/**
 * ページ遷移とビュー切り替えの両方をサポートするプロバイダー
 * 複数の層でアニメーション管理が必要な場合に使用
 *
 * @example
 * ```tsx
 * <CombinedTransitionProvider strategy={createFadeStrategy()}>
 *   {children}
 * </CombinedTransitionProvider>
 * ```
 */
export function CombinedTransitionProvider({
  children,
  strategy,
  initialViewId,
}: CombinedTransitionProviderProps) {
  return (
    <PageTransitionProvider strategy={strategy}>
      <ViewTransitionProvider strategy={strategy} initialViewId={initialViewId}>
        {children}
      </ViewTransitionProvider>
    </PageTransitionProvider>
  )
}
