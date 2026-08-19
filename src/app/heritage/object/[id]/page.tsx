import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PrismaClient } from '@prisma/client'
import HeritageObjectClient from './HeritageObjectClient'

const prisma = new PrismaClient()

export default async function HeritageObjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const object = await prisma.heritageObject.findUnique({
    where: { id },
    include: { site: true }
  })

  if (!object) return notFound()

  const paithan = await prisma.site.findFirst({
    where: { name: 'Paithan' }
  })

  const isHighCrowd = object.site.status === 'HIGH_CROWD'

  return (
    <main className="flex-1 pb-10 bg-sandstone">
      {/* Header Image */}
      <div className="h-72 bg-charcoal relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg/800px-Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-sandstone via-transparent to-transparent"></div>

        <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between">
          <Link href="/" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-10">
        <div className="flex justify-center mb-4">
          <Badge variant="success" className="bg-muted-green text-white shadow-lg border-2 border-white text-[10px] px-3 py-1">
            ✓ OBJECT IDENTIFIED
          </Badge>
        </div>

        <h1 className="text-3xl font-bold text-charcoal text-center leading-tight mb-2">
          {object.name}
        </h1>
        <p className="text-center text-charcoal-light text-sm font-medium mb-6">
          {object.site.name} • {object.period}
        </p>

        {/* Client-side interactive parts (Ask AI + Recommendation) */}
        <HeritageObjectClient
          objectName={object.name}
          siteName={object.site.name}
          currentFootfall={object.site.currentFootfall}
          isHighCrowd={isHighCrowd}
          paithan={paithan ? { id: paithan.id, name: paithan.name } : null}
        />

        {/* Static info sections */}
        <div className="space-y-6 mt-8">
          <section>
            <h3 className="text-xs font-bold text-charcoal-light uppercase tracking-wider mb-2 border-b border-sandstone-dark pb-2">What you are seeing</h3>
            <p className="text-charcoal leading-relaxed text-sm">{object.architecturalNote}</p>
          </section>
          <section>
            <h3 className="text-xs font-bold text-charcoal-light uppercase tracking-wider mb-2 border-b border-sandstone-dark pb-2">Why it matters</h3>
            <p className="text-charcoal leading-relaxed text-sm">{object.culturalSignificance}</p>
          </section>
          <section className="bg-white p-4 rounded-xl border border-sandstone-dark">
            <h3 className="text-xs font-bold text-saffron uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin size={14} /> Respect this place
            </h3>
            <ul className="text-sm text-charcoal space-y-1.5 ml-1">
              <li>• Do not touch the ancient sculptures.</li>
              <li>• Maintain silence in the inner sanctum.</li>
              <li>• Flash photography is prohibited inside caves.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
