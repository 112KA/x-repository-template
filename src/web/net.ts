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
