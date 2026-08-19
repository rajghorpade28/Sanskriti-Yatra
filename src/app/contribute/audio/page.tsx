'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Mic, Square, Play, CheckCircle2, Loader2, FileAudio } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

function ContributeAudioContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const siteId = searchParams.get('siteId')

  const [step, setStep] = useState<'record' | 'transcribing' | 'review' | 'submitting' | 'done'>('record')
  const [isRecording, setIsRecording] = useState(false)
  const [time, setTime] = useState(0)

  // Demo generated data
  const transcript = "My family has been weaving these sarees for four generations. The parrot motif takes two weeks to perfect."
  const metadata = {
    title: "Paithani Weaving — A Family Tradition",
    category: "Traditional Craft",
    keywords: ["craft", "weaving", "family_tradition"],
    language: "Marathi (Translated to English)"
  }

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setTime(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleStopRecording = () => {
    setIsRecording(false)
    setStep('transcribing')
    
    // Simulate API calls for transcription, translation, metadata
    setTimeout(() => {
      setStep('review')
    }, 3000)
  }

  const handleSubmit = async () => {
    setStep('submitting')
    // Call our server API to submit
    try {
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          transcript,
          metadata
        })
      })
      if (res.ok) {
        setStep('done')
      } else {
        alert("Failed to submit")
        setStep('review')
      }
    } catch (e) {
      alert("Error submitting")
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
      <div className="p-6 pt-12 z-20 flex items-center gap-4 bg-white shadow-sm border-b border-sandstone-dark sticky top-0">
        <button onClick={() => router.back()} className="text-charcoal-light p-2 -ml-2 rounded-full hover:bg-sandstone-dark">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-charcoal text-lg">Record a Local Story</h1>
      </div>

      <div className="flex-1 flex flex-col p-6">
        
        {step === 'record' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-charcoal mb-2">Share your knowledge</h2>
              <p className="text-charcoal-light text-sm max-w-[250px] mx-auto">
                Share a story, memory, tradition or explanation you learned from the community.
              </p>
            </div>

            <div className="mb-12 relative flex items-center justify-center w-48 h-48">
              {isRecording && (
                <>
                  <div className="absolute inset-0 bg-saffron/10 rounded-full animate-ping"></div>
                  <div className="absolute inset-4 bg-saffron/20 rounded-full animate-pulse"></div>
                </>
              )}
              <div className="w-32 h-32 bg-charcoal rounded-full flex flex-col items-center justify-center text-white z-10 shadow-lg">
                <span className="text-3xl font-mono font-bold tracking-wider">{formatTime(time)}</span>
                {isRecording && <span className="text-saffron text-[10px] uppercase font-bold tracking-widest mt-1 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-saffron animate-pulse"></span> Recording</span>}
              </div>
            </div>

            {isRecording ? (
              <Button variant="primary" size="lg" onClick={handleStopRecording} className="gap-2 bg-charcoal hover:bg-charcoal-light">
                <Square size={18} fill="currentColor" /> Stop Recording
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={() => setIsRecording(true)} className="gap-2 shadow-md shadow-saffron/30">
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
             <h3 className="text-lg font-bold text-charcoal mb-1">Processing Audio...</h3>
             <p className="text-charcoal-light text-sm">Transcribing and extracting cultural metadata.</p>
          </div>
        )}

        {step === 'review' && (
          <div className="flex-1 flex flex-col pb-20">
            <div className="bg-saffron/10 text-saffron p-3 rounded-xl flex items-start gap-3 mb-6">
               <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
               <div className="text-sm">
                 <p className="font-bold">AI Metadata Generated</p>
                 <p className="opacity-80">Review the extracted information before submitting to the Living Heritage Archive.</p>
               </div>
            </div>

            <Card className="mb-4 shadow-sm border-saffron/20">
              <CardContent className="p-5">
                 <p className="text-[10px] font-bold text-charcoal-light uppercase tracking-widest mb-1">Title</p>
                 <h3 className="font-bold text-lg text-charcoal mb-4">{metadata.title}</h3>
                 
                 <p className="text-[10px] font-bold text-charcoal-light uppercase tracking-widest mb-1">Transcript & Translation</p>
                 <div className="bg-sandstone-dark/50 p-3 rounded-lg text-sm text-charcoal italic mb-4 border border-sandstone-dark">
                   "{transcript}"
                 </div>

                 <div className="flex flex-wrap gap-2 mb-4">
                   <Badge variant="warning">{metadata.category}</Badge>
                   <Badge variant="default">{metadata.language}</Badge>
                 </div>

                 <p className="text-[10px] font-bold text-charcoal-light uppercase tracking-widest mb-1">Audio</p>
                 <div className="flex items-center gap-3 bg-charcoal/5 p-2 rounded-lg">
                   <button className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-white shrink-0">
                     <Play size={14} fill="currentColor" />
                   </button>
                   <div className="flex-1 h-1.5 bg-sandstone-dark rounded-full overflow-hidden">
                     <div className="w-1/3 h-full bg-saffron"></div>
                   </div>
                   <span className="text-xs font-mono text-charcoal-light font-semibold">{formatTime(time)}</span>
                 </div>
              </CardContent>
            </Card>

            <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} className="mt-auto shadow-md shadow-saffron/20">
              Submit Contribution
            </Button>
          </div>
        )}

        {step === 'submitting' && (
           <div className="flex-1 flex flex-col items-center justify-center text-center">
             <Loader2 size={48} className="text-saffron animate-spin mb-4" />
             <h3 className="text-lg font-bold text-charcoal mb-1">Preserving your contribution...</h3>
          </div>
        )}

        {step === 'done' && (
           <div className="flex-1 flex flex-col items-center justify-center text-center pb-12">
             <div className="w-20 h-20 bg-muted-green/20 rounded-full flex items-center justify-center text-muted-green mb-6">
               <CheckCircle2 size={40} />
             </div>
             <h2 className="text-2xl font-bold text-charcoal mb-2">Thank You!</h2>
             <p className="text-charcoal-light text-sm mb-8 px-4">
               Your contribution is pending verification. It will soon help preserve Maharashtra's living heritage.
             </p>
             <p className="font-mono bg-white px-4 py-2 rounded-lg text-sm font-bold text-charcoal border border-sandstone-dark mb-8 shadow-sm">
               ID: SY-2026-PENDING
             </p>
             <Button variant="outline" onClick={() => router.push('/passport')}>
               View Cultural Passport
             </Button>
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
