/**
 * カスタムエラーの基底となる抽象クラス。
 *
 * Error を拡張し、以下を保証します:
 * - 派生クラス名をエラーの name に設定すること
 * - V8 (Node.js) 環境では Error.captureStackTrace により適切なスタックトレースを取得すること
 * - TypeScript の downcast / instanceof が期待通り動作するよう設計されていること
 *
 * @remarks
 * Object.setPrototypeOf の呼び出しは、TypeScript の出力ターゲットが ES2015 より古い場合（ES5/ES3）
 * に必要となることがあります。本クラスはロジック上その要否を明示するのみで、実装の互換性を
 * 目的としています。
 *
 * @example
 * class MyError extends AbstractError {}
 * throw new MyError('something went wrong')
 */
export abstract class AbstractError extends Error {
  /**
   * エラーメッセージを受け取るコンストラクタ。
   *
   * @param message エラーメッセージ（省略時は空文字列）
   *
   * @remarks
   * Error.captureStackTrace が利用可能な環境ではスタックトレースの調整を行います。
   * コードの振る舞い自体は変更しないため、安全に継承して使用できます。
   */
  constructor(message = '') {
    super(message)
    this.name = new.target.name

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
