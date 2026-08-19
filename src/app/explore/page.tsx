import { PrismaClient } from '@prisma/client'
import ExploreClient from './ExploreClient'

const prisma = new PrismaClient()

export default async function ExplorePage() {
  const sites = await prisma.site.findMany({
    orderBy: { type: 'desc' },
  })

  return (
    <main className="flex-1 pb-10 bg-sandstone min-h-screen">
      <ExploreClient sites={sites} />
    </main>
  )
}
