/**
 * @class Deferred
 * @constructor
 */
export class Deferred<T> {
  #mock = (_value: T): void => {
    throw new Error('no promised deferred!')
  }

  resolve = this.#mock

  reject = this.#mock

  clear() {
    this.resolve = this.#mock
    this.reject = this.#mock
  }

  promise() {
    return new Promise<T>((resolve: (value: T) => void, reject: (value: T) => void) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  get isCreatedPromise() {
    return this.resolve !== this.#mock
  }
}

export type DeferredRecord<T> = Record<string, Deferred<T>>

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
