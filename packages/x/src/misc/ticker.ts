export type TickerEventMap = {
  tick: {
    time: number
    dt: number
  }
}

export class Ticker extends EventTarget {
  #fps = 30

  #requestId = -1

  #lastMs = 0

  #startMs = 0

  #nextMs = 0

  #gap = 0

  constructor() {
    super()

    this.#fps = 30
  }

  #tickHandler = () => {
    this.#requestId = window.requestAnimationFrame(this.#tickHandler)

    this.#lastMs = Ticker.getTime()

    const overlap = this.#lastMs - this.#nextMs

    if (overlap >= 0) {
      const t0 = this.#nextMs
      this.#nextMs += overlap + (overlap >= this.#gap ? 1 : this.#gap - overlap)
      this.dispatchEvent(
        new CustomEvent<TickerEventMap['tick']>('tick', {
          detail: {
            time: this.#lastMs - this.#startMs,
            dt: this.#nextMs - t0,
          },
        }),
      )
    }
  }

  get fps(): number {
    return this.#fps
  }

  set fps(v) {
    this.#fps = v
    this.#gap = (1 / (v || 60)) * 1000
  }

  static getTime(): number {
    return Date.now() || Date.now()
  }

  start() {
    this.#startMs = Ticker.getTime()
    this.#nextMs = this.#startMs + this.#gap
    this.#requestId = window.requestAnimationFrame(this.#tickHandler)
  }

  stop() {
    window.cancelAnimationFrame(this.#requestId)
  }
}
