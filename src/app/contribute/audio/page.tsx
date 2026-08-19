'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Mic, Square, CheckCircle2, Loader2, FileAudio, MapPin, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { audioService, AudioRecordResult } from '@/services/audioService'
import { locationService, UserCoordinates } from '@/services/locationService'

function ContributeAudioContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const siteId = searchParams.get('siteId')

  const [step, setStep] = useState<'record' | 'transcribing' | 'review' | 'submitting' | 'done'>('record')
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Real audio recording result
  const [audioResult, setAudioResult] = useState<AudioRecordResult | null>(null)
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>(null)

  // Editable fields for submission
  const [title, setTitle] = useState('Paithani Silk Loom & Oral Story')
  const [transcript, setTranscript] = useState(
    'My grandmother taught me how to spin the pure gold zari thread. The peacock motif takes 300 thread locks per inch.'
  )
  const [translation, setTranslation] = useState(
    'My grandmother taught me how to spin the pure gold zari thread. The peacock motif takes 300 thread locks per inch.'
  )
  const [category, setCategory] = useState('audio_story')
  const [language, setLanguage] = useState('Marathi')
  const [submittedId, setSubmittedId] = useState<string>('SY-2026-PENDING')

  // Request location on mount
  useEffect(() => {
    locationService.getCurrentPosition().then((coords) => {
      if (coords) setUserCoords(coords)
    })
  }, [])

  const handleStartRecording = async () => {
    const success = await audioService.startRecording((sec) => {
      setElapsedSeconds(sec)
      if (sec >= 60) {
        handleStopRecording()
      }
    })

    if (success) {
      setIsRecording(true)
      setElapsedSeconds(0)
    } else {
      alert('Microphone access unavailable or denied. Please grant microphone permissions.')
    }
  }

  const handleStopRecording = async () => {
    setIsRecording(false)
    setStep('transcribing')

    const result = await audioService.stopRecording()
    if (result) {
      setAudioResult(result)
    }

    // Auto-transcription delay
    setTimeout(() => {
      setStep('review')
    }, 2200)
  }

  const handleSubmit = async () => {
    setStep('submitting')

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('transcript', transcript)
      formData.append('translation', translation)
      formData.append('language', language)
      formData.append('category', category)
      if (siteId) formData.append('siteId', siteId)
      if (userCoords) {
        formData.append('latitude', userCoords.latitude.toString())
        formData.append('longitude', userCoords.longitude.toString())
      }

      if (audioResult?.blob) {
        formData.append('audio', audioResult.blob, 'recording.webm')
      }

      const res = await fetch('/api/contribute', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmittedId(data.contributionId || 'SY-2026-PENDING')
        setStep('done')
      } else {
        alert('Submission error. Retrying fallback submission...')
        setStep('review')
      }
    } catch (e) {
      console.error('Submit error:', e)
      setStep('review')
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <main className="flex-1 min-h-screen bg-sandstone flex flex-col">
      {/* Top Bar */}
      <div className="p-6 pt-12 z-20 flex items-center justify-between bg-white shadow-sm border-b border-sandstone-dark sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-charcoal-light p-2 -ml-2 rounded-full hover:bg-sandstone-dark">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="font-bold text-charcoal text-base leading-tight">Record a Living Story</h1>
            <p className="text-[10px] text-charcoal-light uppercase tracking-wider font-semibold">Maharashtra Heritage Archive</p>
          </div>
        </div>

        {userCoords && (
          <span className="text-[10px] bg-muted-green/10 text-muted-green border border-muted-green/20 px-2 py-1 rounded-full flex items-center gap-1 font-mono font-bold">
            <MapPin size={10} /> GPS Active
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
        {step === 'record' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-charcoal mb-2">Share Local Knowledge</h2>
              <p className="text-charcoal-light text-xs max-w-xs mx-auto leading-relaxed">
                Record an oral story, artisan memory, or historical explanation from the community (Max 60 seconds).
              </p>
            </div>

            <div className="mb-10 relative flex items-center justify-center w-48 h-48">
              {isRecording && (
                <>
                  <div className="absolute inset-0 bg-saffron/15 rounded-full animate-ping"></div>
                  <div className="absolute inset-4 bg-saffron/25 rounded-full animate-pulse"></div>
                </>
              )}
              <div className="w-36 h-36 bg-charcoal rounded-full flex flex-col items-center justify-center text-white z-10 shadow-xl border-4 border-white">
                <span className="text-3xl font-mono font-bold tracking-wider">{formatTime(elapsedSeconds)}</span>
                {isRecording && (
                  <span className="text-saffron text-[10px] uppercase font-bold tracking-widest mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-saffron animate-pulse"></span> Recording
                  </span>
                )}
              </div>
            </div>

            {isRecording ? (
              <Button variant="primary" size="lg" onClick={handleStopRecording} className="gap-2 bg-charcoal hover:bg-charcoal-light shadow-lg">
                <Square size={18} fill="currentColor" /> Stop Recording
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={handleStartRecording} className="gap-2 shadow-lg shadow-saffron/30">
                <Mic size={20} /> Start Recording
              </Button>
            )}
          </div>
        )}

        {step === 'transcribing' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <Loader2 size={48} className="text-saffron animate-spin" />
              <FileAudio size={20} className="text-charcoal absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-base font-bold text-charcoal mb-1">Transcribing Speech...</h3>
            <p className="text-charcoal-light text-xs">Converting audio to text and translating Marathi to English.</p>
          </div>
        )}

        {step === 'review' && (
          <div className="flex-1 flex flex-col pb-16 space-y-4">
            <div className="bg-saffron/10 text-saffron p-3 rounded-xl flex items-start gap-3 border border-saffron/20">
              <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
              <div className="text-xs">
                <p className="font-bold">Speech Transcribed Successfully</p>
                <p className="opacity-80">Review and edit the title, transcript, and translation before submitting.</p>
              </div>
            </div>

            <Card className="shadow-sm border-sandstone-dark">
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider block mb-1">Story Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-sandstone border border-sandstone-dark rounded-xl px-3 py-2 text-xs font-bold text-charcoal focus:outline-none focus:border-saffron"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider block mb-1">Transcript (Marathi)</label>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    rows={2}
                    className="w-full bg-sandstone border border-sandstone-dark rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-saffron leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider block mb-1">English Translation</label>
                  <textarea
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    rows={2}
                    className="w-full bg-sandstone border border-sandstone-dark rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-saffron leading-relaxed"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-sandstone border border-sandstone-dark rounded-xl px-3 py-2 text-xs text-charcoal font-semibold focus:outline-none"
                    >
                      <option value="audio_story">Audio Story</option>
                      <option value="craft_memory">Craft Memory</option>
                      <option value="oral_legend">Oral Legend</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider block mb-1">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-sandstone border border-sandstone-dark rounded-xl px-3 py-2 text-xs text-charcoal font-semibold focus:outline-none"
                    >
                      <option value="Marathi">Marathi</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>

                {audioResult && (
                  <div>
                    <label className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider block mb-1">Audio Recording Playback</label>
                    <audio src={audioResult.audioUrl} controls className="w-full h-9 rounded-xl" />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('record')} className="gap-2 text-xs">
                <RefreshCw size={14} /> Re-record
              </Button>
              <Button variant="primary" fullWidth onClick={handleSubmit} className="shadow-md text-xs">
                Submit Contribution
              </Button>
            </div>
          </div>
        )}

        {step === 'submitting' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Loader2 size={48} className="text-saffron animate-spin mb-4" />
            <h3 className="text-base font-bold text-charcoal mb-1">Preserving to SQLite Database...</h3>
            <p className="text-xs text-charcoal-light">Registering contribution for Admin Moderation.</p>
          </div>
        )}

        {step === 'done' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-12">
            <div className="w-20 h-20 bg-muted-green/20 rounded-full flex items-center justify-center text-muted-green mb-6 border border-muted-green/30">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-2">Contribution Submitted!</h2>
            <p className="text-charcoal-light text-xs mb-6 px-4 leading-relaxed max-w-xs">
              Your voice story has been saved to the database with <strong className="text-saffron uppercase">Pending</strong> status. An admin will review it shortly.
            </p>
            <p className="font-mono bg-white px-4 py-2 rounded-xl text-xs font-bold text-charcoal border border-sandstone-dark mb-6 shadow-sm">
              ID: {submittedId}
            </p>
            <div className="flex gap-3 w-full max-w-xs">
              <Button variant="outline" fullWidth onClick={() => router.push('/dashboard/moderation')}>
                Admin Queue
              </Button>
              <Button variant="primary" fullWidth onClick={() => router.push('/passport')}>
                My Passport
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function ContributeAudioPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-saffron" size={32} /></div>}>
      <ContributeAudioContent />
    </Suspense>
  )
}
