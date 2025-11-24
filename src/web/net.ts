/**
 * 画像読み込みを Promise 化する。
 * @param img 既存の HTMLImageElement
 * @param src 設定する src (省略可、空文字なら現状維持)
 * @returns 読み込み完了で HTMLImageElement を resolve
 */
export function loadImage(img: HTMLImageElement, src = ''): Promise<HTMLImageElement> {
  const target = img
  return new Promise((resolve, reject) => {
    target.onload = () => resolve(target)
    target.onerror = e => reject(e)
    if (src !== '') {
      target.src = src
    }
  })
}

/**
 * クエリ取得ユーティリティ。
 * @param key キー指定。省略時は URLSearchParams 全体
 * @returns key 指定時は値(string|null)、未指定時は URLSearchParams
 */
export function getQuery(key = ''): string | null | URLSearchParams {
  const searchParams = new URLSearchParams(window.location.search)
  if (key) {
    return searchParams.get(key)
  }
  return searchParams
}
