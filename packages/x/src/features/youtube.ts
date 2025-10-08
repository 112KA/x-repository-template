import type { Nullable } from '../@types/utils.js'
import { assertIsDefined } from '../utils/assert.js'

/**
 * @ref https://developers.google.com/youtube/iframe_api_reference?hl=ja
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

export class YoutubePlayer {
  public body: Nullable<YT.Player> = null

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

  play(vid: string) {
    assertIsDefined(this.body)
    if (vid) {
      this.body.loadVideoById(vid)
    }
    // console.log('play', vid)
    this.body.playVideo()
  }

  stop() {
    assertIsDefined(this.body)
    this.body.stopVideo()
  }
}
