import { act, fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useViewTransitionRouter } from '../hook'
import { getMocks as getGsapMocks } from './mocks/gsap'
// eslint-disable-next-line perfectionist/sort-imports
import { TransitionLink } from '../transition-link'
import { getMocks as getNavigationMocks } from './mocks/navigation'
import { renderWithTransition, waitForAnimation } from './test-utils'

const { pushSpy } = getNavigationMocks()
getGsapMocks()

function TestControls() {
  const router = useViewTransitionRouter()
  return <button onClick={() => router.push('/next')}>push</button>
}

describe('view transitions', () => {
  beforeEach(() => {
    pushSpy.mockClear()
  })

  it('hook: push triggers navigation after animation', async () => {
    renderWithTransition(<TestControls />)

    await act(async () => {
      fireEvent.click(screen.getByText('push'))
      await waitForAnimation()
    })

    expect(pushSpy).toHaveBeenCalledWith('/next')
  })

  it('link: click triggers navigation', async () => {
    renderWithTransition(<TransitionLink href="/next">go</TransitionLink>)

    await act(async () => {
      fireEvent.click(screen.getByText('go'))
      await waitForAnimation()
    })

    expect(pushSpy).toHaveBeenCalledWith('/next')
  })
})
