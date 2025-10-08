import { Ticker } from 'x/misc'

export type CoundDownEventMap = {
  'tick': {
    count: number
  },
  'complete': {}
}

export class CountDown extends EventTarget {
  public count = 0
  public ticker = new Ticker()

  constructor(public initialCount: number) {
    super()

    this.ticker.addEventListener('tick', this.#tickHandler)
  }

  reset() {
    this.count = this.initialCount
  }

  start() {
    this.ticker.start()
  }

  stop() {
    // console.log('stop countdown')
    this.ticker.stop()
  }

  #tickHandler = (e: Event) => {
    const { time, dt: _dt } = (e as CustomEvent).detail
    const count = this.initialCount - ~~Math.floor(time / 1000)

    if (this.count !== count) {
      // console.log("tick", { count, time, dt });
      this.count = count
      this.dispatchEvent(new CustomEvent<CoundDownEventMap['tick']>('tick', { detail: { count } }))
      if (this.count === 0) {
        this.stop()
        this.dispatchEvent(new CustomEvent<CoundDownEventMap['complete']>('complete'))
      }
    }
  }
}
