import { AssertionError } from '../errors/assertion-error.js'

/**
 * 条件が false の場合 AssertionError を投げる。
 * @param condition 判定式
 * @param message エラーメッセージ
 */
export function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message)
  }
}

/**
 * 値が undefined / null でないことを保証。
 * @param value 対象値
 */
export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Expected value to be defined, but received: ${value} (type: ${typeof value})`)
  }
}
