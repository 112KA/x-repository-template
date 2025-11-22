import { qsAll } from '../utils/document.js'

/**
 * data-motion / data-motion-toggle 属性に基づき IntersectionObserver で
 * 要素の再生/停止クラス（.play）を制御する。
 * 閾値は再生用が 0.5、停止用が 0。
 */
export function setupMotion(): void {
  const playIntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const { isIntersecting, target } = entry
        const hasPlayClass = target.classList.contains('play')

        if (target.hasAttribute('data-motion')) {
          if (isIntersecting) {
            target.classList.add('play')
          }

          playIntersectionObserver.unobserve(target)
        }
        else if (target.hasAttribute('data-motion-toggle')) {
          if (isIntersecting && !hasPlayClass) {
            target.classList.add('play')
          }
        }
      }
    },
    { threshold: 0.5 },
  )
  const stopIntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const { isIntersecting, target } = entry
        const hasPlayClass = target.classList.contains('play')
        if (target.hasAttribute('data-motion-toggle')) {
          if (!isIntersecting && hasPlayClass) {
            target.classList.remove('play')
          }
        }
      }
    },
    { threshold: 0 },
  )

  let elements: NodeListOf<Element>
  elements = qsAll('*[data-motion], *[data-motion-toggle]')
  for (const element of Array.from(elements)) {
    playIntersectionObserver.observe(element)
  }
  elements = qsAll('*[data-motion-toggle]')
  for (const element of Array.from(elements)) {
    stopIntersectionObserver.observe(element)
  }
}
