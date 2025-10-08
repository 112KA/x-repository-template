import { stage } from '../core/stage.js'
import { Ticker } from '../misc/ticker.js'
import { qs } from '../utils/document.js'
/**
 * 360px 未満は viewport を固定する
 * @ref https://zenn.dev/tak_dcxi/articles/690caf6e9c4e26
 */
export function setupSwitchViewport() {
  const switchViewport = () => {
    const viewport = qs('meta[name="viewport"]')
    const value = window.outerWidth > 360 ? 'width=device-width,initial-scale=1' : 'width=360'
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value)
    }
  }
  stage.addEventListener('resize', switchViewport)
  switchViewport()
}

/**
 * @ref https://zenn.dev/tak_dcxi/articles/2ac77656aa94c2cd40bf
 */
export function setupViewportHeight() {
  const ticker = new Ticker()
  ticker.fps = 2

  let storedWidth = -1
  let storedHeight = -1

  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  // NOTE: ios safariの高さがresizeで設定できないので、一定時間ごとにheight設定処理をする
  ticker.addEventListener('tick', () => {
    const { innerWidth, innerHeight } = window
    if (storedWidth === innerWidth && storedHeight === innerHeight)
      return

    storedWidth = innerWidth
    storedHeight = innerHeight

    setViewportHeight()
  })

  setViewportHeight()
  ticker.start()
}
