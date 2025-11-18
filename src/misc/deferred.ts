/**
 * 外部から resolve / reject を後出し可能にする Deferred パターン。
 * promise() 呼び出し時に内部で新規 Promise を生成しハンドラを差し替える。
 */
export class Deferred<T> {
  #mock = (_value: T): void => {
    throw new Error('no promised deferred!')
  }

  resolve = this.#mock

  reject = this.#mock

  /** resolve / reject を初期状態に戻す */
  clear(): void {
    this.resolve = this.#mock
    this.reject = this.#mock
  }

  /**
   * 新しい Promise を生成
   * @returns 生成された Promise
   */
  promise(): Promise<T> {
    return new Promise<T>((resolve: (value: T) => void, reject: (value: T) => void) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  /** promise() 済みかどうか */
  get isCreatedPromise(): boolean {
    return this.resolve !== this.#mock
  }
}

/** Deferred を値型毎にマッピングしたレコード */
export type DeferredRecord<T> = Record<string, Deferred<T>>

/**
 * 指定ミリ秒待機する単純なユーティリティ
 * @param ms 待機ミリ秒
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
