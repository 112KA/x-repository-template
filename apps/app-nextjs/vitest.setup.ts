import '@testing-library/jest-dom'

// ResizeObserver mock for happy-dom
class ResizeObserverMock {
  constructor(_callback?: ResizeObserverCallback) {
    // コンストラクタで callback を受け取るだけ
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  (globalThis as unknown as Record<string, unknown>).ResizeObserver
    = ResizeObserverMock
}

// matchMedia mock
if (!globalThis.matchMedia) {
  globalThis.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {}, // 非推奨だが互換性のため残す
    removeListener: () => {}, // 非推奨だが互換性のため残す
    dispatchEvent: () => false,
  })
}
