export interface TimeoutEventMap {
  timeout: object
  complete: object
}

export class Timeout extends EventTarget {
  #elapsedTime: number | null

  #isComplete = false

  constructor(
    private durationSeconds: number,
    private _repeat = 0,
  ) {
    super()

    this.#elapsedTime = null
  }

  reset() {
    this.#isComplete = false
  }

  tick(elapsedTime: number): void {
    if (this.#isComplete)
      return

    if (this.#elapsedTime === null)
      this.#elapsedTime = elapsedTime

    const result = this.durationSeconds < elapsedTime - this.#elapsedTime

    // console.log({ result, elapsedTime })

    if (result) {
      this.#elapsedTime = null
      if (this._repeat === -1 || this._repeat > 0) {
        if (this._repeat !== -1) {
          this._repeat -= 1
        }
        this.dispatchEvent(new CustomEvent<TimeoutEventMap['timeout']>('timeout'))
      }
      else if (this._repeat === 0) {
        this.#isComplete = true
        this.dispatchEvent(new CustomEvent<TimeoutEventMap['complete']>('complete'))
      }
    }
  }
}
