import { assertIsDefined } from '../utils/assert.js'

export class ExtendEventTarget extends EventTarget {
  #properties: Record<string, unknown> = {}

  protected _listeners: Record<string, EventListenerOrEventListenerObject[]> = {}

  get(key: string) {
    return this.#properties[key]
  }

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

  public addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    super.addEventListener(type, callback, options)

    assertIsDefined(callback)

    if (!Object.prototype.hasOwnProperty.call(this._listeners, type)) {
      this._listeners[type] = []
    }
    this._listeners[type].push(callback)
  }

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
