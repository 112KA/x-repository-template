import { AbstractError } from './abstract-error.js'

/**
 * AssertionError はアサーション（期待値と実際の値の検証）が失敗したことを表すエラーです。
 *
 * 詳細:
 * このエラーは、テストや検証ロジックで期待した条件が満たされなかった場合に投げられます。
 * 内部的には AbstractError を継承しており、メッセージやスタックトレースの取り扱いは親クラスに従います。
 *
 * @example
 * ```ts
 * throw new AssertionError('expected true but got false')
 * ```
 *
 * @remarks
 * 必要に応じてサブクラス化して expected / actual などの追加情報を持たせることができます。
 *
 * @extends AbstractError
 * @public
 */
export class AssertionError extends AbstractError {}
