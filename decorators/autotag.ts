/**
 * クラスの prototype に Symbol.toStringTag を設定するクラスデコレーター。
 *
 * 概要:
 * このデコレーターを付与したクラスのインスタンスは、
 * Object.prototype.toString.call(instance) の結果が "[object <ClassName>]" になるように
 * prototype に Symbol.toStringTag を設定します。
 *
 * 詳細:
 * - constructor.prototype が null でない場合に限り、prototype に対して
 *   Symbol.toStringTag プロパティを定義します。
 * - 既存の Symbol.toStringTag があっても上書きして設定します。
 * - デコレーター自体はコンストラクタを変更せず同じコンストラクタを返すためチェーン可能です。
 *
 * @param constructor 対象となるクラスのコンストラクタ
 * @returns 引数で受け取った同じコンストラクタをそのまま返します
 *
 * @example
 * ```ts
 * @autotag
 * class Foo {}
 * const f = new Foo()
 * Object.prototype.toString.call(f) // "[object Foo]"
 * ```
 *
 * @remarks
 * 副作用は prototype に対するプロパティ定義のみで、外部I/Oや非同期処理は行いません。
 */
export const autotag: ClassDecorator = (constructor) => {
  if (constructor.prototype !== null) {
    const name = constructor.name ?? 'Object'
    // Symbol.toStringTag を設定（非列挙、再設定可能）
    Object.defineProperty(constructor.prototype, Symbol.toStringTag, {
      value: `[${name}]`,
      writable: false,
      configurable: true,
      enumerable: false,
    })
  }
  return constructor
}
