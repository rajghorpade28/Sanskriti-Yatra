import Link from 'next/link'
import { ArrowLeft, Award, Image as ImageIcon, Mic, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function PassportPage() {
  const user = await prisma.user.findFirst({
    where: { name: 'Demo Tourist' },
    include: { contributions: true }
  })

  const contributions = user?.contributions || []
  
  // Calculate score based on demo rules:
  // score = sitesVisited * 100 + storiesDocumented * 150
  const sitesScore = (user?.sitesVisited || 0) * 100
  const storiesScore = contributions.length * 150
  const totalScore = sitesScore + storiesScore

  // Badges logic
  const badges = [
    { name: 'HERITAGE EXPLORER', earned: true, icon: <Sparkles size={20} className="text-white" />, color: 'bg-saffron' },
    { name: 'STORY KEEPER', earned: contributions.length > 0, icon: <Mic size={20} className="text-white" />, color: 'bg-muted-green' },
    { name: 'CULTURE DOCUMENTARIAN', earned: contributions.length >= 5, icon: <ImageIcon size={20} className="text-white" />, color: 'bg-charcoal' }
  ]

  return (
    <main className="flex-1 pb-10 bg-sandstone min-h-screen">
      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center relative z-20">
        <Link href="/" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-charcoal shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold tracking-widest text-charcoal text-sm uppercase">My Sanskriti Yatra</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6">
        {/* Passport Identity Card */}
        <div className="bg-gradient-to-br from-charcoal to-[#1a1a1a] rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden mb-8">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-48 h-48 bg-saffron/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-muted-green/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
           
           <div className="flex justify-between items-start relative z-10 mb-8">
             <div>
               <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Tourist Passport</p>
               <h2 className="text-2xl font-bold">{user?.name}</h2>
               <p className="text-saffron font-medium">{user?.level}</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
               <span className="font-mono text-xs tracking-wider">{user?.passportId}</span>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4 relative z-10 border-t border-white/10 pt-4">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Sites Visited</p>
                <p className="text-2xl font-bold font-mono">{user?.sitesVisited || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Total Score</p>
                <p className="text-2xl font-bold font-mono text-saffron-light flex items-center gap-2">
                  <Award size={20} /> {totalScore}
                </p>
              </div>
           </div>
        </div>

        {/* Badges Section */}
        <h3 className="text-lg font-bold text-charcoal mb-4">Earned Badges</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {badges.map((badge, i) => (
            <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${badge.earned ? 'bg-white border-sandstone-dark shadow-sm' : 'bg-sandstone border-dashed border-sandstone-dark opacity-50'}`}>
               <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-inner ${badge.earned ? badge.color : 'bg-sandstone-dark'}`}>
                 {badge.earned ? badge.icon : null}
               </div>
               <p className="text-[9px] font-bold text-center uppercase leading-tight text-charcoal">{badge.name}</p>
            </div>
          ))}
        </div>

        {/* Contributions Timeline */}
        <h3 className="text-lg font-bold text-charcoal mb-4">Your Contributions</h3>
        <div className="space-y-4">
          {contributions.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-sandstone-dark text-charcoal-light text-sm">
              You haven't made any contributions yet. Start exploring!
            </div>
          ) : (
            contributions.map(contribution => (
              <Card key={contribution.id} className="overflow-hidden">
                <CardContent className="p-4 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center shrink-0 text-saffron">
                    <Mic size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-charcoal text-sm leading-tight">{contribution.title}</h4>
                      <Badge variant={contribution.status === 'PENDING' ? 'warning' : contribution.status === 'APPROVED' ? 'success' : 'default'} className="text-[8px] py-0">
                        {contribution.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-charcoal-light uppercase tracking-wider mb-2">{contribution.language}</p>
                    <p className="text-xs text-charcoal line-clamp-2 italic">"{contribution.transcript}"</p>
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
