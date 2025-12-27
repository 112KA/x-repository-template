/**
 * 画像をプリロードする
 * 画像の読み込み完了まで待機する
 * @param src - 画像のパス
 * @param img - 既存の HTMLImageElement（省略可、未提供の場合は自動作成）
 * @returns 読み込み完了で HTMLImageElement を resolve
 */
export function preloadImage(src: string, img?: HTMLImageElement): Promise<HTMLImageElement> {
  const target = img || document.createElement('img')
  return new Promise((resolve, reject) => {
    target.onload = () => resolve(target)
    target.onerror = e => reject(e)
    target.src = src
  })
}

/**
 * ビデオをプリロードする
 * ビデオのメタデータ読み込み完了まで待機する
 * @param src - ビデオのパス
 * @param video - 既存の HTMLVideoElement（省略可、未提供の場合は自動作成）
 * @returns メタデータ読み込み完了時にビデオ要素を resolve するPromise
 */
export function preloadVideo(src: string, video?: HTMLVideoElement): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const target = video || document.createElement('video')
    target.src = src
    target.preload = 'metadata'

    function cleanup(): void {
      target.removeEventListener('loadedmetadata', handleLoadedMetadata)
      target.removeEventListener('error', handleError)
    }

    function handleLoadedMetadata(): void {
      cleanup()
      resolve(target)
    }

    function handleError(): void {
      cleanup()
      reject(new Error(`Failed to load video: ${src}`))
    }

    target.addEventListener('loadedmetadata', handleLoadedMetadata)
    target.addEventListener('error', handleError)
  })
}

/**
 * 複数のビデオをプリロードする
 * 全ビデオのメタデータ読み込み完了まで待機する
 * @param container - ビデオ要素を追加するコンテナ要素（オプション）
 * @param sources - ビデオのパス配列
 * @returns 全ビデオ読み込み完了時に解決するPromise
 */
export async function preloadVideos(
  container: HTMLElement,
  sources: string[],
): Promise<void> {
  const videos = await Promise.all(sources.map(src => preloadVideo(src)))

  videos.forEach((video) => {
    video.style.display = 'none'
    container.appendChild(video)
  })
}

/**
 * プリロード済みビデオ要素をコンテナから取得する
 * @param container - ビデオ要素が追加されているコンテナ
 * @param src - ビデオのパス
 * @returns ビデオ要素、見つからない場合はnull
 */
export function getPreloadedVideo(
  container: HTMLElement,
  src: string,
): HTMLVideoElement | null {
  const videos = container.querySelectorAll<HTMLVideoElement>('video')
  return Array.from(videos).find(video => video.src === src) || null
}
