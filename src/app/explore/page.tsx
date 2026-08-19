import Link from 'next/link'
import { Search, MapPin, Compass } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ExplorePage() {
  const sites = await prisma.site.findMany()

  return (
    <main className="flex-1 pb-10 bg-sandstone min-h-screen">
      {/* Header */}
      <div className="p-6 pt-12 pb-4 bg-white shadow-sm sticky top-0 z-20">
        <h1 className="font-bold tracking-widest text-charcoal text-sm uppercase mb-4 flex items-center gap-2">
          <Compass size={18} className="text-saffron" /> Explore Maharashtra
        </h1>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search heritage sites, crafts, stories..." 
            className="w-full bg-sandstone-dark text-charcoal px-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-light" />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 hide-scrollbar -mx-6 px-6">
          <Badge variant="default" className="bg-charcoal text-white py-1">ALL</Badge>
          <Badge variant="default" className="bg-sandstone-dark py-1">MONUMENTS</Badge>
          <Badge variant="default" className="bg-sandstone-dark py-1">LIVING CRAFT</Badge>
          <Badge variant="default" className="bg-sandstone-dark py-1">STORIES</Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {sites.map(site => (
          <Link key={site.id} href={site.type === 'living_heritage' ? `/living-heritage/${site.id}` : `/heritage/${site.id}`} className="block">
            <Card className="flex flex-row overflow-hidden hover:shadow-md transition-shadow">
              <div className="w-24 bg-charcoal shrink-0 relative flex items-center justify-center">
                 <div className="absolute inset-0 bg-white/10"></div>
                 {site.type === 'living_heritage' ? (
                   <span className="text-[10px] text-white/50 uppercase font-bold text-center leading-tight">Living<br/>Craft</span>
                 ) : (
                   <span className="text-[10px] text-white/50 uppercase font-bold text-center leading-tight">Rock<br/>Cut</span>
                 )}
              </div>
              <CardContent className="p-4 flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-charcoal text-sm">{site.name}</h3>
                  <Badge variant={site.type === 'living_heritage' ? 'warning' : 'default'} className="text-[8px] px-1.5 py-0">
                    {site.type === 'living_heritage' ? 'CRAFT' : 'HERITAGE'}
                  </Badge>
                </div>
                <p className="text-xs text-charcoal-light flex items-center gap-1 mb-2">
                  <MapPin size={10} /> {site.location}
                </p>
                <p className="text-xs text-charcoal line-clamp-2">
                  {site.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  )
}
