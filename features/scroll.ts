import { qs } from '../web/document.js'

/**
 * スムーススクロールで指定トップ位置へ移動する。
 *
 * @param top - 目的の垂直位置（ピクセル）
 */
export function scrollTo(top: number): void {
  window.scrollTo({
    top,
    behavior: 'smooth',
  })
}

let py: number

/**
 * 指定コンテナを固定表示状態にする（スクロール位置を保持）。
 *
 * @param container - 固定対象の HTMLElement
 */
export function scrollFix(container: HTMLElement): void {
  const target = container
  py = window.scrollY
  target.classList.add('fixed')
  target.style.top = `-${py}px`
}

/**
 * scrollFix の解除を行い、元のスクロール位置に戻す。
 *
 * @param container - 固定解除対象の HTMLElement
 */
export function scrollUnfix(container: HTMLElement): void {
  const target = container
  target.classList.remove('fixed')
  target.style.top = ''
  window.scroll(0, py)
}

/**
 * ページトップへ戻るボタンのクリックイベントをセットアップする。
 *
 * @param btnClassName - ボタンのセレクタ（デフォルト '.btn-totop'）
 */
export function setupScrollToTop(btnClassName = '.btn-totop'): void {
  const button = qs(btnClassName)
  if (button) {
    button.addEventListener('click', (e: Event) => {
      e.preventDefault()
      scrollTo(0)
    })
  }
  else {
    console.warn('[x] setupScrollToTop - no button')
  }
}
