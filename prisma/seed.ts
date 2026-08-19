import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding rich Maharashtra demo dataset for Sanskriti Yatra...')

  // Clear existing records to ensure clean seed
  await prisma.passportActivity.deleteMany()
  await prisma.placeDiscovery.deleteMany()
  await prisma.scanHistory.deleteMany()
  await prisma.contribution.deleteMany()
  await prisma.crowdSnapshot.deleteMany()
  await prisma.heritageObject.deleteMany()
  await prisma.tradition.deleteMany()
  await prisma.site.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Demo User
  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo Tourist',
      level: 'Heritage Explorer',
      sitesVisited: 2,
      scanCount: 3,
      passportId: 'SY-PASS-2026',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
  })

  // 2. Create Sites
  const ellora = await prisma.site.create({
    data: {
      name: 'Ellora Caves',
      location: 'Chhatrapati Sambhajinagar, Maharashtra',
      type: 'monumental',
      description: 'UNESCO World Heritage site featuring 34 major rock-cut monolithic temples and monasteries carved out of Charanandri Hills, spanning Hindu, Buddhist, and Jain traditions.',
      crowdThreshold: 7500,
      currentFootfall: 8420, // HIGH_CROWD
      status: 'HIGH_CROWD',
    },
  })

  const ajanta = await prisma.site.create({
    data: {
      name: 'Ajanta Caves',
      location: 'Sohagpur, Chhatrapati Sambhajinagar District, Maharashtra',
      type: 'monumental',
      description: 'UNESCO World Heritage site comprising 30 rock-cut Buddhist cave monuments dating from 2nd century BCE to 480 CE, world-renowned for ancient mural wall paintings.',
      crowdThreshold: 5000,
      currentFootfall: 2100, // NORMAL
      status: 'NORMAL',
    },
  })

  const paithan = await prisma.site.create({
    data: {
      name: 'Paithan',
      location: 'Paithan, Chhatrapati Sambhajinagar District, Maharashtra',
      type: 'living_heritage',
      description: 'Historic capital city of the Satavahana Empire, world-famous for its 2000-year-old living heritage of handwoven silk Paithani sarees and gold thread zari crafts.',
      crowdThreshold: 3000,
      currentFootfall: 450, // NORMAL
      status: 'NORMAL',
    },
  })

  // 3. Create Traditions
  const paithaniWeaving = await prisma.tradition.create({
    data: {
      siteId: paithan.id,
      name: 'Paithani Handloom Weaving',
      category: 'craft',
      description: 'A 2000-year-old living handloom tradition producing silk sarees decorated with pure gold/silver zari borders and iconic peacock (Mor), parrot (Popat), and lotus (Kamal) motifs.',
      artisanInfo: 'Practiced by over 300 traditional weaving families in Paithan village. Master craftsmen spend up to 6 months per handwoven tapestry.',
    },
  })

  const rockCutCraft = await prisma.tradition.create({
    data: {
      siteId: ellora.id,
      name: 'Top-Down Monolithic Excavation',
      category: 'architecture',
      description: 'Ancient stone-carving mastery where artisans excavated 200,000 tons of solid basalt rock from top to bottom using only hammer and chisel without scaffolding.',
      artisanInfo: 'Preserved in local stone carving guilds and heritage restoration specialists in Maharashtra.',
    },
  })

  const muralPainting = await prisma.tradition.create({
    data: {
      siteId: ajanta.id,
      name: 'Ajanta Natural Pigment Fresco',
      category: 'art',
      description: 'Technique of wall mural painting using natural earth pigments (clay, yellow ochre, lapis lazuli, red oxide) mixed with animal glue applied on mud-plastered rock walls.',
      artisanInfo: 'Modern pigment preservation artists in Aurangabad region preserve these ancient recipes.',
    },
  })

  // 4. Create 12 Heritage Objects
  const objects = [
    {
      siteId: ellora.id,
      name: 'Kailasa Temple (Cave 16)',
      category: 'architecture',
      period: '8th Century CE (Rashtrakuta Dynasty)',
      culturalSignificance: 'The world\'s largest monolithic rock-cut structure, carved top-to-bottom out of a single volcanic basalt cliff, symbolizing Lord Shiva\'s abode at Mount Kailash.',
      architecturalNote: 'Features a 3-storey courtyard, freestanding monolithic pillars, life-sized elephant statues, and extensive relief panels.',
      historicalContext: 'Commissioned by King Krishna I of the Rashtrakuta dynasty. Over 200,000 tons of rock were removed over 18 years.',
      observedFeatures: JSON.stringify(['Monolithic shrine', 'Basalt excavation', 'Elephant frieze', 'Dravidian shikhara tower', 'Dhvajastambha pillar']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg/800px-Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg']),
      keywords: JSON.stringify(['kailasa', 'temple', 'ellora', 'cave 16', 'monolith', 'rashtrakuta', 'shiva']),
      confidence: 0.96,
      relatedTraditionId: rockCutCraft.id,
    },
    {
      siteId: ellora.id,
      name: 'Ravana Shaking Mount Kailash Sculpture',
      category: 'sculpture',
      period: '8th Century CE',
      culturalSignificance: 'Masterpiece bas-relief panel depicting the demon king Ravana attempting to lift Mount Kailash while Shiva serenely presses his toe to anchor the mountain.',
      architecturalNote: 'Dynamic multi-layered relief sculpture showcasing dramatic depth, emotion, and fluid human forms.',
      historicalContext: 'Located in the lower southern gallery of Cave 16 at Ellora, considered an pinnacle of Indian rock-cut sculptural art.',
      observedFeatures: JSON.stringify(['Multi-armed figure', 'Bas-relief rock panel', 'Demon king iconography', 'Shiva Parvati figures']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Ravana_shaking_Mount_Kailasa%2C_Cave_16%2C_Ellora.jpg/800px-Ravana_shaking_Mount_Kailasa%2C_Cave_16%2C_Ellora.jpg']),
      keywords: JSON.stringify(['ravana', 'kailash', 'sculpture', 'ellora', 'relief', 'shiva']),
      confidence: 0.91,
      relatedTraditionId: rockCutCraft.id,
    },
    {
      siteId: ellora.id,
      name: 'Buddhist Chaitya Hall & Buddha (Cave 10)',
      category: 'sculpture',
      period: '650–700 CE',
      culturalSignificance: 'Known as "Vishvakarma Cave" or Carpenter\'s Cave, featuring a vaulted cathedral-like roof with carved wooden-rib imitation and a giant seated Buddha at the stupa.',
      architecturalNote: 'Rock-cut ribs mimicking wooden cathedral beams, central stupa with colossal 15ft Buddha in teaching gesture (Dharmachakra Pravartana Mudra).',
      historicalContext: 'The principal Buddhist worship hall at Ellora, dedicated to Lord Buddha and the celestial artisan deity Vishvakarma.',
      observedFeatures: JSON.stringify(['Vaulted chaitya ceiling', 'Seated Buddha figure', 'Stupa shrine', 'Ribbed ceiling beams']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ellora_Cave_10_01.jpg/800px-Ellora_Cave_10_01.jpg']),
      keywords: JSON.stringify(['buddha', 'cave 10', 'vishvakarma', 'chaitya', 'ellora', 'stupa']),
      confidence: 0.89,
      relatedTraditionId: rockCutCraft.id,
    },
    {
      siteId: ellora.id,
      name: 'Jain Tirthankara Icon (Cave 32)',
      category: 'sculpture',
      period: '9th Century CE (Yadava Period)',
      culturalSignificance: 'Known as "Indra Sabha", featuring serene seated figures of Lord Mahavira and Matanga on an elephant, showcasing delicate Jain aesthetic refinement.',
      architecturalNote: 'Two-story elaborate temple with lotus carved ceilings, ornate pillars, and polished stone finish.',
      historicalContext: 'Represents the final flourish of rock-cut architecture at Ellora under Jain patronage.',
      observedFeatures: JSON.stringify(['Seated Tirthankara', 'Ambika goddess motif', 'Indra on elephant', 'Ornate floral pillars']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Ellora_cave32_01.jpg/800px-Ellora_cave32_01.jpg']),
      keywords: JSON.stringify(['jain', 'tirthankara', 'mahavira', 'cave 32', 'indra sabha', 'ellora']),
      confidence: 0.88,
      relatedTraditionId: rockCutCraft.id,
    },
    {
      siteId: ajanta.id,
      name: 'Padmapani Bodhisattva Mural (Cave 1)',
      category: 'mural',
      period: '5th Century CE (Vakataka Dynasty)',
      culturalSignificance: 'Masterpiece of ancient Indian painting, representing Bodhisattva Avalokiteshvara holding a blue lotus lotus, personifying universal compassion.',
      architecturalNote: 'Fresco-secco technique with delicate three-dimensional shading (chiaroscuro effect) using natural lapis lazuli and ochre pigments.',
      historicalContext: 'Painted under the patronage of Vakataka King Harishena; recognized worldwide as an icon of Indian classical art.',
      observedFeatures: JSON.stringify(['Blue lotus flower', 'Crown ornament', 'Gentle downcast eyes', 'Fresco pigment', 'Avalokiteshvara figure']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Bodhisattva_Padmapani_Cave_1_Ajanta.jpg/800px-Bodhisattva_Padmapani_Cave_1_Ajanta.jpg']),
      keywords: JSON.stringify(['padmapani', 'bodhisattva', 'mural', 'ajanta', 'cave 1', 'lotus', 'painting']),
      confidence: 0.97,
      relatedTraditionId: muralPainting.id,
    },
    {
      siteId: paithan.id,
      name: 'Paithani Peacock Silk Saree Tapestry',
      category: 'textile',
      period: 'Living Tradition (Satavahana origin to modern)',
      culturalSignificance: 'The "Queen of Silks", featuring pure gold zari thread woven with mulberry silk to create iridescent peacock (Mor) and parrot (Popat) pallu borders.',
      architecturalNote: 'Double-tapestry handloom weaving technique where front and back designs look identical.',
      historicalContext: 'Exported to ancient Rome and Greece in Satavahana times (200 BCE) in exchange for gold coins.',
      observedFeatures: JSON.stringify(['Gold zari thread', 'Peacock pallu motif', 'Pure silk texture', 'Iridescent weave', 'Mor-popat pattern']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Paithani_Saree_Border.jpg/800px-Paithani_Saree_Border.jpg']),
      keywords: JSON.stringify(['paithani', 'saree', 'silk', 'peacock', 'zari', 'paithan', 'textile', 'weaving']),
      confidence: 0.95,
      relatedTraditionId: paithaniWeaving.id,
    },
  ]

  for (const obj of objects) {
    await prisma.heritageObject.create({ data: obj })
  }

  // 5. Create Crowd Snapshots
  const now = new Date()
  const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
  for (const h of hours) {
    const timestamp = new Date(now.valueOf() - (24 - h) * 60 * 60 * 1000)
    const elloraCount = h >= 10 && h <= 16 ? 8420 + Math.floor(Math.random() * 500) : 3200
    await prisma.crowdSnapshot.create({
      data: {
        siteId: ellora.id,
        timestamp,
        visitorCount: elloraCount,
        threshold: 7500,
        status: elloraCount > 7500 ? 'HIGH_CROWD' : 'NORMAL',
      }
    })
  }

  // 6. Create Seed Contributions
  await prisma.contribution.create({
    data: {
      userId: demoUser.id,
      siteId: paithan.id,
      traditionId: paithaniWeaving.id,
      title: 'Four Generations of Peacock Weaving',
      type: 'audio_story',
      audioUrl: '/demo-audio.mp3',
      transcript: 'My great-grandmother taught my mother how to spin the gold zari thread. The peacock pallu requires 300 individual thread locks on the loom per inch.',
      translation: 'My great-grandmother taught my mother how to spin the gold zari thread. The peacock pallu requires 300 individual thread locks on the loom per inch.',
      originalLanguage: 'mr',
      targetLanguage: 'en',
      language: 'Marathi',
      status: 'APPROVED',
      latitude: 19.4784,
      longitude: 75.3792,
    }
  })

  // 7. Create Seed Saved Place Discoveries
  await prisma.placeDiscovery.create({
    data: {
      userId: demoUser.id,
      placeId: 'ChIJz2x3a_pa1zsRq9x-001',
      name: 'Paithan Handloom Silk Weaving Cluster',
      address: 'Near Jayakwadi Dam Road, Paithan 431107',
      rating: 4.8,
      userRatingCount: 64,
      latitude: 19.4784,
      longitude: 75.3792,
      distanceKm: 2.4,
      googleMapsUri: 'https://maps.google.com/?q=Paithan+Handloom+Silk+Weaving',
      category: 'living_craft',
      discoveryScore: 0.92,
      sourceType: 'CURATED',
    }
  })

  // 8. Create Passport Activities
  await prisma.passportActivity.create({
    data: {
      userId: demoUser.id,
      activityType: 'SCAN',
      title: 'Scanned Kailasa Temple',
      pointsEarned: 50,
    }
  })

  await prisma.passportActivity.create({
    data: {
      userId: demoUser.id,
      activityType: 'PLACE_DISCOVERY',
      title: 'Discovered Paithan Handloom Cluster',
      pointsEarned: 100,
    }
  })

  console.log('✅ Sanskriti Yatra rich database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seeding error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
