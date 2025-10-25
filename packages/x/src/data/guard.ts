/**
 * 与えられた値が「プレーンなオブジェクト（Object コンストラクタで生成された通常のオブジェクト）」かどうかを判定するユーティリティ。
 *
 * 詳細:
 * - null、配列、Date、クラスインスタンスなどはプレーンオブジェクトと見なさない（false を返す）。
 * - TypeScript の型ガードとして機能し、判定が true の場合に値を Record<string | symbol, unknown> と扱える。
 *
 * @param value 判定対象の任意の値
 * @returns value がプレーンなオブジェクトであれば true、それ以外は false
 *
 * @example
 * ```ts
 * isObject({}); // true
 * isObject(null); // false
 * isObject([]); // false
 * isObject(new Date()); // false
 * ```
 *
 * @see https://chaika.hatenablog.com/entry/2023/08/28/083000
 */
export function isObject(value: unknown): value is Record<string | symbol, unknown> {
  return value !== null && typeof value === 'object' && value.constructor === Object
}
