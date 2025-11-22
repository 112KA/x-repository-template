/**
 * Window グローバル拡張（YouTube IFrame API 用）
 *
 * YouTube IFrame API が読み込まれた際に呼ばれるグローバルコールバックを定義します。
 * このファイルを読み込むことで、window.onYouTubeIframeAPIReady の型情報が
 * TypeScript 上で利用できるようになります。
 *
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
declare global {
  interface Window {
    /**
     * YouTube IFrame API が準備できたときに呼び出されるコールバック関数です。
     *
     * コールバックは引数を受け取らず、値を返してはいけません。ここにプレーヤーの初期化処理や
     * API 依存のセットアップ処理を記述してください。
     *
     * @example
     * window.onYouTubeIframeAPIReady = () => {
     *   // プレーヤーを作成するなどの初期化処理
     * };
     *
     * @remarks
     * このプロパティは YouTube の IFrame API により呼び出されます。型は関数 () => void です。
     */
    onYouTubeIframeAPIReady: () => void
  }
}

export {}
