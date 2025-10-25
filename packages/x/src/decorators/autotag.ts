import { isObject } from '../data/guard.js'

/**
 * クラスの prototype に Symbol.toStringTag を設定するデコレーター。
 *
 * 概要:
 * クラスにこのデコレーターを付与すると、インスタンスに対して
 * Object.prototype.toString.call(instance) を実行した際に
 * "[object <ClassName>]" 形式が返るようになります。
 *
 * 詳細:
 * - ctor.prototype がオブジェクトである場合にのみ Symbol.toStringTag を設定します。
 * - デコレーターは元のコンストラクタをそのまま返すため、チェーン可能です。
 *
 * @param ctor 対象となるクラスのコンストラクタ
 * @returns 引数で受け取った同じコンストラクタをそのまま返します
 * @example
 * ```ts
 * @autotag
 * class Foo {}
 * const f = new Foo()
 * Object.prototype.toString.call(f) // "[object Foo]"
 * ```
 * @see https://qiita.com/suin/items/666eac0a0aa8c19f7d21
 */
export const autotag: ClassDecorator = (ctor) => {
  if (isObject(ctor.prototype)) {
    ctor.prototype[Symbol.toStringTag] = ctor.name
  }
  return ctor
}
