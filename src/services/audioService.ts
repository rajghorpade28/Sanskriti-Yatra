export interface AudioRecordResult {
  blob: Blob
  audioUrl: string
  durationSeconds: number
}

export class AudioService {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private startTime: number = 0
  private timerInterval: NodeJS.Timeout | null = null

  async isSupported(): Promise<boolean> {
    return typeof window !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function' && 'MediaRecorder' in window
  }

  async startRecording(onTick?: (elapsedSeconds: number) => void): Promise<boolean> {
    try {
      this.audioChunks = []
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const options = MediaRecorder.isTypeSupported('audio/webm') 
        ? { mimeType: 'audio/webm' } 
        : MediaRecorder.isTypeSupported('audio/mp4') 
        ? { mimeType: 'audio/mp4' } 
        : undefined

      this.mediaRecorder = new MediaRecorder(stream, options)

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.start(100)
      this.startTime = Date.now()

      if (onTick) {
        this.timerInterval = setInterval(() => {
          const elapsed = Math.floor((Date.now() - this.startTime) / 1000)
          onTick(elapsed)
        }, 500)
      }

      return true
    } catch (err) {
      console.warn('AudioService: Failed to access microphone', err)
      return false
    }
  }

  async stopRecording(): Promise<AudioRecordResult | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        if (this.timerInterval) clearInterval(this.timerInterval)
        return resolve(null)
      }

      if (this.timerInterval) clearInterval(this.timerInterval)

      const durationSeconds = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000))

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm'
        const blob = new Blob(this.audioChunks, { type: mimeType })
        const audioUrl = URL.createObjectURL(blob)

        // Stop stream tracks
        if (this.mediaRecorder && this.mediaRecorder.stream) {
          this.mediaRecorder.stream.getTracks().forEach((track) => track.stop())
        }

        this.mediaRecorder = null
        this.audioChunks = []

        resolve({
          blob,
          audioUrl,
          durationSeconds,
        })
      }

      this.mediaRecorder.stop()
    })
  }

  cancelRecording(): void {
    if (this.timerInterval) clearInterval(this.timerInterval)
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
      if (this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      }
    }
    this.mediaRecorder = null
    this.audioChunks = []
  }
}

export const audioService = new AudioService()
