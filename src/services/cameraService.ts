export interface CameraCaptureResult {
  blob: Blob
  dataUrl: string
  width: number
  height: number
}

export class CameraService {
  private stream: MediaStream | null = null

  async isSupported(): Promise<boolean> {
    return typeof window !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function'
  }

  async startCamera(videoElement: HTMLVideoElement, facingMode: 'environment' | 'user' = 'environment'): Promise<boolean> {
    try {
      this.stopCamera()
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
      videoElement.srcObject = this.stream
      await videoElement.play()
      return true
    } catch (err) {
      console.warn('CameraService: getUserMedia failed or rejected', err)
      return false
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
  }

  captureFrame(videoElement: HTMLVideoElement): CameraCaptureResult | null {
    if (!videoElement || videoElement.videoWidth === 0) return null

    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)

    // Convert dataUrl to Blob
    const byteString = atob(dataUrl.split(',')[1])
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([ab], { type: mimeString })

    return {
      blob,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    }
  }
}

export const cameraService = new CameraService()
