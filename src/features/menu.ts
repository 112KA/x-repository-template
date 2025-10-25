import { qs } from '../utils/document.js'
import { scrollFix, scrollUnfix } from './scroll.js'

/**
 * メニューのセットアップを行う。
 *
 * classNamePrefix を先頭に付与した要素を探索し、メニューボタンのクリックで
 * メニュー開閉とスクロール固定/解除を行う。
 *
 * @param classNamePrefix - クラス名のプレフィックス（デフォルトは空文字）。例: 'site-'
 */
export function setupMenu(classNamePrefix = '') {
  const menu = qs(`.${classNamePrefix}menu`)
  const menuButton = qs(`.${classNamePrefix}menu__button`)
  const container = qs<HTMLElement>(`.${classNamePrefix}container`)

  if (menuButton) {
    menuButton.addEventListener('click', (e): void => {
      e.preventDefault()
      menu.classList.toggle('open')
      if (menu.classList.contains('open')) {
        scrollFix(container)
      }
      else {
        scrollUnfix(container)
      }
    })
  }
  else {
    console.warn('[x] setupMenu - no menuButtonClass')
  }
}
