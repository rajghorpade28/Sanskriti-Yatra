import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PrismaClient } from '@prisma/client'
import HeritageObjectClient from './HeritageObjectClient'

const prisma = new PrismaClient()

export default async function HeritageObjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const object = await prisma.heritageObject.findUnique({
    where: { id },
    include: { site: true },
  })

  if (!object) return notFound()

  const paithan = await prisma.site.findFirst({
    where: { name: 'Paithan' },
  })

  const isHighCrowd = object.site.status === 'HIGH_CROWD'
  const confidencePct = Math.round((object.confidence || 0.95) * 100)
  const observedFeatures: string[] = object.observedFeatures ? JSON.parse(object.observedFeatures) : []
  const imageUrls: string[] = object.imageUrls ? JSON.parse(object.imageUrls) : []
  const heroImage = imageUrls[0] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg/800px-Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg'

  return (
    <main className="flex-1 pb-16 bg-sandstone min-h-screen">
      {/* Header Image Hero */}
      <div className="h-72 bg-charcoal relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{ backgroundImage: `url('${heroImage}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-sandstone via-transparent to-black/40"></div>

        <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between z-20">
          <Link href="/" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-10">
        {/* Identified Badge + Confidence */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <Badge variant="success" className="bg-muted-green text-white shadow-md border border-white/40 text-[10px] px-3 py-1 flex items-center gap-1">
            <CheckCircle size={12} /> OBJECT IDENTIFIED
          </Badge>
          <span className="bg-charcoal text-saffron text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-sm border border-saffron/30">
            {confidencePct}% Confidence
          </span>
        </div>

        <h1 className="text-2xl font-bold text-charcoal text-center leading-tight mb-1">
          {object.name}
        </h1>
        <p className="text-center text-charcoal-light text-xs font-semibold mb-6">
          {object.site.name} • {object.period}
        </p>

        {/* Client Interactive Section */}
        <HeritageObjectClient
          objectId={object.id}
          objectName={object.name}
          siteName={object.site.name}
          period={object.period}
          culturalSignificance={object.culturalSignificance}
          currentFootfall={object.site.currentFootfall}
          isHighCrowd={isHighCrowd}
          observedFeatures={observedFeatures}
          paithan={paithan ? { id: paithan.id, name: paithan.name } : null}
        />

        {/* Content Details */}
        <div className="space-y-6 mt-6">
          <section className="bg-white p-5 rounded-2xl border border-sandstone-dark shadow-sm">
            <h3 className="text-xs font-bold text-charcoal-light uppercase tracking-wider mb-2 border-b border-sandstone-dark pb-2">
              What You Are Seeing
            </h3>
            <p className="text-charcoal leading-relaxed text-xs">{object.architecturalNote}</p>
          </section>

          <section className="bg-white p-5 rounded-2xl border border-sandstone-dark shadow-sm">
            <h3 className="text-xs font-bold text-charcoal-light uppercase tracking-wider mb-2 border-b border-sandstone-dark pb-2">
              Why It Matters
            </h3>
            <p className="text-charcoal leading-relaxed text-xs">{object.culturalSignificance}</p>
          </section>

          {object.historicalContext && (
            <section className="bg-white p-5 rounded-2xl border border-sandstone-dark shadow-sm">
              <h3 className="text-xs font-bold text-charcoal-light uppercase tracking-wider mb-2 border-b border-sandstone-dark pb-2">
                Historical Context
              </h3>
              <p className="text-charcoal leading-relaxed text-xs">{object.historicalContext}</p>
            </section>
          )}

          <section className="bg-saffron/5 p-5 rounded-2xl border border-saffron/20 shadow-sm">
            <h3 className="text-xs font-bold text-saffron uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin size={14} /> Sacred Site Etiquette
            </h3>
            <ul className="text-xs text-charcoal space-y-1.5 ml-1">
              <li>• Do not touch ancient sculptures or mural pigments.</li>
              <li>• Maintain quiet reverence inside cave sanctuaries.</li>
              <li>• Flash photography is prohibited inside painted caves.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
