/**
 * 実行環境情報をユーザーエージェント等から判定するヘルパー。
 * XR 対応は非同期で更新される可能性あり (env.support.xr)。
 */
class Environment {
  /** ローカルネットワーク/localhost 判定 */
  local = /localhost|192.168|172.16/.test(window.location.hostname)
  /** 開発環境ドメイン判定 */
  dev = /dev/.test(window.location.hostname)
  /** ステージング環境ドメイン判定 */
  stg = /stg/.test(window.location.hostname)
  /** 本番環境判定 */
  prd = !(this.local || this.dev || this.stg)
  /** iOS 端末判定 */
  ios = /iPhone|iPod|iPad/.test(navigator.userAgent)
  /** Android 端末判定 */
  android = /Android/.test(navigator.userAgent)
  /** Meta Quest 判定 */
  quest = /Quest/.test(navigator.userAgent)
  /** タブレット判定 (iPad / Android Tablet) */
  tablet
    = (/iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document)
      || (/Android/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent))

  /** PC 判定 */
  pc = !(this.tablet || this.ios || this.android || this.quest)
  /** 機能サポート状況 */
  support = {
    /** タッチイベントサポート */
    touch: 'ontouchstart' in window,
    /** WebXR サポート (起動後非同期更新) */
    xr: false,
  }

  /** IE 判定 */
  ie = /msie|trident/i.test(navigator.userAgent)
  /** Edge 判定 */
  edge = /edg/i.test(navigator.userAgent)
  /** Safari 判定 (Chrome 除外) */
  safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)
}
const env = new Environment()

void (async () => {
  const { xr } = window.navigator
  if (xr !== undefined) {
    const isSupported = await xr.isSessionSupported('immersive-vr')
    env.support.xr = isSupported && env.pc
  }
})()
export { env }
