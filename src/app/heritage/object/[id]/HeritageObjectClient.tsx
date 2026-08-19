'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Info, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import AskSanskriti from '@/components/AskSanskriti'

interface HeritageObjectClientProps {
  objectName: string
  siteName: string
  currentFootfall: number
  isHighCrowd: boolean
  paithan: { id: string; name: string } | null
}

export default function HeritageObjectClient({
  objectName,
  siteName,
  currentFootfall,
  isHighCrowd,
  paithan
}: HeritageObjectClientProps) {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <>
      {showGuide && (
        <AskSanskriti objectName={objectName} onClose={() => setShowGuide(false)} />
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <Button variant="primary" fullWidth className="gap-2" onClick={() => setShowGuide(true)}>
          <MessageSquare size={18} /> Ask Sanskriti
        </Button>
        <Button variant="outline" className="px-4">
          <Info size={18} />
        </Button>
      </div>

      {/* Crowd Intelligence Card */}
      {isHighCrowd && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-saffron" />
            <span className="text-xs font-bold text-charcoal uppercase tracking-wider">Crowd Intelligence</span>
            <span className="text-[10px] bg-charcoal/10 text-charcoal-light px-1.5 py-0.5 rounded">Prototype Demo Data</span>
          </div>
          <Card className="border-saffron/30 bg-saffron/5">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-sm shrink-0">
                <span className="text-saffron font-bold text-sm leading-none">HIGH</span>
              </div>
              <div>
                <p className="text-sm text-charcoal font-semibold mb-1">
                  {siteName} is experiencing high footfall ({currentFootfall.toLocaleString()} visitors today).
                </p>
                <p className="text-xs text-charcoal-light">
                  Consider continuing your cultural journey through Maharashtra's living heritage traditions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendation Engine */}
      {isHighCrowd && paithan && (
        <div className="mb-8 bg-gradient-to-br from-charcoal to-[#1a1a1a] p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={64} /></div>

          <Badge className="bg-saffron text-white border-none mb-3">Recommendation</Badge>
          <h3 className="text-xl font-bold mb-2">Continue your cultural journey.</h3>
          <p className="text-sm text-white/80 mb-4">
            You just explored Maharashtra's monumental heritage. Discover its living cultural traditions.
          </p>

          <div className="bg-white/10 rounded-xl p-3 mb-4 border border-white/10">
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">Why this experience?</p>
            <p className="text-sm text-white/90">
              Explore Maharashtra's living craft heritage — the intricate Paithani weaving of {paithan.name} 
              shares the same regional cultural vocabulary as these monuments: peacocks, lotuses, and geometric patterns.
            </p>
          </div>

          <Link href={`/living-heritage/${paithan.id}`}>
            <Button variant="primary" fullWidth className="bg-white text-charcoal hover:bg-white/90 font-semibold">
              Explore {paithan.name} →
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
