import type { Paging } from 'x/features/paging'
import { PageBase } from '@js/page-base'

export class IndexPage extends PageBase {
  id = 'index'
  $el!: HTMLElement

  $button!: HTMLButtonElement

  constructor(paging: Paging) {
    super(paging)

    this.setupElement()

    this.paging.addPage(this)
  }

  override setupElement(): void {
    super.setupElement()

    this.$button = this.$el.querySelector('.btn-primary') as HTMLButtonElement
    this.$button.addEventListener('click', () => {
      this.paging.to('example')
    })
  }

  override async enter(): Promise<void> {
    await super.enter()
  }

  override async leave(): Promise<void> {
    await super.leave()
  }
}
