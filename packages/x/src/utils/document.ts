import { assert, assertIsDefined } from './assert.js'

export function qs<E extends Element = Element>(selectors: string): E {
  const element = document.querySelector<E>(selectors)
  assertIsDefined(element)
  return element
}

export function qsAll<E extends Element = Element>(selectors: string): NodeListOf<E> {
  const elements = document.querySelectorAll<E>(selectors)
  assert(elements.length > 0, `no selected elements: ${selectors}`)
  return elements
}
