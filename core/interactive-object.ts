import { ExtendEventTarget } from './extend-event-target.js'

export class InteractiveObject extends ExtendEventTarget {
  constructor(targetElement: HTMLElement | Window, isAddEventListeners = true) {
    super()

    this.set({ targetElement })

    if (isAddEventListeners) {
      this.addEventListeners(targetElement)
    }
  }

  protected addEventListeners(targetElement: HTMLElement | Window): void {
    targetElement.addEventListener('pointerdown', this._bubble)
    targetElement.addEventListener('pointermove', this._bubble)
    targetElement.addEventListener('pointerup', this._bubble)
    targetElement.addEventListener('pointerleave', this._bubble)
  }

  dispose() {
    const targetElement = this.get('targetElement') as HTMLElement
    targetElement.removeEventListener('pointerdown', this._bubble)
    targetElement.removeEventListener('pointermove', this._bubble)
    targetElement.removeEventListener('pointerup', this._bubble)
    targetElement.removeEventListener('pointerleave', this._bubble)
  }

  protected _bubble = (e: Event) =>
  // biome-ignore lint/suspicious/noExplicitAny: 直し方わからない
    this.dispatchEvent(new (e as any).constructor(e.type, e))

  protected _discard = (e: Event) => e.preventDefault()
}
