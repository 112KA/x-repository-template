export interface IPage {
  id: string
  $el: HTMLElement | null
  enter: () => Promise<void>
  leave: () => Promise<void>
}

export interface PagingEventMap {
  onUpdatePage: {
    pageId: string
  }
}

export class Paging extends EventTarget {
  protected _pages: Map<string, IPage> = new Map()
  protected _currentPage: IPage | null = null

  public addPage(page: IPage) {
    this._pages.set(page.id, page)
  }

  public removePage(page: IPage) {
    this._pages.delete(page.id)
  }

  public async to(id: string) {
    if (this._currentPage !== null) {
      if (this._currentPage.id === id)
        return
      await this._currentPage.leave()
    }

    this.dispatchEvent(new CustomEvent<PagingEventMap['onUpdatePage']>('onUpdatePage', { detail: { pageId: id } }))

    const page = this._pages.get(id)
    if (page) {
      this._currentPage = page
      await this._currentPage.enter()
    }
  }

  public getCurrentPage(): IPage | null {
    return this._currentPage
  }
}
