/**
 *
 * @param value
 * @returns value is Record<string | symbol, unknown>
 * @see https://chaika.hatenablog.com/entry/2023/08/28/083000
 */
export function isObject(value: unknown): value is Record<string | symbol, unknown> {
  return value !== null && typeof value === 'object' && value.constructor === Object
}
