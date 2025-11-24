import { assert, assertIsDefined } from '../data/assert.js'

/**
 * 単一要素取得。存在しなければ例外。
 * @param selectors CSS セレクタ
 */
export function qs<E extends Element = Element>(selectors: string): E {
  const element = document.querySelector<E>(selectors)
  assertIsDefined(element)
  return element
}

/**
 * 複数要素取得。1件も無ければ例外。
 * @param selectors CSS セレクタ
 */
export function qsAll<E extends Element = Element>(selectors: string): NodeListOf<E> {
  const elements = document.querySelectorAll<E>(selectors)
  assert(elements.length > 0, `no selected elements: ${selectors}`)
  return elements
}
