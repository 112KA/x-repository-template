class Environment {
  local = /localhost|192.168|172.16/.test(window.location.hostname)

  dev = /dev/.test(window.location.hostname)

  stg = /stg/.test(window.location.hostname)

  prd = !(this.local || this.dev || this.stg)

  ios = /iPhone|iPod|iPad/.test(navigator.userAgent)

  android = /Android/.test(navigator.userAgent)

  quest = /Quest/.test(navigator.userAgent)

  tablet
    = (/iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document)
      || (/Android/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent))

  pc = !(this.tablet || this.ios || this.android || this.quest)

  support = {
    touch: 'ontouchstart' in window,
    xr: false,
  }

  ie = /msie|trident/i.test(navigator.userAgent)

  edge = /edg/i.test(navigator.userAgent)

  safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)
}
const env = new Environment()

void (async () => {
  const { xr } = window.navigator
  if (xr !== undefined) {
    const isSupported = await xr.isSessionSupported('immersive-vr')
    env.support.xr = isSupported && env.pc
  }
})()
export { env }
