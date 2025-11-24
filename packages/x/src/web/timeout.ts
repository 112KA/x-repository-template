/** タイムアウトイベントのペイロード型集合 */
export interface TimeoutEventMap {
  /** 反復タイムアウト発生時 (detail なし) */
  timeout: object
  /** 最終完了時 (repeat 消費後 / repeat=0) */
  complete: object
}

/**
 * 指定秒数経過後に timeout / complete イベントを発火するユーティリティ。
 * repeat:
 *  - n (>0): n 回 timeout を発火後 complete
 *  - 0: 1 回のみで complete
 *  - -1: 無限に timeout を発火し complete しない
 */
export class Timeout extends EventTarget {
  #elapsedTime: number | null

  #isComplete = false

  /**
   * @param durationSeconds タイムアウト判定秒数
   * @param _repeat 回数指定 (-1=無限)
   */
  constructor(
    private durationSeconds: number,
    private _repeat = 0,
  ) {
    super()

    this.#elapsedTime = null
  }

  /** 完了状態を解除し再度 tick 監視を可能にする */
  reset(): void {
    this.#isComplete = false
  }

  /**
   * 経過時間を受け取り内部判定を行う
   * @param elapsedTime 起動後(任意基準)の累積秒
   * @fires timeout 設定秒到達時(条件下で繰り返し)
   * @fires complete 最終回到達時
   */
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
