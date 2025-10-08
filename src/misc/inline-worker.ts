export class InlineWorker extends Worker {
  #context = ''

  constructor(src: () => undefined | string) {
    if (!(typeof src === 'function' || typeof src === 'string')) {
      throw new TypeError('argument must be \'function\' or \'string\'')
    }

    const context = URL.createObjectURL(
      new Blob([
        typeof src === 'function'
          ? src
              .toString()
              .replace(/^.+?\{/s, '')
              .replace(/\}$/, '')
          : src,
      ]),
    )
    super(context)

    this.#context = context
  }

  terminate() {
    super.terminate()
    URL.revokeObjectURL(this.#context)
  }
}
