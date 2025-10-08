import { AssertionError } from '../errors/assertion-error.js'

export function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message)
  }
}

export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Expected 'value' to be defined, but received:${value}: ${typeof value})`)
  }
}
