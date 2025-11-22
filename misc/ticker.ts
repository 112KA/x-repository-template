/** Ticker が発火する tick イベントの detail */
export interface TickerEventMap {
  /** 毎フレームの経過情報 */
  tick: {
    /** 開始後経過ミリ秒 */
    time: number
    /** 前回 tick からのデルタミリ秒(理想 gap 調整後) */
    dt: number
  }
}

/**
 * requestAnimationFrame を利用し指定 FPS 近似で tick イベントを発火するクラス。
 * fps を変更すると次フレームから gap 再計算。
 */
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

  #tickHandler = (): void => {
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

  /** 現在の FPS 設定 */
  get fps(): number {
    return this.#fps
  }

  /** FPS を再設定 (0/未定義は 60 とみなし gap 計算) */
  set fps(v) {
    this.#fps = v
    this.#gap = (1 / (v || 60)) * 1000
  }

  /** 現在時刻取得 (拡張余地確保のラッパー) */
  static getTime(): number {
    return Date.now() || Date.now()
  }

  /** tick の発火開始 */
  start(): void {
    this.#startMs = Ticker.getTime()
    this.#nextMs = this.#startMs + this.#gap
    this.#requestId = window.requestAnimationFrame(this.#tickHandler)
  }

  /** tick の発火停止 (requestAnimationFrame 解除) */
  stop(): void {
    window.cancelAnimationFrame(this.#requestId)
  }
}
