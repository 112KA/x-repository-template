/**
 * ErrorConstructor のグローバル拡張
 *
 * Error オブジェクトに対してスタックトレースを生成して割り当てるための captureStackTrace を定義します。
 * Node.js の Error.captureStackTrace と同等の挙動を想定しており、第二引数を指定すると、
 * そのコンストラクタより上位のフレームは結果のスタックから除外されます。
 *
 * @see https://nodejs.org/api/errors.html#errors_error_capturestacktrace_targetobject_constructoropt
 */
declare global {
  interface ErrorConstructor {
    /**
     * 指定した Error インスタンスにスタックトレースを取得して割り当てます。
     *
     * この関数は Error オブジェクトの `stack` プロパティに生成されたスタックトレースを設定します。
     * `constructorOption` を指定すると、そのコンストラクタ関数またはオブジェクトより上位（先の）フレームは
     * 結果のスタックから除外され、内部実装の詳細を含まない見やすいトレースになります。
     * この挙動は Node.js の Error.captureStackTrace と同様です。
     *
     * @param error - スタックトレースを割り当てる Error インスタンス
     * @param constructorOption - （省略可）スタックに含める最上位フレームを示すコンストラクタ関数またはオブジェクト。
     *                            指定しない場合は全フレームが含まれます。環境により型が異なるため unknown を許容します。
     * @returns void
     */
    captureStackTrace(error: Error, constructorOption?: unknown): void
  }
}

export {}
