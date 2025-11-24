import { assertIsDefined } from '../data/assert.js'

/**
 * デバイスのサイズを表すユニオン型。
 * - 'sm': スモール（デフォルト）
 * - 'md': ミディアム
 * - 'lg': ラージ
 */
export type DeviceSize = 'sm' | 'md' | 'lg'

/**
 * MediaQuery クラスが発火するイベントのマップ。
 * change イベントは現在の deviceSize を detail に持つ。
 */
export interface MediaQueryEventMap {
  change: {
    deviceSize: DeviceSize
  }
}

// const LOG_PREFIX = '[MediaQuery]'

/**
 * ブラウザの matchMedia を利用してデバイスサイズの変化を監視するユーティリティ。
 *
 * 利用例:
 * ```
 * const mq = new MediaQuery()
 * mq.addEventListener('change', (e) => {
 *   console.log((e as CustomEvent).detail.deviceSize)
 * })
 * ```
 */
export class MediaQuery extends EventTarget {
  private _mediaQueryMap: Map<string, DeviceSize[]> = new Map<string, DeviceSize[]>()

  /**
   * 現在のデバイスサイズ。
   * コンストラクタ実行時に初期判定される。
   * @default 'sm'
   */
  public deviceSize: DeviceSize = 'sm'

  /**
   * @param mdBreakPoint ミディアム判定の最小幅（px）。既定値 600。
   * @param lgBreakPoint ラージ判定の最小幅（px）。既定値 1025。
   */
  constructor(mdBreakPoint = 600, lgBreakPoint = 1025) {
    super()

    this._mediaQueryMap.set(`(min-width: ${mdBreakPoint}px)`, ['sm', 'md'])
    this._mediaQueryMap.set(`(min-width: ${lgBreakPoint}px)`, ['md', 'lg'])

    this._mediaQueryMap.forEach(([, largerBreakPoint]: DeviceSize[], key: string) => {
      const mql = window.matchMedia(key)
      mql.addEventListener('change', this._onChange)
      if (mql.matches) {
        this.deviceSize = largerBreakPoint
      }
    })

    if (this.deviceSize === undefined) {
      this.deviceSize = 'sm'
    }
  }

  private _onChange = (e: MediaQueryListEvent): void => {
    // console.log(LOG_PREFIX, '_onChange', { e })

    const deviceSizeList = this._mediaQueryMap.get(e.media)
    assertIsDefined(deviceSizeList)

    this.deviceSize = e.matches ? deviceSizeList[1] : deviceSizeList[0]

    this.dispatchEvent(new CustomEvent<MediaQueryEventMap['change']>('change', { detail: { deviceSize: this.deviceSize } }))
  }
}
