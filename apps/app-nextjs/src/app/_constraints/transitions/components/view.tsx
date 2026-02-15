import type { ReactNode } from 'react'
import { useViewTransition } from '../hooks/use-context'

export interface ViewProps {
  /** ビューID */
  id: string
  /** ビューのコンテンツ */
  children: ReactNode
}

/**
 * ビュー切り替えコンポーネント
 *
 * ViewTransitionProvider内で使用し、
 * 現在のビューIDと一致したビューのみを表示します。
 *
 * @example
 * ```tsx
 * <ViewTransitionProvider strategy={createFadeStrategy()} initialViewId="view-1">
 *   <View id="view-1">
 *     <h1>View 1</h1>
 *   </View>
 *   <View id="view-2">
 *     <h1>View 2</h1>
 *   </View>
 * </ViewTransitionProvider>
 * ```
 */
export function View({ id, children }: ViewProps) {
  const viewTransition = useViewTransition()

  // 自分のidが現在のviewIdと一致したら表示
  if (viewTransition.currentViewId !== id) {
    return null
  }

  return <>{children}</>
}
