import { Ticker } from '../web/ticker.js'

/**
 * Clock が発火するイベントの型マップ。
 *
 * - tick: 秒が切り替わった際に発火される。detail に date を含む。
 *
 * @public
 */
export interface ClockEventMap {
  tick: {
    date: Date
  }
}

/**
 * 現在時刻を管理するユーティリティクラス。
 *
 * 内部で Ticker を利用して定期的に時刻をチェックし、
 * ローカルタイムの秒数が切り替わったタイミングで 'tick' イベントを発火します。
 *
 * @example
 * ```ts
 * const clock = new Clock()
 * clock.addEventListener('tick', (e) => {
 *   const { date } = (e as CustomEvent).detail
 *   console.log(date.toLocaleTimeString())
 * })
 * clock.start()
 * ```
 *
 * @public
 */
export class Clock extends EventTarget {
  /**
   * 現在の時刻。
   */
  public currentTime: Date = new Date()

  /**
   * 内部で利用する Ticker インスタンス。
   */
  private ticker = new Ticker()

  /**
   * 前回の tick 時の秒数 (0-59)
   */
  private lastSecond = -1

  constructor() {
    super()
    this.ticker.addEventListener('tick', this.#tickHandler)
  }

  /**
   * 時計を開始します（内部で ticker を開始します）。
   */
  start(): void {
    this.currentTime = new Date()
    this.lastSecond = this.currentTime.getSeconds()
    this.ticker.start()
  }

  /**
   * 時計を停止します（内部で ticker を停止します）。
   */
  stop(): void {
    this.ticker.stop()
  }

  /**
   * Ticker の tick イベントハンドラ。
   *
   * 内部処理：
   * - 現在時刻を取得
   * - 秒数が変化していたら 'tick' を発火
   *
   * @private
   */
  #tickHandler = (): void => {
    const now = new Date()
    const currentSecond = now.getSeconds()

    if (this.lastSecond !== currentSecond) {
      this.currentTime = now
      this.lastSecond = currentSecond
      this.dispatchEvent(
        new CustomEvent<ClockEventMap['tick']>('tick', {
          detail: { date: now },
        }),
      )
    }
  }
}
