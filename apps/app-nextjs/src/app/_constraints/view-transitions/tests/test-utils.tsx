import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { ViewTransitionStrategy } from '../types'
import { render } from '@testing-library/react'
import { ViewTransitionProvider } from '../provider'
import { createFadeStrategy } from '../strategies/gsap-fade'

/**
 * ViewTransitionProvider でラップしたカスタムレンダー関数
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
    <ViewTransitionProvider strategy={strategy}>
      {ui}
    </ViewTransitionProvider>,
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
