import { autotag } from 'x/decorators/autotag.js'
import { Ticker } from '../misc/ticker.js'
import { InteractiveObject } from './interactive-object.js'

/**
 * Stage
 *
 * アプリケーション全体を表すステージオブジェクト。
 * InteractiveObject を継承し、pointer 系イベントの伝播やリスナー管理を行います。
 * 内部で Ticker を保持し、'tick' イベントの購読数に応じて自動的に開始/停止します。
 *
 * @remarks
 * - Window をターゲットとしてグローバルイベント（resize/scroll/wheel）を監視し、内部でバブルします。
 * - stage はライブラリ全体のグローバルなイベント中継点として利用されます。
 */
@autotag
export class Stage extends InteractiveObject {
  protected _ticker = new Ticker()

  #scrollEnabled = true

  /**
   * コンストラクタ
   *
   * Window をターゲットにして初期化し、pointer 系および window のグローバルイベント登録を行います。
   */
  constructor() {
    super(window, false)

    this.addEventListeners(window)
  }

  // [Symbol.toStringTag] = 'Stage';

  /**
   * ターゲット（HTMLElement | Window）に対してイベントリスナーを追加します。
   *
   * @param targetElement - イベントを追加する対象（HTMLElement | Window）
   * @remarks
   * 親クラスの addEventListeners を呼び出した上で、内部の Ticker と window の resize/scroll/wheel を監視します。
   */
  protected addEventListeners(targetElement: HTMLElement | Window): void {
    super.addEventListeners(targetElement)

    this._ticker.addEventListener('tick', this._bubble)

    targetElement.addEventListener('resize', this._bubble)
    targetElement.addEventListener('scroll', this._bubble)
    targetElement.addEventListener('wheel', this._bubble)
  }

  /**
   * リソース解放 / リスナー解除
   *
   * ここでは InteractiveObject 側で登録したポインター関連のリスナーに加え、
   * 内部の Ticker と window のグローバルリスナーも解除します。
   */
  public dispose(): void {
    super.dispose()
    this._ticker.removeEventListener('tick', this._bubble)
    const targetElement = this.get('targetElement') as HTMLElement | Window
    targetElement.removeEventListener('resize', this._bubble)
    targetElement.removeEventListener('scroll', this._bubble)
    targetElement.removeEventListener('wheel', this._bubble)
  }

  /**
   * addEventListener をオーバーライドして購読数に応じた副作用を追加します。
   *
   * @param type - イベント名
   * @param callback - イベントリスナー（null は親クラス側で弾かれる想定）
   * @param options - addEventListener に渡すオプション
   * @remarks
   * 'tick' イベントの最初のリスナー登録時に内部の Ticker を起動します。
   */
  public addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    super.addEventListener(type, callback, options)

    if (this._listeners[type].length === 1) {
      switch (type) {
        case 'tick':
          this._ticker.start()
          break
        default:
      }
    }
  }

  /**
   * removeEventListener をオーバーライドして購読解除時の副作用を追加します。
   *
   * @param type - イベント名
   * @param callback - 削除するリスナー。null が渡された場合はその type の登録をすべて削除します。
   * @param options - removeEventListener に渡すオプション
   * @remarks
   * 'tick' の購読がなくなった場合に内部の Ticker を停止します。
   */
  public removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined,
  ): void {
    super.removeEventListener(type, callback, options)

    if (!Object.prototype.hasOwnProperty.call(this._listeners, type)) {
      switch (type) {
        case 'tick':
          this._ticker.stop()
          break
        default:
      }
    }
  }

  /**
   * DOMContentLoaded を待つユーティリティ。
   *
   * @returns Promise<void> - DOMContentLoaded 後に解決される Promise
   * @remarks
   * 既に DOM が読み込まれている場合は即時解決します。
   */
  static ready(): Promise<void> {
    return new Promise((resolve) => {
      const loaded = (): void => {
        document.removeEventListener('DOMContentLoaded', loaded)
        resolve()
      }

      // loading 以外なら既に DOMContentLoaded 相当とみなす
      if (document.readyState !== 'loading') {
        resolve()
      }
      else {
        document.addEventListener('DOMContentLoaded', loaded)
      }
    })
  }

  /**
   * window の load イベントを待つユーティリティ。
   *
   * @returns Promise<void> - load イベント発火後に解決される Promise
   * @remarks
   * 既に load 済み（document.readyState === 'complete'）なら即時解決します。
   */
  static loaded(): Promise<void> {
    return new Promise((resolve) => {
      const loaded = (): void => {
        window.removeEventListener('load', loaded)
        resolve()
      }

      // 既に load 済みなら即時解決
      if (document.readyState === 'complete') {
        resolve()
      }
      else {
        window.addEventListener('load', loaded)
      }
    })
  }

  /**
   * ステージの幅（ウィンドウ幅）
   *
   * @returns number - 現在の window.innerWidth（利用できない場合は 0）
   */
  static get width(): number {
    return window.innerWidth ?? 0
  }

  /**
   * ステージの高さ（ウィンドウ高さ）
   *
   * @returns number - 現在の window.innerHeight（利用できない場合は 0）
   */
  static get height(): number {
    return window.innerHeight ?? 0
  }

  /**
   * スクロール制御の有効/無効を設定します。
   *
   * @param v - true でスクロールを許可、false でスクロールを無効化（wheel / pointermove の preventDefault を利用）
   * @remarks
   * 無効化時は passive: false を指定して preventDefault が動作するようにします。
   */
  set scrollEnabled(v: boolean) {
    if (this.#scrollEnabled === v)
      return

    this.#scrollEnabled = v
    if (v) {
      document.removeEventListener('wheel', this._discard)
      document.removeEventListener('pointermove', this._discard)
    }
    else {
      document.addEventListener('wheel', this._discard, { passive: false })
      document.addEventListener('pointermove', this._discard, {
        passive: false,
      })
    }
  }

  /**
   * 現在の scrollEnabled の状態を返します。
   *
   * @returns boolean - スクロールが有効なら true
   */
  get scrollEnabled(): boolean {
    return this.#scrollEnabled === true
  }
}

/**
 * グローバルなステージインスタンス
 *
 * ライブラリ全体で共有される単一の Stage インスタンスです。
 */
export const stage = /* #__PURE__ */ new Stage()
