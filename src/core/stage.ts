import { Ticker } from '../misc/ticker.js'
import { InteractiveObject } from './interactive-object.js'

export class Stage extends InteractiveObject {
  protected _ticker = new Ticker()

  #scrollEnabled = true

  constructor() {
    super(window, false)

    this.addEventListeners(window)
  }

  // [Symbol.toStringTag] = 'Stage';

  protected addEventListeners(targetElement: HTMLElement | Window): void {
    super.addEventListeners(targetElement)

    this._ticker.addEventListener('tick', this._bubble)

    targetElement.addEventListener('resize', this._bubble)
    targetElement.addEventListener('scroll', this._bubble)
    targetElement.addEventListener('wheel', this._bubble)
  }

  public dispose() {
    super.dispose()
    this._ticker.removeEventListener('tick', this._bubble)
    const targetElement = this.get('targetElement') as HTMLElement
    targetElement.removeEventListener('resize', this._bubble)
    targetElement.removeEventListener('scroll', this._bubble)
    targetElement.removeEventListener('wheel', this._bubble)
  }

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

  static ready(): Promise<void> {
    return new Promise((resolve) => {
      const loaded = () => {
        document.removeEventListener('DOMContentLoaded', loaded)
        resolve()
      }

      if (document.readyState === 'complete') {
        resolve()
      }
      else {
        document.addEventListener('DOMContentLoaded', loaded)
      }
    })
  }

  static loaded(): Promise<void> {
    return new Promise((resolve) => {
      const loaded = () => {
        window.removeEventListener('load', loaded)

        resolve()
      }

      window.addEventListener('load', loaded)
    })
  }

  static get width() {
    return window.innerWidth ?? 0
  }

  static get height() {
    return window.innerHeight ?? 0
  }

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

  get scrollEnabled() {
    return this.#scrollEnabled === true
  }
}

export const stage = /* #__PURE__ */ new Stage()
