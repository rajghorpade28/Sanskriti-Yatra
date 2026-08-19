import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users, FileAudio, BookOpen, AlertCircle } from 'lucide-react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const sites = await prisma.site.findMany()
  const contributions = await prisma.contribution.count()
  const pendingContributions = await prisma.contribution.count({ where: { status: 'PENDING' } })
  const traditions = await prisma.tradition.count()

  const highCrowdSites = sites.filter(s => s.status === 'HIGH_CROWD')

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">Living Heritage Intelligence</h2>
          <p className="text-charcoal-light">Overview of cultural contributions and site status.</p>
        </div>
        <Badge variant="info" className="bg-charcoal/10 text-charcoal shadow-sm">Prototype Dataset</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-t-4 border-t-saffron">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-charcoal-light uppercase tracking-wider mb-1">Contributions</p>
                <h3 className="text-3xl font-bold text-charcoal">{contributions}</h3>
              </div>
              <div className="p-3 bg-saffron/10 rounded-xl text-saffron">
                <FileAudio size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-saffron">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-charcoal-light uppercase tracking-wider mb-1">Pending Verification</p>
                <h3 className="text-3xl font-bold text-charcoal">{pendingContributions}</h3>
              </div>
              <div className="p-3 bg-saffron/10 rounded-xl text-saffron">
                <AlertCircle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-muted-green">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-charcoal-light uppercase tracking-wider mb-1">Living Traditions</p>
                <h3 className="text-3xl font-bold text-charcoal">{traditions}</h3>
              </div>
              <div className="p-3 bg-muted-green/10 rounded-xl text-muted-green">
                <BookOpen size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-charcoal">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-charcoal-light uppercase tracking-wider mb-1">Total Sites</p>
                <h3 className="text-3xl font-bold text-charcoal">{sites.length}</h3>
              </div>
              <div className="p-3 bg-charcoal/10 rounded-xl text-charcoal">
                <Users size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crowd Intelligence Section */}
      <h3 className="text-lg font-bold text-charcoal mb-4">Site Crowd Intelligence</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sites.map(site => (
          <Card key={site.id} className={site.status === 'HIGH_CROWD' ? 'border-saffron/50 bg-saffron/5' : ''}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-charcoal text-lg mb-1">{site.name}</h4>
                <p className="text-sm text-charcoal-light">Threshold: {site.crowdThreshold} • Current: <span className="font-semibold">{site.currentFootfall}</span></p>
              </div>
              <Badge variant={site.status === 'HIGH_CROWD' ? 'warning' : 'success'} className="px-3 py-1 text-sm">
                {site.status.replace('_', ' ')}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
