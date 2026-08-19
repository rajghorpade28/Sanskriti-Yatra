import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding rich Maharashtra demo dataset for Sanskriti Yatra...')

  // Clear existing records to ensure clean seed
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
    // Ellora (1-7)
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
      siteId: ellora.id,
      name: 'Buddhist Vihara Monastery (Cave 12)',
      category: 'architecture',
      period: '700–750 CE',
      culturalSignificance: 'Known as "Tin Tala", a rare three-story rock-cut university complex where hundreds of monk-scholars lived and studied.',
      architecturalNote: 'Massive square pillars supporting open courtyards with row of meditative Buddha niches on each level.',
      historicalContext: 'One of the largest monastic educational centers of ancient Western India.',
      observedFeatures: JSON.stringify(['Three-storey facade', 'Monastic cells', 'Symmetrical pillared hall']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Ellora_cave12_01.jpg/800px-Ellora_cave12_01.jpg']),
      keywords: JSON.stringify(['tin tala', 'vihara', 'cave 12', 'monastery', 'ellora']),
      confidence: 0.87,
      relatedTraditionId: rockCutCraft.id,
    },
    {
      siteId: ellora.id,
      name: 'Rock-Cut Monolithic Dhvajastambha Pillar',
      category: 'architecture',
      period: '8th Century CE',
      culturalSignificance: 'A 110-foot tall victory column standing independently in the court of Kailasa Temple, carved out of the single rock mass.',
      architecturalNote: 'Ornamental capitals, geometric molding, and carved lotus band embellishments.',
      historicalContext: 'Served as ritual victory pillar and cosmic axis marker (Axis Mundi).',
      observedFeatures: JSON.stringify(['Freestanding stone column', 'Geometric carvings', 'Basalt monolith']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ellora_Kailasa_pillar.jpg/800px-Ellora_Kailasa_pillar.jpg']),
      keywords: JSON.stringify(['pillar', 'column', 'dhvajastambha', 'kailasa', 'ellora']),
      confidence: 0.90,
      relatedTraditionId: rockCutCraft.id,
    },
    {
      siteId: ellora.id,
      name: 'Gajendra Moksha Decorative Carving',
      category: 'sculpture',
      period: '8th Century CE',
      culturalSignificance: 'Intricate decorative relief band depicting sacred elephants and mythical lotus flowers surrounding the base of Cave 16.',
      architecturalNote: 'High-relief animal frieze displaying anatomical dynamism and decorative rhythm.',
      historicalContext: 'Carved to visually carry the weight of the central shrine on the backs of royal elephants.',
      observedFeatures: JSON.stringify(['Elephant frieze', 'Lotus decorative band', 'Rock relief panel']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ellora_elephant_frieze.jpg/800px-Ellora_elephant_frieze.jpg']),
      keywords: JSON.stringify(['gajendra', 'elephant', 'carving', 'frieze', 'ellora']),
      confidence: 0.86,
      relatedTraditionId: rockCutCraft.id,
    },

    // Ajanta (8-10)
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
      siteId: ajanta.id,
      name: 'Seated Buddha Sculpture in Shrine (Cave 26)',
      category: 'sculpture',
      period: '5th Century CE',
      culturalSignificance: 'Colossal image of Lord Buddha in Pralambapadasana (seated on throne with feet down) flanked by attendant Bodhisattvas.',
      architecturalNote: 'Surrounded by elaborate rock carvings of celestial musicians and lotus halos.',
      historicalContext: 'Located in the grand Chaitya Cave 26, famous also for the 29ft Mahaparinirvana reclining Buddha.',
      observedFeatures: JSON.stringify(['Throne seated Buddha', 'Halo halo carving', 'Attendant Bodhisattvas', 'Chaitya sanctuary']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Ajanta_Cave_26_Buddha.jpg/800px-Ajanta_Cave_26_Buddha.jpg']),
      keywords: JSON.stringify(['buddha', 'cave 26', 'ajanta', 'seated buddha', 'shrine']),
      confidence: 0.92,
      relatedTraditionId: muralPainting.id,
    },
    {
      siteId: ajanta.id,
      name: 'Chaitya Stupa Architecture (Cave 19)',
      category: 'architecture',
      period: '5th Century CE',
      culturalSignificance: 'The most exquisite worship sanctuary at Ajanta, featuring a high arched horseshoe facade (Gandharvakara window) and standing Buddha carved directly on the stupa.',
      architecturalNote: 'Richly decorated facade with Buddha figures in niches and ornate interior stone columns with umbrella stupa top.',
      historicalContext: 'Considered the architectural model for classical Buddhist sanctuaries across East Asia.',
      observedFeatures: JSON.stringify(['Horseshoe arch facade', 'Standing Buddha stupa', 'Fluted stone pillars']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Ajanta_Cave_19_Facade.jpg/800px-Ajanta_Cave_19_Facade.jpg']),
      keywords: JSON.stringify(['chaitya', 'cave 19', 'stupa', 'ajanta', 'arch facade']),
      confidence: 0.90,
      relatedTraditionId: muralPainting.id,
    },

    // Paithan (11-12)
    {
      siteId: paithan.id,
      name: 'Paithani Peacock Silk Saree Tapestry',
      category: 'textile',
      period: 'Living Tradition (Satavahana origin to modern)',
      culturalSignificance: 'The "Queen of Silks", featuring pure gold zari thread woven with mulberry silk to create iridescent peacock (Mor) and parrot (Popat) pallu borders.',
      architecturalNote: 'Double-tapestry handloom weaving technique where front and back designs look identical.',
      historicalContext: 'Exported to ancient Rome and Greece in Satavahana times (200 BCE) in exchange for gold gold coins.',
      observedFeatures: JSON.stringify(['Gold zari thread', 'Peacock pallu motif', 'Pure silk texture', 'Iridescent weave', 'Mor-popat pattern']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Paithani_Saree_Border.jpg/800px-Paithani_Saree_Border.jpg']),
      keywords: JSON.stringify(['paithani', 'saree', 'silk', 'peacock', 'zari', 'paithan', 'textile', 'weaving']),
      confidence: 0.95,
      relatedTraditionId: paithaniWeaving.id,
    },
    {
      siteId: paithan.id,
      name: 'Traditional Wooden Pit-Loom Shuttle',
      category: 'craft',
      period: 'Living Tradition',
      culturalSignificance: 'Handmade wooden loom apparatus with bamboo shuttles and silk thread spools used by master weavers in Paithan to weave intricate geometric pallu motifs.',
      architecturalNote: 'Manual foot-pedal treadle mechanism requiring synchronized hand-eye movement.',
      historicalContext: 'Preserved by traditional artisan guilds in Paithan village for over two millennia.',
      observedFeatures: JSON.stringify(['Wooden loom shuttle', 'Silk yarn spools', 'Handloom treadle frame']),
      imageUrls: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Handloom_weaving_shuttle.jpg/800px-Handloom_weaving_shuttle.jpg']),
      keywords: JSON.stringify(['loom', 'shuttle', 'handloom', 'weaving', 'paithan', 'artisan']),
      confidence: 0.88,
      relatedTraditionId: paithaniWeaving.id,
    },
  ]

  for (const obj of objects) {
    await prisma.heritageObject.create({ data: obj })
  }

  // 5. Create Crowd Snapshots (Historical sequence for live demo charts)
  const now = new Date()
  const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
  
  for (const h of hours) {
    const timestamp = new Date(now.valueOf() - (24 - h) * 60 * 60 * 1000)
    
    // Ellora: High crowd peak during daytime (12pm-4pm)
    const elloraCount = h >= 10 && h <= 16 ? 8420 + Math.floor(Math.random() * 500) : 3200 + Math.floor(Math.random() * 400)
    await prisma.crowdSnapshot.create({
      data: {
        siteId: ellora.id,
        timestamp,
        visitorCount: elloraCount,
        threshold: 7500,
        status: elloraCount > 7500 ? 'HIGH_CROWD' : 'NORMAL',
      }
    })

    // Paithan: Consistently comfortable crowd
    const paithanCount = 400 + Math.floor(Math.random() * 150)
    await prisma.crowdSnapshot.create({
      data: {
        siteId: paithan.id,
        timestamp,
        visitorCount: paithanCount,
        threshold: 3000,
        status: 'NORMAL',
      }
    })
  }

  // 6. Create Seed Contributions
  const approvedContribution = await prisma.contribution.create({
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
      metadata: JSON.stringify(['craft', 'weaving', 'family_heritage', 'paithani']),
    }
  })

  await prisma.contribution.create({
    data: {
      userId: demoUser.id,
      siteId: ellora.id,
      traditionId: rockCutCraft.id,
      title: 'Oral Legend of the Kailasa Sculptors',
      type: 'audio_story',
      audioUrl: '/demo-audio-2.mp3',
      transcript: 'Local elders tell that when King Krishna falling ill promised to build the temple, Chief Architect Kokasa carved the shikhara first in 7 days to fulfill the vow.',
      translation: 'Local elders tell that when King Krishna falling ill promised to build the temple, Chief Architect Kokasa carved the shikhara first in 7 days to fulfill the vow.',
      originalLanguage: 'mr',
      targetLanguage: 'en',
      language: 'Marathi',
      status: 'PENDING',
      latitude: 20.0268,
      longitude: 75.1771,
      metadata: JSON.stringify(['legend', 'kailasa', 'oral_history']),
    }
  })

  // 7. Create Initial Scan History
  const kailasaObj = await prisma.heritageObject.findFirst({ where: { name: { contains: 'Kailasa' } } })
  if (kailasaObj) {
    await prisma.scanHistory.create({
      data: {
        userId: demoUser.id,
        identifiedObjectId: kailasaObj.id,
        siteId: ellora.id,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg/800px-Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg',
        confidence: 0.96,
        inputMethod: 'camera',
      }
    })
  }

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
