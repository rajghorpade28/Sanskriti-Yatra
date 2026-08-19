import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mic, Image as ImageIcon, Book, UtensilsCrossed, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function LivingHeritagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const site = await prisma.site.findUnique({
    where: { id },
    include: { traditions: true }
  })

  if (!site) return notFound()

  return (
    <main className="flex-1 pb-10 bg-sandstone relative">
      {/* Header Image */}
      <div className="h-80 bg-charcoal relative rounded-b-[40px] overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Paithani_Saree_Weaving.jpg/800px-Paithani_Saree_Weaving.jpg')] bg-cover bg-center opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent"></div>
        
        <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between z-10">
          <Link href="/" className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <ArrowLeft size={20} />
          </Link>
        </div>

        <div className="absolute bottom-10 left-6 right-6 z-10">
          <p className="text-saffron font-bold tracking-widest uppercase text-xs mb-1">Living Heritage</p>
          <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
            {site.name}
          </h1>
          <p className="text-white/80 text-sm">Where heritage continues through living craft.</p>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-20">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-sandstone-dark mb-6">
          <h3 className="text-charcoal font-bold mb-2">About the Tradition</h3>
          <p className="text-charcoal-light text-sm leading-relaxed mb-4">
            {site.description}
          </p>
          
          <div className="bg-sandstone-dark/50 rounded-xl p-4">
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Featured Crafts</h4>
            {site.traditions.map(tradition => (
              <div key={tradition.id} className="mb-2 last:mb-0">
                <span className="font-semibold text-charcoal text-sm">{tradition.name}</span>
                <p className="text-xs text-charcoal-light">{tradition.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prototype Artisan Profiles */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-saffron" />
            <h3 className="text-lg font-bold text-charcoal">Local Artisans</h3>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x hide-scrollbar">
            {/* Demo Artisan 1 */}
            <Card className="snap-start shrink-0 w-64">
              <div className="h-32 bg-charcoal-light relative flex flex-col justify-end p-3">
                 <span className="text-[10px] bg-black/40 text-white px-1.5 py-0.5 rounded self-start absolute top-3 left-3 backdrop-blur-sm">Prototype Profile</span>
                 <h4 className="text-white font-bold">Ramesh Weaver</h4>
                 <p className="text-white/80 text-xs">Master Paithani Artisan</p>
              </div>
              <CardContent>
                <p className="text-xs text-charcoal-light line-clamp-3">
                  "I learned to weave the parrot motif from my grandfather. Every thread holds our family's history."
                </p>
              </CardContent>
            </Card>

             {/* Demo Artisan 2 */}
             <Card className="snap-start shrink-0 w-64">
              <div className="h-32 bg-earth-brown relative flex flex-col justify-end p-3">
                 <span className="text-[10px] bg-black/40 text-white px-1.5 py-0.5 rounded self-start absolute top-3 left-3 backdrop-blur-sm">Prototype Profile</span>
                 <h4 className="text-white font-bold">Sunita Patil</h4>
                 <p className="text-white/80 text-xs">Natural Dye Specialist</p>
              </div>
              <CardContent>
                <p className="text-xs text-charcoal-light line-clamp-3">
                  "The colors of Paithani come from nature. I forage for ingredients just as my ancestors did centuries ago."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contribution CTA section */}
        <div>
          <h3 className="text-lg font-bold text-charcoal mb-4">Help Preserve This Story</h3>
          <p className="text-sm text-charcoal-light mb-4">
            Document cultural knowledge and contribute it to a verified archive.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link href={`/contribute/audio?siteId=${site.id}`}>
              <Button variant="primary" className="h-24 flex-col gap-2 bg-saffron" fullWidth>
                <Mic size={24} />
                <span className="text-xs">Record a Story</span>
              </Button>
            </Link>
            <Button variant="secondary" className="h-24 flex-col gap-2 bg-white border border-sandstone-dark text-charcoal shadow-sm hover:bg-sandstone-dark" fullWidth>
              <ImageIcon size={24} className="text-charcoal-light" />
              <span className="text-xs font-semibold">Document Object</span>
            </Button>
            <Button variant="secondary" className="h-24 flex-col gap-2 bg-white border border-sandstone-dark text-charcoal shadow-sm hover:bg-sandstone-dark" fullWidth>
              <UtensilsCrossed size={24} className="text-charcoal-light" />
              <span className="text-xs font-semibold">Add Recipe</span>
            </Button>
            <Button variant="secondary" className="h-24 flex-col gap-2 bg-white border border-sandstone-dark text-charcoal shadow-sm hover:bg-sandstone-dark" fullWidth>
              <Book size={24} className="text-charcoal-light" />
              <span className="text-xs font-semibold">Add Memory</span>
            </Button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  )
}
