import { isObject } from '../data/guard.js'
/**
 *
 * @param constructor
 * @returns TFunction
 * @see https://qiita.com/suin/items/666eac0a0aa8c19f7d21
 */
export const autotag: ClassDecorator = (ctor) => {
  if (isObject(ctor.prototype)) {
    ctor.prototype[Symbol.toStringTag] = ctor.name
  }
  return ctor
}
