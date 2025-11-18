import type { Nullable } from '../@types/utils.js'
import { assertIsDefined } from '../utils/assert.js'
import { deepmerge } from '../utils/object.js'

/**
 * デフォルトの MediaStreamConstraints のセット。
 *
 * 各キーは CameraDisplay.startByDisplayType で使用できるディスプレイ種別を表します。
 *
 * @example
 * // 利用例
 * const c = constraintsDefault.front
 *
 * @remarks
 * このオブジェクトは直接変更しないことを推奨します。必要があれば deepmerge 等でマージしてください。
 */
const constraintsDefault = {
  front: {
    audio: false,
    video: {
      facingMode: 'user',
    },
  },
  back: {
    audio: false,
    video: {
      facingMode: { exact: 'environment' },
    },
  },
  UHD: {
    audio: false,
    video: {
      width: { min: 1024, ideal: 3840, max: 3840 },
      height: { min: 576, ideal: 2160, max: 2160 },
    },
  },
  FHD: {
    audio: false,
    video: {
      width: { min: 1024, ideal: 1920, max: 1920 },
      height: { min: 576, ideal: 1080, max: 1080 },
    },
  },
  HHD: {
    audio: false,
    video: {
      width: { min: 523, ideal: 960, max: 960 },
      height: { min: 288, ideal: 540, max: 540 },
    },
  },
}

/**
 * CameraDisplay がサポートする表示プリセットのキー集合。
 *
 * constraintsDefault のキー ('front' | 'back' | 'UHD' | 'FHD' | 'HHD') のいずれかを表します。
 *
 * @remarks
 * これらのキーは CameraDisplay.startByDisplayType に直接渡してプリセット制約を適用できます。
 */
export type CameraDisplayType = keyof typeof constraintsDefault

/**
 * ビデオ要素に対してカメラの MediaStream を管理するユーティリティクラス。
 *
 * 主な責務:
 * - デバイス列挙（静的メソッド）
 * - 指定の MediaStreamConstraints によるカメラの開始／停止
 * - 現在のビデオ設定の取得
 *
 * @remarks
 * インスタンスは HTMLVideoElement を受け取り、start 系メソッドで取得した MediaStream を video.srcObject にセットして再生します。
 *
 * @example
 * const videoEl = document.querySelector('video')!
 * const cam = new CameraDisplay(videoEl)
 * await cam.startByDisplayType('front')
 * console.log(cam.getCurrentVideoSettings())
 * cam.stop()
 *
 * @public
 */
export class CameraDisplay {
  public stream: Nullable<MediaStream> = null

  constructor(public video: HTMLVideoElement) {}

  /**
   * 利用可能なビデオ入力デバイス（カメラ）の一覧を返します。
   *
   * @returns Promise が解決されると MediaDeviceInfo 配列（kind === 'videoinput' のみ）を返します。
   * @remarks
   * ブラウザの権限設定により空配列が返ることがあります。デバイス名やラベルは権限がないと空になる場合があります。
   */
  static async getVideoInputList(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const ret: MediaDeviceInfo[] = []
    for (const device of devices) {
      if (device.kind === 'videoinput') {
        ret.push(device)
      }
    }
    return ret
  }

  /**
   * 指定した MediaStreamConstraints でカメラを開始し、内部の video 要素にセットして再生します。
   *
   * @param constraints - getUserMedia に渡す制約。audio/video の指定が可能。
   * @returns カメラの映像再生が開始されると解決する Promise
   * @throws getUserMedia が失敗した場合はそのエラーをそのまま投げます（例: 権限拒否、デバイス未検出など）。
   * @remarks
   * 既にストリームが存在する場合は内部で stop() を呼び出してから新規取得を行います。
   */
  async start(constraints: MediaStreamConstraints): Promise<void> {
    this.stop()

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
    }
    catch (error) {
      console.error('Error accessing camera:', error)
      throw error
    }

    const loadVideo = (): Promise<void> => {
      this.video.srcObject = this.stream

      return new Promise((resolve) => {
        this.video.onloadedmetadata = async () => {
          await this.video.play()
          resolve()
        }
      })
    }
    await loadVideo()
  }

  /**
   * プリセット（CameraDisplayType）を元に制約をマージしてカメラを開始します。
   *
   * @param type - 使用するプリセットのキー
   * @param constraints - 既定値にマージする追加の制約（任意）。deepmerge を用いてマージされます。
   * @returns プリセットに基づくストリームが再生されると解決する Promise
   * @throws start() と同様に getUserMedia の失敗を投げます
   * @remarks
   * constraintsDefault に定義された既定値を基に、呼び出し側で渡した constraints を上書き・追加します。
   */
  async startByDisplayType(type: CameraDisplayType, constraints: MediaStreamConstraints = {}): Promise<void> {
    const o = deepmerge(constraintsDefault[type], constraints as Record<string, unknown>)
    await this.start(o)
  }

  /**
   * 開いているストリームがあればすべてのビデオトラックを停止して内部のストリーム参照をクリアします。
   *
   * @remarks
   * stop() 実行後は isStart が false になります。停止処理は同期的に行われます。
   */
  stop(): void {
    if (this.stream) {
      for (const videoTrack of this.stream.getVideoTracks()) {
        videoTrack.stop()
      }
      this.stream = null
    }
  }

  /**
   * カメラが開始されているかを返します。
   *
   * @returns ストリームが存在する場合に true、それ以外は false
   */
  get isStart(): boolean {
    return this.stream !== null
  }

  /**
   * 現在の最初のビデオトラックの MediaTrackSettings を返します。
   *
   * @returns MediaTrackSettings または null（トラックが存在しない場合）
   * @throws this.stream が未定義の場合は assertIsDefined により例外が発生します
   * @remarks
   * 返される設定は実際にカメラが確保している解像度・フレームレート等であり、要求した制約と完全に一致しない場合があります。
   */
  getCurrentVideoSettings(): Nullable<MediaTrackSettings> {
    assertIsDefined(this.stream)
    const videoTracks = this.stream.getVideoTracks()

    if (videoTracks.length > 0) {
      return videoTracks[0].getSettings()
    }
    return null
  }
}
