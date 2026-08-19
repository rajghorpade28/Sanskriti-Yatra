'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Info, Users, Sparkles, Award, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import AskSanskriti from '@/components/AskSanskriti'

interface HeritageObjectClientProps {
  objectId: string
  objectName: string
  siteName: string
  period: string
  culturalSignificance: string
  currentFootfall: number
  isHighCrowd: boolean
  observedFeatures: string[]
  paithan: { id: string; name: string } | null
}

export default function HeritageObjectClient({
  objectId,
  objectName,
  siteName,
  period,
  culturalSignificance,
  currentFootfall,
  isHighCrowd,
  observedFeatures,
  paithan,
}: HeritageObjectClientProps) {
  const [showGuide, setShowGuide] = useState(false)
  const [addedToPassport, setAddedToPassport] = useState(false)

  const handleAddToPassport = () => {
    setAddedToPassport(true)
  }

  return (
    <>
      {showGuide && (
        <AskSanskriti
          objectName={objectName}
          siteName={siteName}
          period={period}
          culturalSignificance={culturalSignificance}
          onClose={() => setShowGuide(false)}
        />
      )}

      {/* Primary Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button variant="primary" fullWidth className="gap-2 shadow-md" onClick={() => setShowGuide(true)}>
          <MessageSquare size={18} /> Ask Sanskriti AI
        </Button>

        <button
          onClick={handleAddToPassport}
          disabled={addedToPassport}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            addedToPassport
              ? 'bg-muted-green text-white border-muted-green'
              : 'bg-white text-charcoal border-sandstone-dark hover:bg-sandstone-dark'
          }`}
        >
          {addedToPassport ? (
            <>
              <CheckCircle2 size={16} /> Saved!
            </>
          ) : (
            <>
              <Award size={16} className="text-saffron" /> Add to Passport
            </>
          )}
        </button>
      </div>

      {/* Observed Visual Features */}
      {observedFeatures && observedFeatures.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-2xl border border-sandstone-dark shadow-sm">
          <p className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider mb-2">AI Visual Characteristics</p>
          <div className="flex flex-wrap gap-1.5">
            {observedFeatures.map((feature, idx) => (
              <span key={idx} className="text-[11px] bg-sandstone text-charcoal px-2.5 py-1 rounded-lg border border-sandstone-dark font-medium">
                • {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Crowd Intelligence Card */}
      {isHighCrowd && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-saffron" />
              <span className="text-xs font-bold text-charcoal uppercase tracking-wider">Crowd Intelligence</span>
            </div>
            <span className="text-[9px] bg-saffron/10 text-saffron font-bold px-2 py-0.5 rounded-full border border-saffron/20">
              Prototype Live Data
            </span>
          </div>
          <Card className="border-saffron/30 bg-saffron/5">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-sm shrink-0 border border-saffron/30">
                <span className="text-saffron font-extrabold text-xs leading-none">HIGH</span>
                <span className="text-[8px] text-charcoal-light font-mono mt-0.5">{currentFootfall}</span>
              </div>
              <div>
                <p className="text-xs text-charcoal font-bold mb-1">
                  {siteName} is experiencing high visitor volume ({currentFootfall.toLocaleString()} today).
                </p>
                <p className="text-[11px] text-charcoal-light leading-relaxed">
                  Avoid overcrowded waiting queues by exploring living cultural experiences in nearby Paithan!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Smart Heritage Recommendation */}
      {isHighCrowd && paithan && (
        <div className="mb-6 bg-gradient-to-br from-charcoal to-[#1a1a1a] p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={64} />
          </div>

          <Badge className="bg-saffron text-white border-none mb-3">Living Heritage Recommendation</Badge>
          <h3 className="text-lg font-bold mb-2">Continue your cultural journey.</h3>
          <p className="text-xs text-white/80 mb-4 leading-relaxed">
            You just explored monumental heritage at {siteName}. Discover the living artisans preserving Maharashtra's traditions.
          </p>

          <div className="bg-white/10 rounded-xl p-3 mb-4 border border-white/10">
            <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">Why this recommendation?</p>
            <p className="text-xs text-white/90 leading-relaxed">
              {siteName} is showing high visitor footfall. {paithan.name}'s 2,000-year-old Paithani weaving tradition shares the exact same peacock and lotus motifs carved here in stone.
            </p>
          </div>

          <Link href={`/living-heritage/${paithan.id}`}>
            <Button variant="primary" fullWidth className="bg-white text-charcoal hover:bg-white/90 font-bold text-xs py-2.5">
              Explore {paithan.name} Living Craft →
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
