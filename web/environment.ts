import { ua } from './ua.js'

/**
 * 実行環境情報をホスト名等から判定するヘルパー。
 *
 * @example
 * // 初期化前にカスタムパターンを追加
 * env.setDevPatterns(/dev/, /localhost:3000/, /\.dev\.example\.com$/)
 * env.setStgPatterns(/stg/, /staging\.example\.com$/)
 *
 * // 初期化実行
 * await env.initialize()
 *
 * // その後、属性アクセスで判定
 * if (env.dev) { console.log('Development environment') }
 * if (env.prd) { console.log('Production environment') }
 */
class Environment {
  #localPatterns: RegExp[] = [/localhost|192.168|172.16/]
  #devPatterns: RegExp[] = [/dev/]
  #stgPatterns: RegExp[] = [/stg/]

  #initialized = false

  // 内部的な XR 保持用
  #xrSupported = false

  // サーバーサイドかチェックする共通ヘルパー
  private get isServer(): boolean {
    return typeof window === 'undefined'
  }

  /** ローカルネットワーク/localhost 判定 */
  get local(): boolean {
    if (this.isServer)
      return false
    return this.#localPatterns.some(pattern => pattern.test(window.location.hostname))
  }

  /** 開発環境ドメイン判定 */
  get dev(): boolean {
    if (this.isServer)
      return false
    return this.#devPatterns.some(pattern => pattern.test(window.location.hostname))
  }

  /** ステージング環境ドメイン判定 */
  get stg(): boolean {
    if (this.isServer)
      return false
    return this.#stgPatterns.some(pattern => pattern.test(window.location.hostname))
  }

  /** 本番環境判定 */
  get prd(): boolean {
    // サーバーサイドでは一律 false か、特定のデフォルト値を返すよう設計
    if (this.isServer)
      return false
    return !(this.local || this.dev || this.stg)
  }

  /** 機能サポート状況 */
  get support(): { touch: boolean, xr: boolean } {
    return {
      /** タッチイベントサポート */
      touch: this.isServer ? false : 'ontouchstart' in window,
      /** WebXR サポート (initialize 実行後に確定) */
      xr: this.#xrSupported,
    }
  }

  /**
   * 環境判定を初期化し、WebXR サポート判定を実行します。
   * 必要に応じて事前に判定パターンを追加してください。
   */async initialize(): Promise<void> {
    // サーバーサイドでは何もしない
    if (this.isServer || this.#initialized)
      return

    const { xr } = window.navigator
    if (xr !== undefined) {
      try {
        const isSupported = await xr.isSessionSupported('immersive-vr')
        this.#xrSupported = isSupported && ua.pc
      }
      catch (e) {
        console.warn('WebXR awareness failed:', e)
        this.#xrSupported = false
      }
    }

    this.#initialized = true
  }

  /**
   * ローカルネットワーク判定パターンを追加（上書き）します。
   * @param patterns - ホスト名にマッチする正規表現パターンの配列
   */
  setLocalPatterns(...patterns: RegExp[]): void {
    this.#localPatterns = patterns
  }

  /**
   * 開発環境判定パターンを追加（上書き）します。
   * @param patterns - ホスト名にマッチする正規表現パターンの配列
   */
  setDevPatterns(...patterns: RegExp[]): void {
    this.#devPatterns = patterns
  }

  /**
   * ステージング環境判定パターンを追加（上書き）します。
   * @param patterns - ホスト名にマッチする正規表現パターンの配列
   */
  setStgPatterns(...patterns: RegExp[]): void {
    this.#stgPatterns = patterns
  }
}

const env = new Environment()

export { env }
