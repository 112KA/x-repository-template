/**
 * ユーザーエージェント判定ヘルパー。
 */

class UserAgent {
  // サーバーサイドかチェックするヘルパー
  private get isServer(): boolean {
    return typeof window === 'undefined'
  }

  private get nua(): string {
    return this.isServer ? '' : window.navigator.userAgent
  }

  /** iOS 端末判定 */
  get ios(): boolean { return /iPhone|iPod|iPad/.test(this.nua) }

  /** Android 端末判定 */
  get android(): boolean { return /Android/.test(this.nua) }

  /** Meta Quest 判定 */
  get quest(): boolean { return /Quest/.test(this.nua) }

  /** タブレット判定 */
  get tablet(): boolean {
    if (this.isServer)
      return false
    return (/iPad|Macintosh/.test(this.nua) && 'ontouchend' in document)
      || (/Android/.test(this.nua) && !/Mobile/.test(this.nua))
  }

  /** PC 判定 */
  get pc(): boolean { return !(this.tablet || this.ios || this.android || this.quest) }

  /** IE 判定 */
  get ie(): boolean { return /msie|trident/i.test(this.nua) }
  /** Edge 判定 */
  get edge(): boolean { return /edg/i.test(this.nua) }
  /** Safari 判定 (Chrome 除外) */
  get safari(): boolean { return /safari/i.test(this.nua) && !/chrome/i.test(this.nua) }
  /** webOS 判定 */
  get webos(): boolean { return /webos|Web0S/i.test(this.nua) }
}

export const ua = new UserAgent()
