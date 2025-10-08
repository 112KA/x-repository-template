import { assertIsDefined } from '../utils/assert.js'

export type DeviceSize = 'sm' | 'md' | 'lg'
export type MediaQueryEventMap = {
  change: {
    deviceSize: DeviceSize
  }
}

// const LOG_PREFIX = '[MediaQuery]'

export class MediaQuery extends EventTarget {
  private _mediaQueryMap: Map<string, DeviceSize[]> = new Map<string, DeviceSize[]>()

  public deviceSize: DeviceSize = 'sm'

  constructor(mdBreakPoint = 600, lgBreakPoint = 1025) {
    super()

    this._mediaQueryMap.set(`(min-width: ${mdBreakPoint}px)`, ['sm', 'md'])
    this._mediaQueryMap.set(`(min-width: ${lgBreakPoint}px)`, ['md', 'lg'])

    this._mediaQueryMap.forEach(([, largerBreakPoint]: DeviceSize[], key: string) => {
      const mql = window.matchMedia(key)
      mql.addEventListener('change', this._onChange)
      if (mql.matches) {
        this.deviceSize = largerBreakPoint
      }
    })

    if (this.deviceSize === undefined) {
      this.deviceSize = 'sm'
    }
  }

  private _onChange = (e: MediaQueryListEvent) => {
    // console.log(LOG_PREFIX, '_onChange', { e })

    const deviceSizeList = this._mediaQueryMap.get(e.media)
    assertIsDefined(deviceSizeList)

    this.deviceSize = e.matches ? deviceSizeList[1] : deviceSizeList[0]

    this.dispatchEvent(new CustomEvent<MediaQueryEventMap['change']>('change', { detail: { deviceSize: this.deviceSize } }))
  }
}
