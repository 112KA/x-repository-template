import { describe, expect, it } from 'vitest'
import { autotag } from './autotag.js'

describe('autotag decorator', () => {
  it('sets Symbol.toStringTag on instances to class name', () => {
    @autotag
    class Foo {}
    const f = new Foo()
    expect(Object.prototype.toString.call(f)).toBe('[object [Foo]]')
  })

  it('returns the same constructor and sets prototype tag for function constructors', () => {
    function Bar() {}
    const ret = autotag(Bar)
    expect(ret).toBe(Bar)
    expect(Bar.prototype[Symbol.toStringTag]).toBe('[Bar]')
  })

  it('does nothing when prototype is not an object', () => {
    const Ctor = function CtorNoProto() {}
    ;(Ctor as unknown as any).prototype = null
    const ret = autotag(Ctor)
    expect(ret).toBe(Ctor)
    expect((Ctor as any).prototype).toBeNull()
  })
})
