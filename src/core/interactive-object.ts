import { autotag } from 'x/decorators/autotag.js'
import { ExtendEventTarget } from './extend-event-target.js'

/**
 * InteractiveObject
 *
 * DOM 要素または Window をターゲットにして pointer 系イベントを受け取り、
 * 受け取ったイベントを内部で再発火（バブル）するユーティリティクラスです。
 *
 * ExtendEventTarget を継承し、プロパティ変更の CustomEvent 発火や
 * リスナー追跡機能を利用します。
 */
@autotag
export class InteractiveObject extends ExtendEventTarget {
  /**
   * コンストラクタ
   *
   * @param targetElement イベント受け取り対象の HTMLElement または Window
   * @param isAddEventListeners true の場合、デフォルトの pointer リスナーを自動追加
   */
  constructor(targetElement: HTMLElement | Window, isAddEventListeners = true) {
    super()

    this.set({ targetElement })

    if (isAddEventListeners) {
      this.addEventListeners(targetElement)
    }
  }

  /**
   * ターゲットに対して標準の pointer 系イベントリスナーを追加します。
   *
   * @param targetElement イベントを追加する HTMLElement または Window
   */
  protected addEventListeners(targetElement: HTMLElement | Window): void {
    targetElement.addEventListener('pointerdown', this._bubble)
    targetElement.addEventListener('pointermove', this._bubble)
    targetElement.addEventListener('pointerup', this._bubble)
    targetElement.addEventListener('pointerleave', this._bubble)
  }

  /**
   * 登録したリスナーを解除してリソースを開放します。
   *
   * 内部で保持している targetElement から登録した pointer イベントを取り除きます。
   */
  dispose(): void {
    const targetElement = this.get('targetElement') as HTMLElement
    targetElement.removeEventListener('pointerdown', this._bubble)
    targetElement.removeEventListener('pointermove', this._bubble)
    targetElement.removeEventListener('pointerup', this._bubble)
    targetElement.removeEventListener('pointerleave', this._bubble)
  }

  /**
   * 受け取ったイベントを複製して再発火（バブル）します。
   *
   * - 受け取った Event のコンストラクタを用いて新しいイベントを生成します。
   * - CustomEvent の場合は detail を引き継ぎ、bubbles/cancelable/composed 等も可能な限り継承します。
   *
   * @param e 元の Event
   */
  protected _bubble = (e: Event) => {
    this.dispatchEvent(new (e as any).constructor(e.type, e))
  }

  /**
   * イベントを破棄（preventDefault）します。
   *
   * 主にスクロール無効化時に使用します。
   *
   * @param e 対象の Event
   */
  protected _discard = (e: Event) => e.preventDefault()
}
