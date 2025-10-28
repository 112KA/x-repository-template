import { describe, expect, it, vi } from 'vitest'

describe('x-lib: mock example', () => {
  it('基本的なモック関数の動作確認', () => {
    const fn = vi.fn((n: number) => n + 1)
    expect(fn(2)).toBe(3)
    expect(fn).toHaveBeenCalledWith(2)

    fn.mockImplementation((n: number) => n * 10)
    expect(fn(2)).toBe(20)
  })

  it('非同期モックの例（mockResolvedValue）', async () => {
    const asyncMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'mock-id' }),
    })

    const res = await asyncMock()
    expect(res.ok).toBe(true)
    expect(await res.json()).toEqual({ id: 'mock-id' })
  })
})
