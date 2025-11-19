const nua = window.navigator.userAgent

/**
 * ユーザーエージェント判定ヘルパー。
 */
class UserAgent {
  /** iOS 端末判定 */
  ios = /iPhone|iPod|iPad/.test(nua)
  /** Android 端末判定 */
  android = /Android/.test(nua)
  /** Meta Quest 判定 */
  quest = /Quest/.test(nua)
  /** タブレット判定 (iPad / Android Tablet) */
  tablet
    = (/iPad|Macintosh/.test(nua) && 'ontouchend' in document)
      || (/Android/.test(nua) && !/Mobile/.test(nua))

  /** PC 判定 */
  pc = !(this.tablet || this.ios || this.android || this.quest)
  /** IE 判定 */
  ie = /msie|trident/i.test(nua)
  /** Edge 判定 */
  edge = /edg/i.test(nua)
  /** Safari 判定 (Chrome 除外) */
  safari = /safari/i.test(nua) && !/chrome/i.test(nua)

  webos = /webos|Web0S/i.test(nua)
}

const ua = new UserAgent()

export { ua }
