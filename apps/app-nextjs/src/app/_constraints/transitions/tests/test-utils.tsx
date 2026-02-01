import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { ViewTransitionStrategy } from '../providers/shared'
import { render } from '@testing-library/react'
import { PageTransitionProvider } from '../providers/'
import { createFadeStrategy } from '../strategies/gsap-fade'

/**
 * PageTransitionProvider でラップしたカスタムレンダー関数
 * ページ遷移とビュー切り替えの両方をサポート
 */
export function renderWithTransition(
  ui: ReactElement,
  options?: {
    strategy?: ViewTransitionStrategy
    renderOptions?: Omit<RenderOptions, 'wrapper'>
  },
) {
  const { strategy = createFadeStrategy(), renderOptions } = options ?? {}

  return render(
    <PageTransitionProvider strategy={strategy}>
      {ui}
    </PageTransitionProvider>,
    renderOptions,
  )
}

/**
 * アニメーション完了を待機するヘルパー
 */
export function waitForAnimation(ms = 1) {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * テスト用の div 要素を作成
 */
export function createTestElement(): HTMLDivElement {
  return document.createElement('div') as HTMLDivElement
}
