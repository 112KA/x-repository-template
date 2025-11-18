import { assertIsDefined } from '../utils/assert.js'
import { qs, qsAll } from '../utils/document.js'
import { scrollFix, scrollUnfix } from './scroll.js'
import { YoutubePlayer } from './youtube.js'

/**
 * モーダルの初期化を行う。
 *
 * classNamePrefix を使って対象の modal/container クラスを解決し、
 * data-modal 属性を持つボタンでモーダルを開き、閉じるボタンで閉じる処理を設定する。
 *
 * YouTube 用の data-modal="youtube:VIDEO_ID" のような指定にも対応する。
 *
 * @param classNamePrefix - クラス名のプレフィックス（デフォルトは空文字）
 */
export function setupModal(classNamePrefix = ''): void {
  const modalButtons = qsAll('button[data-modal]')
  const modal = qs(`.${classNamePrefix}modal`)
  const container = qs<HTMLElement>(`.${classNamePrefix}container`)
  const modalContents = qsAll('div[data-content]')
  const styleSheet = document.styleSheets.item(document.styleSheets.length - 1)
  const closeButton = qs(`.${classNamePrefix}modal__button-close`)

  let yplayer: YoutubePlayer

  assertIsDefined(styleSheet)

  if (modalContents) {
    for (const div of Array.from(modalContents)) {
      const target = div.getAttribute('data-content')
      styleSheet.insertRule(
        `.${classNamePrefix}modal[data-target="${target}"] div[data-content="${target}"] {display:block;}`,
        0,
      )
    }
  }
  else {
    console.warn('[x] setupModal - no modalContents')
  }

  for (const button of Array.from(modalButtons)) {
    button.addEventListener('click', (be: Event): void => {
      be.preventDefault()
      const modalId = button.getAttribute('data-modal')

      assertIsDefined(modalId)

      const tmpArr = modalId.split(':')
      const target = tmpArr[0]

      modal.setAttribute('data-target', target)
      modal.classList.add('open')
      scrollFix(container)

      if (target === 'youtube') {
        if (yplayer === undefined) {
          yplayer = new YoutubePlayer()
          yplayer
            .create('player')
            .then(() => {
              yplayer.play(tmpArr[1])
            })
            .catch((e) => {
              console.warn('Youtube create error', e)
            })
        }
        else {
          yplayer.play(tmpArr[1])
        }
      }
    })
  }

  if (closeButton) {
    closeButton.addEventListener('click', (e: Event) => {
      e.preventDefault()
      modal.classList.remove('open')
      scrollUnfix(container)
      if (yplayer) {
        yplayer.stop()
      }
    })
  }
  else {
    console.warn('[x] setupModal - no closeButton')
  }
}
