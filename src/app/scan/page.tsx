'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X, Scan } from 'lucide-react'

export default function ScanPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simulate camera permission and initialization
  useEffect(() => {
    // In a real app with Capacitor, we would request camera stream here.
  }, [])

  const handleCapture = () => {
    setIsScanning(true)
    
    // Simulate processing
    let p = 0
    const interval = setInterval(() => {
      p += 20
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        // Navigate to the API which redirects to an object
        fetch('/api/scan')
          .then(res => res.json())
          .then(data => {
            if (data.objectId) {
              router.push(`/heritage/object/${data.objectId}`)
            } else {
              router.push('/heritage/site/ellora') // Fallback
            }
          })
          .catch(() => {
             // Fallback
             setIsScanning(false)
          })
      }
    }, 400)
  }

  return (
    <main className="h-screen w-full bg-black relative flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 pt-12 z-20 flex justify-between items-center text-white">
        <button onClick={() => router.back()} className="p-2 bg-black/40 rounded-full backdrop-blur-md">
          <X size={24} />
        </button>
        <div className="font-semibold tracking-wider text-sm">SCAN HERITAGE</div>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      {/* Camera Viewfinder Mock */}
      <div className="flex-1 relative">
        {/* Mock camera feed background */}
        <div className="absolute inset-0 bg-charcoal/90">
           {/* In reality, a <video> element goes here */}
           <div className="w-full h-full opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg/800px-Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg')] bg-cover bg-center"></div>
        </div>

        {/* Scanning Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-saffron rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-saffron rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-saffron rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-saffron rounded-br-3xl"></div>
            
            {isScanning && (
              <div 
                className="absolute left-0 right-0 h-1 bg-saffron shadow-[0_0_15px_rgba(232,107,50,0.8)] transition-all duration-300 ease-linear"
                style={{ top: `${progress}%` }}
              ></div>
            )}
          </div>
        </div>

        {/* Instruction */}
        {!isScanning && (
          <div className="absolute bottom-32 left-0 right-0 text-center px-8 z-20">
            <p className="text-white text-sm font-medium drop-shadow-md bg-black/40 p-3 rounded-xl backdrop-blur-md inline-block">
              Point your camera at a carving, sculpture, or architectural element.
            </p>
          </div>
        )}

        {/* Scanning State */}
        {isScanning && (
          <div className="absolute bottom-32 left-0 right-0 text-center px-8 z-20 flex flex-col items-center">
             <div className="bg-black/60 p-4 rounded-2xl backdrop-blur-md flex flex-col items-center border border-white/10">
               <Scan className="text-saffron animate-pulse mb-2" size={32} />
               <p className="text-white text-sm font-semibold">Understanding this heritage...</p>
             </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="h-32 bg-black flex items-center justify-center pb-6 z-20">
        <button 
          onClick={handleCapture}
          disabled={isScanning}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center overflow-hidden disabled:opacity-50 transition-opacity focus:outline-none"
        >
          <div className="w-12 h-12 bg-white rounded-full transition-transform active:scale-90"></div>
        </button>
      </div>
    </main>
  )
}
