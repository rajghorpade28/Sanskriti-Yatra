import Link from 'next/link'
import { Bell, MapPin, ScanLine, Camera, ChevronRight, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Home() {
  // Fetch sites and user stats from DB
  const sites = await prisma.site.findMany({
    take: 3,
    orderBy: { type: 'desc' } // Just to get monumental then living_heritage roughly
  })
  
  const user = await prisma.user.findFirst({
    include: {
      contributions: true
    }
  })

  return (
    <main className="flex-1 pb-6">
      {/* Header */}
      <header className="flex justify-between items-center p-6 pt-12 pb-4 bg-sandstone sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-charcoal">SANSKRITI YATRA</h1>
          <p className="text-xs font-semibold tracking-widest text-charcoal-light uppercase mt-0.5">Explore. Learn. Preserve.</p>
        </div>
        <div className="flex gap-4">
          <button className="text-charcoal-light relative">
            <MapPin size={22} />
          </button>
          <button className="text-charcoal-light relative">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-saffron rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Hero / Scanner CTA */}
      <section className="px-6 py-6">
        <div className="bg-charcoal rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-muted-green/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 leading-tight">See something?<br/>Know its story.</h2>
            <p className="text-sandstone-dark mb-8 text-sm max-w-[200px]">Use your camera to understand cultural objects instantly.</p>
            
            <Link href="/scan">
              <Button variant="primary" size="lg" fullWidth className="gap-3 shadow-md shadow-saffron/30">
                <ScanLine size={20} />
                Scan Heritage
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="px-6 py-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-charcoal">Discover Maharashtra</h3>
          <Link href="/explore" className="text-saffron text-sm font-semibold flex items-center">
            See all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory hide-scrollbar">
          {sites.map(site => (
            <Link key={site.id} href={site.type === 'living_heritage' ? `/living-heritage/${site.id}` : `/heritage/${site.id}`} className="snap-start shrink-0 w-[240px]">
              <Card className="h-full">
                <div className="h-32 bg-sandstone-dark relative overflow-hidden flex items-center justify-center">
                   {/* Placeholder for actual image */}
                   <Camera size={32} className="text-charcoal/20" />
                   <div className="absolute top-3 left-3">
                     <Badge variant={site.type === 'living_heritage' ? 'warning' : 'default'}>
                       {site.type.replace('_', ' ')}
                     </Badge>
                   </div>
                </div>
                <CardContent>
                  <h4 className="font-bold text-charcoal mb-1">{site.name}</h4>
                  <p className="text-xs text-charcoal-light line-clamp-2">{site.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Cultural Passport Preview */}
      <section className="px-6 py-4">
        <h3 className="text-lg font-bold text-charcoal mb-4">Your Cultural Passport</h3>
        <Card className="bg-gradient-to-br from-sandstone to-sandstone-dark border-none">
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-xs text-charcoal-light font-semibold uppercase tracking-wider mb-1">Explorer Level</p>
              <p className="font-bold text-charcoal text-xl">{user?.level || 'Cultural Explorer'}</p>
              <div className="mt-3 flex gap-4">
                <div>
                  <p className="text-[10px] text-charcoal-light uppercase">Sites</p>
                  <p className="font-semibold text-charcoal">{user?.sitesVisited || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-charcoal-light uppercase">Contributions</p>
                  <p className="font-semibold text-charcoal">{user?.contributions.length || 0}</p>
                </div>
              </div>
            </div>
            <Link href="/passport">
              <div className="w-16 h-20 bg-saffron rounded-lg shadow-md flex items-center justify-center text-white rotate-6 hover:rotate-12 transition-transform">
                <BookOpen size={24} />
              </div>
            </Link>
          </CardContent>
        </Card>
      </section>
      
      {/* Hide scrollbar utility class */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  )
}
