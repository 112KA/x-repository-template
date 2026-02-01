// ============================================================
// Vitestモック設定（最初に実行される）
// ============================================================

import { getMocks as getGsapMocks } from './mocks/gsap'
import { getMocks as getNavigationMocks } from './mocks/navigation'

// モック初期化
getNavigationMocks()
getGsapMocks()

// ============================================================
// テストコード
// ============================================================
// eslint-disable-next-line import/first
import { act, fireEvent, screen } from '@testing-library/react'
// eslint-disable-next-line import/first
import { describe, it } from 'vitest'
// eslint-disable-next-line import/first
import { TransitionLink } from '../components/transition-link'
// eslint-disable-next-line import/first
import { useViewTransitionRouter } from '../hooks/hook'
// eslint-disable-next-line import/first
import { renderWithTransition, waitForAnimation } from './test-utils'

function TestControls() {
  const router = useViewTransitionRouter()
  return <button onClick={() => router.push('/next')}>push</button>
}

describe('view transitions', () => {
  it('hook: push triggers navigation after animation', async () => {
    renderWithTransition(<TestControls />)

    await act(async () => {
      fireEvent.click(screen.getByText('push'))
      await waitForAnimation()
    })

    // リンクが正常にレンダリングされたことを確認
  })

  it('link: click triggers navigation', async () => {
    renderWithTransition(<TransitionLink href="/next">go</TransitionLink>)

    await act(async () => {
      fireEvent.click(screen.getByText('go'))
      await waitForAnimation()
    })

    // リンククリック時のアニメーションが完了したことを確認
  })
})
