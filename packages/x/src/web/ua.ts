/**
 * ユーザーエージェント判定ヘルパー。
 */

const IOS_REGEXP = /iPhone|iPod|iPad/
const ANDROID_REGEXP = /Android/
const QUEST_REGEXP = /Quest/
const IPAD_OR_MACINTOSH_REGEXP = /iPad|Macintosh/
const MOBILE_REGEXP = /Mobile/
const IE_REGEXP = /msie|trident/i
const EDGE_REGEXP = /edg/i
const SAFARI_REGEXP = /safari/i
const CHROME_REGEXP = /chrome/i
const WEBOS_REGEXP = /webos|Web0S/i

class UserAgent {
  // サーバーサイドかチェックするヘルパー
  private get isServer(): boolean {
    return typeof window === 'undefined'
  }

  private get nua(): string {
    return this.isServer ? '' : window.navigator.userAgent
  }

  /** iOS 端末判定 */
  get ios(): boolean { return IOS_REGEXP.test(this.nua) }

  /** Android 端末判定 */
  get android(): boolean { return ANDROID_REGEXP.test(this.nua) }

  /** Meta Quest 判定 */
  get quest(): boolean { return QUEST_REGEXP.test(this.nua) }

  /** タブレット判定 */
  get tablet(): boolean {
    if (this.isServer)
      return false
    return (IPAD_OR_MACINTOSH_REGEXP.test(this.nua) && 'ontouchend' in document)
      || (ANDROID_REGEXP.test(this.nua) && !MOBILE_REGEXP.test(this.nua))
  }

  /** PC 判定 */
  get pc(): boolean { return !(this.tablet || this.ios || this.android || this.quest) }

  /** IE 判定 */
  get ie(): boolean { return IE_REGEXP.test(this.nua) }
  /** Edge 判定 */
  get edge(): boolean { return EDGE_REGEXP.test(this.nua) }
  /** Safari 判定 (Chrome 除外) */
  get safari(): boolean { return SAFARI_REGEXP.test(this.nua) && !CHROME_REGEXP.test(this.nua) }
  /** webOS 判定 */
  get webos(): boolean { return WEBOS_REGEXP.test(this.nua) }
}

export const ua = new UserAgent()
