import { qs } from '../utils/document.js'
import { scrollFix, scrollUnfix } from './scroll.js'

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
