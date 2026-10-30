import { describe, expect, it } from "vite-plus/test";
import { autotag } from "./autotag.js";

describe("autotag デコレーター", () => {
  it("インスタンスの Symbol.toStringTag にクラス名を設定する", () => {
    @autotag
    class Foo {}
    const f = new Foo();
    expect(Object.prototype.toString.call(f)).toBe("[object [Foo]]");
  });

  it("関数コンストラクターをそのまま返し、prototype にタグを設定する", () => {
    function Bar() {}
    const ret = autotag(Bar);
    expect(ret).toBe(Bar);
    expect(Bar.prototype[Symbol.toStringTag]).toBe("[Bar]");
  });

  it("prototype が null の場合は変更しない", () => {
    const Ctor = function CtorNoProto() {};
    Ctor.prototype = null;
    const ret = autotag(Ctor);
    expect(ret).toBe(Ctor);
    expect(Ctor.prototype).toBeNull();
  });
});
