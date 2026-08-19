import Link from 'next/link'
import { ArrowLeft, Play, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ArchivePage() {
  const contributions = await prisma.contribution.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="flex-1 pb-10 bg-sandstone min-h-screen">
      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center bg-white shadow-sm sticky top-0 z-20">
        <Link href="/" className="w-10 h-10 rounded-full bg-sandstone flex items-center justify-center text-charcoal hover:bg-sandstone-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold tracking-widest text-charcoal text-sm uppercase">Living Heritage Archive</h1>
        <Globe className="text-saffron" size={24} />
      </div>

      <div className="p-6">
        <p className="text-sm text-charcoal-light mb-6">
          Explore verified cultural contributions from tourists and locals across Maharashtra.
        </p>

        <div className="space-y-4">
          {contributions.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-sandstone-dark text-charcoal-light text-sm">
              No verified contributions available yet.
            </div>
          ) : (
            contributions.map(contribution => (
              <Card key={contribution.id} className="overflow-hidden border-sandstone-dark hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-charcoal text-lg">{contribution.title}</h3>
                    <Badge variant="success">Verified</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                     <Badge variant="info" className="text-[10px] bg-sandstone text-charcoal">{contribution.language}</Badge>
                     <span className="text-xs text-charcoal-light font-semibold uppercase tracking-wider flex items-center">
                       User Contribution
                     </span>
                  </div>

                  <div className="bg-sandstone-dark/30 p-4 rounded-xl border border-sandstone-dark mb-4">
                     <p className="text-charcoal text-sm italic leading-relaxed">
                       "{contribution.transcript}"
                     </p>
                  </div>

                  <button className="flex items-center gap-2 text-xs font-bold text-saffron uppercase tracking-wider hover:text-saffron-light">
                    <span className="w-6 h-6 rounded-full bg-saffron/10 flex items-center justify-center">
                      <Play size={10} fill="currentColor" />
                    </span>
                    Listen to Original Audio
                  </button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
