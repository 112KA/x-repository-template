import type { ViewTransitionStrategy } from '../providers/shared'
import { createFadeStrategy } from './gsap-fade'
import { createViewTransitionApiStrategy } from './view-transition-api'

export { createFadeStrategy } from './gsap-fade'
export { createViewTransitionApiStrategy } from './view-transition-api'

/**
 * 文字列からViewTransitionStrategyオブジェクトを解決します
 * @param strategyNameOrObj - Strategy名（文字列）またはStrategyオブジェクト
 * @returns 解決されたStrategyオブジェクト
 */
export function resolveStrategy(
  strategyNameOrObj: string | ViewTransitionStrategy | undefined,
): ViewTransitionStrategy {
  // undefinedの場合はデフォルト
  if (!strategyNameOrObj)
    return createFadeStrategy()

  // オブジェクトの場合はそのまま返す
  if (typeof strategyNameOrObj !== 'string')
    return strategyNameOrObj

  // 文字列の場合はマッピングから解決
  const strategies: Record<string, () => ViewTransitionStrategy> = {
    'fade': createFadeStrategy,
    'view-transition-api': createViewTransitionApiStrategy,
  }

  const createStrategy = strategies[strategyNameOrObj]
  return createStrategy ? createStrategy() : createFadeStrategy()
}
