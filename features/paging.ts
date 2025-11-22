/**
 * ページ表現インターフェース。
 * enter/leave は非同期でページ入れ替えアニメーション等に対応する。
 */
export interface IPage {
  id: string
  $el: HTMLElement | null
  enter: () => Promise<void>
  leave: () => Promise<void>
}

/** Paging の発行するイベントマップ */
export interface PagingEventMap {
  onUpdatePage: {
    pageId: string
  }
}

/**
 * ページの登録・遷移を行うユーティリティクラス。
 * EventTarget を継承し onUpdatePage を発行する。
 */
export class Paging extends EventTarget {
  protected _pages: Map<string, IPage> = new Map()
  protected _currentPage: IPage | null = null

  public addPage(page: IPage): void {
    this._pages.set(page.id, page)
  }

  public removePage(page: IPage): void {
    this._pages.delete(page.id)
  }

  /**
   * 指定 ID のページへ遷移する。
   * 現在ページがあれば leave を待ってから新ページの enter を実行する。
   *
   * @param id - 遷移先ページの id
   */
  public async to(id: string): Promise<void> {
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

  /**
   * 現在のページを返す（未設定時は null）。
   */
  public getCurrentPage(): IPage | null {
    return this._currentPage
  }
}
