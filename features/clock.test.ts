import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Clock } from './clock.js'

describe('clock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('window', {
      requestAnimationFrame: (cb: FrameRequestCallback) => {
        return setTimeout(() => cb(Date.now()), 1000 / 60)
      },
      cancelAnimationFrame: (id: number) => {
        clearTimeout(id)
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('should emit tick event when second changes', () => {
    const clock = new Clock()
    const tickSpy = vi.fn()
    clock.addEventListener('tick', tickSpy)

    clock.start()

    // Advance time by 500ms (should not tick yet if we started at 0ms)
    // But we don't know the exact start time relative to second boundary.
    // So we advance by 1.1 seconds to be sure we cross a second boundary.
    vi.advanceTimersByTime(1100)

    expect(tickSpy).toHaveBeenCalled()
  })

  it('should provide correct date in tick event', () => {
    const clock = new Clock()
    let tickedDate: Date | null = null
    clock.addEventListener('tick', (e) => {
      tickedDate = (e as CustomEvent).detail.date
    })

    clock.start()
    vi.advanceTimersByTime(1100)

    expect(tickedDate).toBeInstanceOf(Date)
    expect(clock.currentTime).toBeInstanceOf(Date)
  })

  it('should stop emitting events after stop() is called', () => {
    const clock = new Clock()
    const tickSpy = vi.fn()
    clock.addEventListener('tick', tickSpy)

    clock.start()
    vi.advanceTimersByTime(1100)
    expect(tickSpy).toHaveBeenCalled()

    tickSpy.mockClear()
    clock.stop()
    vi.advanceTimersByTime(2000)
    expect(tickSpy).not.toHaveBeenCalled()
  })
})
