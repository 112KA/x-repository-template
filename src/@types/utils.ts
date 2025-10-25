/**
 * Nullable<T>
 *
 * 指定した型 T または null を許容するユニオン型です。
 *
 * @template T - 許容する基本型
 *
 * @example
 * const name: Nullable<string> = null;
 * const age: Nullable<number> = 30;
 *
 * @remarks
 * DOM API や外部入力など、値が null になり得る箇所の型注釈に使用します。
 */
export type Nullable<T> = T | null

/**
 * PartiallyPartial<T, K>
 *
 * 元のオブジェクト型 T から、キー K に該当するプロパティのみを省略可能（optional）にした新しい型を作成します。
 * 内部では Omit で対象プロパティを除外し、Partial と Pick を組み合わせてその部分だけ optional にしています。
 *
 * @template T - 元のオブジェクト型
 * @template K - 省略可能にしたいプロパティのキー（T のキーのいずれか）
 *
 * @example
 * type User = { id: number; name: string; phone?: string }
 * // phone を省略可能にした新しい型
 * type UserPartialPhone = PartiallyPartial<User, 'phone'>
 *
 * @see https://qiita.com/aqua_ix/items/b3a9b920781d833cede8
 *
 * @remarks
 * 特定のプロパティのみを optional にしたい場合に便利です。既存の型の他のプロパティには影響を与えません。
 */
export type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * ValueOf<T>
 *
 * オブジェクト型 T の全プロパティの値の型をユニオンとして抽出します。
 * 例えば `type M = { a: number; b: string }` の場合、`ValueOf<M>` は `number | string` になります。
 *
 * @template T - オブジェクト型
 *
 * @example
 * type M = { a: number; b: string }
 * type V = ValueOf<M> // number | string
 *
 * @remarks
 * マップ状のオブジェクトから値型のユニオンを取得したい場面で使用します。
 */
export type ValueOf<T> = T[keyof T]
