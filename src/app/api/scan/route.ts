import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { visionService } from '@/services/visionService'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { image, sampleKey, inputMethod = 'camera' } = body

    // 1. Fetch all heritage objects with site info from DB
    const dbObjects = await prisma.heritageObject.findMany({
      include: {
        site: true,
      },
    })

    // 2. Run visionService analysis
    const analysis = await visionService.analyzeImage(image || '', sampleKey || '', dbObjects)

    // 3. Find demo user
    const user = await prisma.user.findFirst({
      where: { name: 'Demo Tourist' },
    })

    // 4. Save scan to ScanHistory table
    let scanHistoryId: string | null = null
    if (user && analysis.objectId) {
      const scan = await prisma.scanHistory.create({
        data: {
          userId: user.id,
          identifiedObjectId: analysis.objectId,
          siteId: analysis.siteId,
          imageUrl: image || analysis.imageUrls[0] || '',
          confidence: analysis.confidence,
          inputMethod: inputMethod,
        },
      })
      scanHistoryId = scan.id

      // Update user's scan count
      await prisma.user.update({
        where: { id: user.id },
        data: { scanCount: { increment: 1 } },
      })
    }

    return NextResponse.json({
      success: true,
      scanId: scanHistoryId,
      analysis,
    })
  } catch (error) {
    console.error('Scan API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Support GET for backward compatibility
export async function GET() {
  try {
    const object = await prisma.heritageObject.findFirst({
      where: { name: { contains: 'Kailasa' } },
    })

    if (object) {
      return NextResponse.json({ objectId: object.id })
    }
    return NextResponse.json({ error: 'Object not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
