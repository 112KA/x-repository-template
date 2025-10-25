/**
 * 関数もしくは文字列ソースから Blob URL を生成し Worker を起動する簡易ラッパー。
 * terminate 時に URL を revoke。
 */
export class InlineWorker extends Worker {
  #context = ''

  /**
   * @param src 関数(本体抽出) もしくは Worker スクリプト文字列
   * @throws TypeError 引数型不正
   */
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

  /** Worker を終了し Blob URL を解放 */
  terminate() {
    super.terminate()
    URL.revokeObjectURL(this.#context)
  }
}
