import type { Nullable } from '../@types/utils.js'
import { assertIsDefined } from '../utils/assert.js'
import { deepmerge } from '../utils/object.js'

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

export type CameraDisplayType = keyof typeof constraintsDefault

export class CameraDisplay {
  public stream: Nullable<MediaStream> = null

  constructor(public video: HTMLVideoElement) {}

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

  async startByDisplayType(type: CameraDisplayType, constraints: MediaStreamConstraints = {}): Promise<void> {
    const o = deepmerge(constraintsDefault[type], constraints as Record<string, unknown>)
    await this.start(o)
  }

  stop(): void {
    if (this.stream) {
      for (const videoTrack of this.stream.getVideoTracks()) {
        videoTrack.stop()
      }
      this.stream = null
    }
  }

  get isStart() {
    return this.stream !== null
  }

  getCurrentVideoSettings(): Nullable<MediaTrackSettings> {
    assertIsDefined(this.stream)
    const videoTracks = this.stream.getVideoTracks()

    if (videoTracks.length > 0) {
      return videoTracks[0].getSettings()
    }
    return null
  }
}
