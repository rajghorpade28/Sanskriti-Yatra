import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function HeritageSitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const site = await prisma.site.findUnique({
    where: { id },
    include: { objects: true, traditions: true }
  })

  if (!site) return notFound()

  return (
    <main className="flex-1 pb-10 bg-sandstone min-h-screen">
      {/* Header */}
      <div className="h-64 bg-charcoal relative rounded-b-3xl overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-70 bg-cover bg-center" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg/800px-Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between z-10">
          <Link href="/" className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <ArrowLeft size={20} />
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 z-10">
          <Badge variant={site.status === 'HIGH_CROWD' ? 'warning' : 'success'} className="mb-2">
            {site.status.replace('_', ' ')}
          </Badge>
          <h1 className="text-3xl font-bold text-white">{site.name}</h1>
          <p className="text-white/80 text-sm">{site.location}</p>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        <p className="text-charcoal-light text-sm leading-relaxed">{site.description}</p>

        {/* Objects at this site */}
        {site.objects.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-charcoal mb-4">Heritage Objects to Discover</h3>
            <div className="space-y-3">
              {site.objects.map(obj => (
                <Link key={obj.id} href={`/heritage/object/${obj.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex gap-4 items-center">
                      <div className="w-12 h-12 bg-sandstone-dark rounded-xl flex items-center justify-center shrink-0">
                        <Camera size={20} className="text-charcoal-light" />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal text-sm">{obj.name}</h4>
                        <p className="text-xs text-charcoal-light">{obj.period}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Scan CTA */}
        <Link href="/scan">
          <Button variant="primary" size="lg" fullWidth className="shadow-md shadow-saffron/20">
            Scan an Object Here
          </Button>
        </Link>
      </div>
    </main>
  )
}
