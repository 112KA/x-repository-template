import { qs } from '../utils/document.js'

export function scrollTo(top: number) {
  window.scrollTo({
    top,
    behavior: 'smooth',
  })
}

let py: number

export function scrollFix(container: HTMLElement) {
  const target = container
  py = window.scrollY
  target.classList.add('fixed')
  target.style.top = `-${py}px`
}

export function scrollUnfix(container: HTMLElement) {
  const target = container
  target.classList.remove('fixed')
  target.style.top = ''
  window.scroll(0, py)
}

export function setupScrollToTop(btnClassName = '.btn-totop') {
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
