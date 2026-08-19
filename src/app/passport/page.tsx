import Link from 'next/link'
import { ArrowLeft, Award, Image as ImageIcon, Mic, Sparkles, Scan, MapPin, Compass, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function PassportPage() {
  const user = await prisma.user.findFirst({
    where: { name: 'Demo Tourist' },
    include: {
      contributions: { orderBy: { createdAt: 'desc' } },
      scans: {
        include: { heritageObject: true, site: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      discoveries: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const contributions = user?.contributions || []
  const scans = user?.scans || []
  const discoveries = user?.discoveries || []

  const scanCount = user?.scanCount || scans.length || 0
  const sitesVisited = user?.sitesVisited || 1
  const approvedCount = contributions.filter((c) => c.status === 'APPROVED').length
  const discoveryCount = discoveries.length

  // Formula: Score = scans * 50 + sitesVisited * 100 + approvedContributions * 200 + savedPlaces * 100
  const scanScore = scanCount * 50
  const siteScore = sitesVisited * 100
  const contributionScore = approvedCount * 200
  const discoveryScore = discoveryCount * 100
  const totalScore = scanScore + siteScore + contributionScore + discoveryScore

  // Dynamic Badges logic based on real DB counts
  const badges = [
    {
      name: 'FIRST SCAN',
      earned: scanCount >= 1,
      icon: <Scan size={18} className="text-white" />,
      color: 'bg-saffron',
      desc: 'Completed first AI scan',
    },
    {
      name: 'HERITAGE EXPLORER',
      earned: sitesVisited >= 2,
      icon: <Sparkles size={18} className="text-white" />,
      color: 'bg-earth-brown',
      desc: 'Visited 2+ sites',
    },
    {
      name: 'LOCAL DISCOVERER',
      earned: discoveryCount >= 1,
      icon: <Compass size={18} className="text-white" />,
      color: 'bg-amber-600',
      desc: '1+ saved places',
    },
    {
      name: 'STORY KEEPER',
      earned: approvedCount >= 1,
      icon: <Mic size={18} className="text-white" />,
      color: 'bg-muted-green',
      desc: '1 approved oral story',
    },
  ]

  return (
    <main className="flex-1 pb-16 bg-sandstone min-h-screen">
      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center relative z-20">
        <Link href="/" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-charcoal shadow-sm border border-sandstone-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold tracking-widest text-charcoal text-xs uppercase">My Cultural Passport</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6">
        {/* Passport Identity Card */}
        <div className="bg-gradient-to-br from-charcoal to-[#1a1a1a] rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden mb-8 border border-white/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-saffron/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-muted-green/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

          <div className="flex justify-between items-start relative z-10 mb-6">
            <div>
              <p className="text-[9px] text-white/50 uppercase tracking-widest font-bold mb-1">Passport Identity</p>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-saffron font-semibold text-xs mt-0.5">{user?.level}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <span className="font-mono text-xs font-bold tracking-wider">{user?.passportId}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1 relative z-10 border-t border-white/10 pt-4 text-center">
            <div>
              <p className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-1">Scans</p>
              <p className="text-lg font-bold font-mono text-white">{scanCount}</p>
            </div>
            <div>
              <p className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-1">Sites</p>
              <p className="text-lg font-bold font-mono text-white">{sitesVisited}</p>
            </div>
            <div>
              <p className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-1">Places</p>
              <p className="text-lg font-bold font-mono text-white">{discoveryCount}</p>
            </div>
            <div>
              <p className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-1">Score</p>
              <p className="text-lg font-bold font-mono text-saffron-light flex items-center justify-center gap-0.5">
                <Award size={14} /> {totalScore}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Earned Badges */}
        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">Unlocked Badges</h3>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {badges.map((badge, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                badge.earned ? 'bg-white border-sandstone-dark shadow-sm' : 'bg-sandstone/60 border-dashed border-sandstone-dark opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${badge.earned ? badge.color : 'bg-sandstone-dark'}`}>
                {badge.earned ? badge.icon : <Award size={18} className="text-charcoal-light opacity-40" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase leading-tight text-charcoal">{badge.name}</p>
                <p className="text-[9px] text-charcoal-light mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Saved Place Discoveries */}
        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3 flex justify-between items-center">
          <span>Saved Places & Hidden Gems</span>
          <span className="text-[10px] text-saffron font-mono">{discoveries.length} Saved</span>
        </h3>
        <div className="space-y-3 mb-8">
          {discoveries.length === 0 ? (
            <div className="text-center p-6 bg-white rounded-2xl border border-dashed border-sandstone-dark text-charcoal-light text-xs">
              No places saved yet. Explore heritage objects to discover nearby quieter places!
            </div>
          ) : (
            discoveries.map((place) => (
              <Card key={place.id} className="overflow-hidden border-sandstone-dark hover:shadow-md transition-shadow">
                <CardContent className="p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-charcoal text-xs truncate">{place.name}</h4>
                    <p className="text-[10px] text-charcoal-light flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={10} /> {place.address || 'Maharashtra'}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-charcoal mt-1">
                      <span className="text-amber-600">★ {place.rating || 4.7}</span>
                      <span className="text-charcoal-light font-mono">{place.distanceKm || 2.4} km</span>
                    </div>
                  </div>
                  {place.googleMapsUri && (
                    <a
                      href={place.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-charcoal text-white flex items-center justify-center shrink-0 hover:bg-charcoal-light transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Recent Scan Discoveries */}
        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3 flex justify-between items-center">
          <span>Recent Discoveries</span>
          <span className="text-[10px] text-saffron font-mono">{scans.length} Recorded</span>
        </h3>
        <div className="space-y-3 mb-8">
          {scans.length === 0 ? (
            <div className="text-center p-6 bg-white rounded-2xl border border-dashed border-sandstone-dark text-charcoal-light text-xs">
              No scans recorded yet. Tap Scan Heritage to start!
            </div>
          ) : (
            scans.map((scan) => (
              <Card key={scan.id} className="overflow-hidden border-sandstone-dark">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-charcoal shrink-0 overflow-hidden relative">
                    <img src={scan.imageUrl || scan.heritageObject?.imageUrls || ''} className="w-full h-full object-cover" alt="Scan preview" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-charcoal text-xs truncate">{scan.heritageObject?.name || 'Heritage Object'}</h4>
                    <p className="text-[10px] text-charcoal-light truncate">{scan.site?.name || 'Ellora Caves'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded-full">
                      {Math.round(scan.confidence * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* User Contributions */}
        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">Your Contributions</h3>
        <div className="space-y-3">
          {contributions.length === 0 ? (
            <div className="text-center p-6 bg-white rounded-2xl border border-dashed border-sandstone-dark text-charcoal-light text-xs">
              No contributions submitted yet.
            </div>
          ) : (
            contributions.map((contribution) => (
              <Card key={contribution.id} className="overflow-hidden border-sandstone-dark">
                <CardContent className="p-4 flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center shrink-0 text-saffron">
                    <Mic size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-charcoal text-xs leading-tight truncate">{contribution.title}</h4>
                      <Badge
                        variant={contribution.status === 'PENDING' ? 'warning' : contribution.status === 'APPROVED' ? 'success' : 'default'}
                        className="text-[8px] py-0 px-2 shrink-0"
                      >
                        {contribution.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-charcoal-light italic line-clamp-2">"{contribution.transcript}"</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
