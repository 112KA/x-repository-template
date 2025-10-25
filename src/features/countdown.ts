import { Ticker } from 'x/misc'

/**
 * CountDown が発火するイベントの型マップ。
 *
 * - tick: 残り秒数が更新された際に発火される。detail に count を含む。
 * - complete: カウントダウンが 0 に到達した際に発火される（detail は空オブジェクト）。
 *
 * @public
 */
export interface CoundDownEventMap {
  tick: {
    count: number
  }
  complete: object
}

/**
 * 単純なカウントダウンクラス。
 *
 * 指定した初期秒数から経過時間に応じて残り秒数を計算し、'tick' イベントおよび
 * 'complete' イベントを発火します。内部で Ticker を利用して定期的に更新します。
 *
 * @example
 * ```ts
 * const cd = new CountDown(10)
 * cd.addEventListener('tick', (e) => console.log((e as CustomEvent).detail.count))
 * cd.addEventListener('complete', () => console.log('done'))
 * cd.start()
 * ```
 *
 * @public
 */
export class CountDown extends EventTarget {
  /**
   * 現在の残りカウント（秒）。初期値は 0。
   */
  public count = 0
  /**
   * 内部で利用する Ticker インスタンス。
   */
  public ticker = new Ticker()

  /**
   * @param initialCount - 開始時のカウント（秒）
   */
  constructor(public initialCount: number) {
    super()

    this.ticker.addEventListener('tick', this.#tickHandler)
  }

  /**
   * カウントを初期値にリセットします（ticker の停止は行いません）。
   */
  reset() {
    this.count = this.initialCount
  }

  /**
   * カウントダウンを開始します（内部で ticker を開始します）。
   */
  start() {
    this.ticker.start()
  }

  /**
   * カウントダウンを停止します（内部で ticker を停止します）。
   */
  stop() {
    // console.log('stop countdown')
    this.ticker.stop()
  }

  /**
   * Ticker の tick イベントハンドラ。
   *
   * 内部処理：
   * - 経過時間から現在の残り秒数を計算
   * - 残り秒数が変化したら 'tick' を発火
   * - 0 に到達したら ticker を停止し 'complete' を発火
   *
   * @private
   */
  #tickHandler = (e: Event) => {
    const { time, dt: _dt } = (e as CustomEvent).detail
    const count = this.initialCount - ~~Math.floor(time / 1000)

    if (this.count !== count) {
      // console.log("tick", { count, time, dt });
      this.count = count
      this.dispatchEvent(new CustomEvent<CoundDownEventMap['tick']>('tick', { detail: { count } }))
      if (this.count === 0) {
        this.stop()
        this.dispatchEvent(new CustomEvent<CoundDownEventMap['complete']>('complete'))
      }
    }
  }
}
