/**
 * 深くマージするユーティリティ。
 * plain object 同士のみ再帰的にマージし、配列や null/その他は上書きする。
 * @typeParam T マージ先型
 * @typeParam U マージ元型
 * @param target マージ先オブジェクト（変更されない）
 * @param source マージ元オブジェクト
 * @returns マージ後の新しいオブジェクト (T & U)
 */
export function deepmerge<T extends Record<string, any>, U extends Record<string, any>>(target: T, source: U): T & U {
  const isPlainObject = (v: unknown): v is Record<string, any> =>
    v !== null && typeof v === 'object' && !Array.isArray(v)

  const destination: Record<string, any> = { ...target }

  for (const [key, value] of Object.entries(source)) {
    const current = destination[key]
    if (isPlainObject(current) && isPlainObject(value)) {
      destination[key] = deepmerge(current, value)
    }
    else {
      destination[key] = value
    }
  }

  return destination as T & U
}
