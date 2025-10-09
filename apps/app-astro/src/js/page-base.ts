import type { IPage, Paging } from 'x/features/paging'

export abstract class PageBase implements IPage {
  abstract id: string
  abstract $el: HTMLElement

  constructor(public paging: Paging) {}

  protected setupElement(): void {
    this.$el = document.getElementById(this.id)!
    this.$el.classList.add('hidden')
  }

  async enter(): Promise<void> {
    this.$el.classList.remove('hidden')
    this.$el.classList.add('visible')
  }

  async leave(): Promise<void> {
    this.$el.classList.remove('visible')
    this.$el.classList.add('hidden')
  }
}
