'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Compass, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface SiteItem {
  id: string
  name: string
  location: string
  type: string
  description: string
  currentFootfall: number
  status: string
}

interface ExploreClientProps {
  sites: SiteItem[]
}

export default function ExploreClient({ sites }: ExploreClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MONUMENTS' | 'LIVING CRAFT'>('ALL')

  const filteredSites = sites.filter((site) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      (activeCategory === 'MONUMENTS' && site.type === 'monumental') ||
      (activeCategory === 'LIVING CRAFT' && site.type === 'living_heritage')

    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      site.name.toLowerCase().includes(q) ||
      site.location.toLowerCase().includes(q) ||
      site.description.toLowerCase().includes(q)

    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Search & Filter Header */}
      <div className="p-6 pt-12 pb-4 bg-white shadow-sm sticky top-0 z-20">
        <h1 className="font-bold tracking-widest text-charcoal text-xs uppercase mb-3 flex items-center gap-2">
          <Compass size={18} className="text-saffron" /> Explore Maharashtra Heritage
        </h1>

        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ellora, Ajanta, Paithani, crafts..."
            className="w-full bg-sandstone text-charcoal pl-9 pr-4 py-2.5 rounded-xl border border-sandstone-dark focus:outline-none focus:border-saffron text-xs font-medium"
          />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-light" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'ALL' ? 'bg-charcoal text-white shadow-sm' : 'bg-sandstone text-charcoal-light border border-sandstone-dark'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setActiveCategory('MONUMENTS')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'MONUMENTS' ? 'bg-charcoal text-white shadow-sm' : 'bg-sandstone text-charcoal-light border border-sandstone-dark'
            }`}
          >
            MONUMENTS
          </button>
          <button
            onClick={() => setActiveCategory('LIVING CRAFT')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'LIVING CRAFT' ? 'bg-charcoal text-white shadow-sm' : 'bg-sandstone text-charcoal-light border border-sandstone-dark'
            }`}
          >
            LIVING CRAFT
          </button>
        </div>
      </div>

      {/* Sites List */}
      <div className="p-6 space-y-4">
        {filteredSites.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-sandstone-dark text-charcoal-light text-xs">
            No heritage sites found matching "{searchQuery}".
          </div>
        ) : (
          filteredSites.map((site) => (
            <Link key={site.id} href={site.type === 'living_heritage' ? `/living-heritage/${site.id}` : `/heritage/${site.id}`} className="block">
              <Card className="flex flex-row overflow-hidden border-sandstone-dark hover:shadow-md transition-shadow">
                <div className="w-24 bg-charcoal shrink-0 relative flex flex-col items-center justify-center p-2 text-center">
                  {site.type === 'living_heritage' ? (
                    <Sparkles size={20} className="text-saffron mb-1" />
                  ) : (
                    <span className="text-[10px] text-white/50 uppercase font-bold text-center leading-tight">Rock<br />Cut</span>
                  )}
                  <span className="text-[9px] text-white/60 font-bold uppercase mt-1">
                    {site.type === 'living_heritage' ? 'Living Craft' : 'Monolith'}
                  </span>
                </div>

                <CardContent className="p-4 flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-charcoal text-sm truncate">{site.name}</h3>
                    <Badge variant={site.type === 'living_heritage' ? 'warning' : 'default'} className="text-[8px] px-1.5 py-0 shrink-0">
                      {site.type === 'living_heritage' ? 'CRAFT' : 'HERITAGE'}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-charcoal-light flex items-center gap-1 mb-2">
                    <MapPin size={10} /> {site.location}
                  </p>
                  <p className="text-xs text-charcoal line-clamp-2 leading-relaxed">
                    {site.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </>
  )
}
