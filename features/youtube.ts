import type { Nullable } from '../@types/utils.js'
import { assertIsDefined } from '../utils/assert.js'

/**
 * YouTube IFrame API を読み込み、API 利用可能になったら解決する Promise を返す。
 *
 * @returns API が利用可能になったときに解決する Promise<void>
 */
export function setupYoutube(): Promise<void> {
  const tag = document.createElement('script')

  tag.src = 'https://www.youtube.com/iframe_api'
  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

  return new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => {
      // console.log('onYouTubeIframeAPIReady')
      resolve()
    }
  })
}

/**
 * ラップされた YouTube プレイヤー操作クラス。
 *
 * body が YT.Player として生成され、create/play/stop メソッドで操作する。
 */
export class YoutubePlayer {
  /**
   * 内部の YT.Player インスタンス（生成前は null）。
   */
  public body: Nullable<YT.Player> = null

  /**
   * 指定した要素 ID に対してプレイヤーを作成する。
   *
   * @param playerId - プレイヤーを配置する要素の ID
   * @param videoId - 初期再生する動画 ID（デフォルト M7lc1UVf-VE）
   * @param width - プレイヤー幅
   * @param height - プレイヤー高さ
   * @returns プレイヤー生成が完了したら解決する Promise<void>
   */
  create(playerId: string, videoId = 'M7lc1UVf-VE', width = 640, height = 360): Promise<void> {
    return new Promise((resolve: () => void) => {
      this.body = new YT.Player(playerId, {
        height,
        width,
        videoId,
        events: {
          onReady: () => {
            resolve()
          },
          //   onStateChange: onPlayerStateChange,
        },
      })
    })
  }

  /**
   * 動画を再生する。vid が指定されればその動画を読み込んで再生する。
   *
   * @param vid - 再生する動画の ID（省略時は現在のまま再生）
   */
  play(vid: string): void {
    assertIsDefined(this.body)
    if (vid) {
      this.body.loadVideoById(vid)
    }
    // console.log('play', vid)
    this.body.playVideo()
  }

  /**
   * 再生を停止する。
   */
  stop(): void {
    assertIsDefined(this.body)
    this.body.stopVideo()
  }
}
