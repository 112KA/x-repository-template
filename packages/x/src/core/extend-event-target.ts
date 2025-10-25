import { assertIsDefined } from 'x/utils'

/**
 * ExtendEventTarget
 *
 * EventTarget を拡張したユーティリティクラスです。内部にキー/値のストアを保持し、
 * プロパティが変更された際に対応する名前の CustomEvent を dispatch します。
 *
 * 主な機能:
 * - set によるプロパティ変更時に detail に { value, value0 } を含む CustomEvent を発火。
 * - addEventListener / removeEventListener の呼び出しをラップし、登録済みリスナーを内部で追跡。
 */
export class ExtendEventTarget extends EventTarget {
  #properties: Record<string, unknown> = {}

  protected _listeners: Record<string, EventListenerOrEventListenerObject[]> = {}

  /**
   * 指定したキーに対応する値を返します。
   *
   * @param key 取得するプロパティのキー
   * @returns キーに対応する値（存在しなければ undefined）
   */
  get(key: string) {
    return this.#properties[key]
  }

  /**
   * 複数のプロパティをまとめて設定します。
   *
   * 与えられた各キーについて、既存値と異なる場合のみ内部ストアに保存し、
   * そのキー名をイベント type とする CustomEvent を dispatch します。
   *
   * dispatch される CustomEvent の detail は次の形を取ります:
   * { value: 新しい値, value0: 変更前の値 }
   *
   * @param properties 設定するキー/値のマップ
   */
  set(properties: Record<string, unknown>) {
    for (const [type, value] of Object.entries(properties)) {
      if (this.#properties[type] === undefined || this.#properties[type] !== value) {
        const value0 = this.#properties[type]
        this.#properties[type] = value

        this.dispatchEvent(
          new CustomEvent(type, {
            detail: {
              value,
              value0,
            },
          }),
        )
      }
    }
  }

  /**
   * イベントリスナーを登録し、内部のリスナー一覧に追跡情報を追加します。
   *
   * このメソッドは EventTarget.prototype.addEventListener を呼び出した上で
   * 内部配列へ同じコールバックを登録します。callback が null の場合はアサートにより弾かれます。
   *
   * @param type 登録するイベント名
   * @param callback 登録するリスナー（null は許容されません）
   * @param options addEventListener に渡すオプション
   */
  public addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    // callback が null のまま親に渡さないよう、先にチェックします
    assertIsDefined(callback)

    super.addEventListener(type, callback, options)

    if (!Object.prototype.hasOwnProperty.call(this._listeners, type)) {
      this._listeners[type] = []
    }
    this._listeners[type].push(callback)
  }

  /**
   * イベントリスナーを削除し、内部の追跡情報からも除去します。
   *
   * callback が null の場合はその type に関する登録情報をすべて削除します。
   *
   * @param type 削除対象のイベント名
   * @param callback 削除するコールバック（null で全削除）
   * @param options removeEventListener に渡すオプション
   */
  public removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined,
  ): void {
    super.removeEventListener(type, callback, options)

    if (callback === null) {
      delete this._listeners[type]
    }
    else if (Object.prototype.hasOwnProperty.call(this._listeners, type)) {
      this._listeners[type] = this._listeners[type].filter(value => value !== callback)
      if (this._listeners[type].length === 0) {
        delete this._listeners[type]
      }
    }
  }
}
