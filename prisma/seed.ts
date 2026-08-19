import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data for Sanskriti Yatra...')

  // Create User
  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo Tourist',
      level: 'Cultural Explorer',
      sitesVisited: 1,
      passportId: 'SY-PASS-001',
    },
  })

  // Create Sites
  const ellora = await prisma.site.create({
    data: {
      name: 'Ellora Caves',
      location: 'Chhatrapati Sambhajinagar',
      type: 'monumental',
      description: 'UNESCO World Heritage site featuring rock-cut monumental caves of Hindu, Buddhist, and Jain traditions.',
      crowdThreshold: 7500,
      currentFootfall: 8420, // HIGH_CROWD
      status: 'HIGH_CROWD',
    },
  })

  const paithan = await prisma.site.create({
    data: {
      name: 'Paithan',
      location: 'Chhatrapati Sambhajinagar area',
      type: 'living_heritage',
      description: 'Ancient city known for its living craft heritage, particularly the intricate Paithani weaving tradition.',
      crowdThreshold: 3000,
      currentFootfall: 450, // NORMAL
      status: 'NORMAL',
    },
  })

  const ajanta = await prisma.site.create({
    data: {
      name: 'Ajanta Caves',
      location: 'Chhatrapati Sambhajinagar area',
      type: 'monumental',
      description: 'Buddhist cave monuments featuring masterpiece paintings and rock-cut sculptures.',
      crowdThreshold: 5000,
      currentFootfall: 2100,
      status: 'NORMAL',
    },
  })

  // Create Traditions
  const paithaniWeaving = await prisma.tradition.create({
    data: {
      siteId: paithan.id,
      name: 'Paithani Weaving',
      category: 'craft',
      description: 'A handwoven silk saree tradition with intricate zari (gold thread) motifs, often passed down through generations of weaving families.',
    },
  })

  // Create Heritage Objects
  await prisma.heritageObject.createMany({
    data: [
      {
        siteId: ellora.id,
        name: 'Kailasa Temple',
        period: '8th Century CE (Rashtrakuta)',
        culturalSignificance: 'The largest monolithic structure in the world, carved from a single rock. Represents Mount Kailash, the abode of Lord Shiva.',
        architecturalNote: 'Dravidian architecture style, excavated from the top down.',
        relatedTraditionId: null, // Connecting this conceptually in the app UI, not directly DB
      },
      {
        siteId: ellora.id,
        name: 'Shiva Sculpture',
        period: '8th Century CE',
        culturalSignificance: 'Depicts various manifestations of Lord Shiva in Shaivite iconography.',
        architecturalNote: 'Deep bas-relief carving.',
      },
      {
        siteId: ajanta.id,
        name: 'Padmapani Bodhisattva Mural',
        period: '5th Century CE (Vakataka)',
        culturalSignificance: 'One of the most famous Buddhist paintings, depicting a Bodhisattva holding a lotus, symbolizing compassion.',
        architecturalNote: 'Fresco-secco technique on mud-plastered rock wall.',
      }
    ]
  })

  // Create a Demo Contribution (Pending)
  await prisma.contribution.create({
    data: {
      userId: demoUser.id,
      traditionId: paithaniWeaving.id,
      title: 'Grandmother\'s Paithani Loom',
      type: 'audio_story',
      audioUrl: '/demo-audio.mp3',
      transcript: 'My family has been weaving these sarees for four generations. The parrot motif takes two weeks to perfect.',
      translation: 'My family has been weaving these sarees for four generations. The parrot motif takes two weeks to perfect.',
      language: 'English',
      status: 'PENDING',
      metadata: JSON.stringify(["craft", "weaving", "family_tradition"]),
    }
  })

  console.log('Seed data created successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
