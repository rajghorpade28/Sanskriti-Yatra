import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { visionService } from '@/services/visionService'

const prisma = new PrismaClient()

/**
 * Sends an image to Gemini Vision API for real heritage identification.
 * Returns a structured target keyword that maps to one of the 12 controlled
 * Maharashtra heritage objects in the database.
 */
async function analyzeWithGemini(imageDataUrl: string, heritageNames: string[]): Promise<{ targetKeyword: string; confidence: number; visualClues: string[] }> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return { targetKeyword: '', confidence: 0, visualClues: [] }
  }

  // Strip data URL prefix to get base64 content
  const base64Data = imageDataUrl.includes(',') ? imageDataUrl.split(',')[1] : imageDataUrl
  const mimeType = imageDataUrl.startsWith('data:image/png') ? 'image/png'
    : imageDataUrl.startsWith('data:image/webp') ? 'image/webp'
    : imageDataUrl.startsWith('data:image/jpeg') || imageDataUrl.startsWith('data:image/jpg') ? 'image/jpeg'
    : 'image/jpeg'

  const systemPrompt = `You are an expert in Indian heritage, archaeology, and cultural art. Analyze this image and identify which specific Maharashtra heritage object it shows.

Known heritage targets (provide EXACTLY one of these keywords or "unknown"):
${heritageNames.map((n, i) => `${i + 1}. ${n}`).join('\n')}

Reply ONLY with valid JSON:
{
  "targetKeyword": "<one exact keyword from target list below, or 'unknown'>",
  "confidence": <0.0 to 1.0 float>,
  "visualClues": ["<visual observation 1>", "<visual observation 2>", "<visual observation 3>"]
}

Target keywords to use: kailasa, ravana, buddha, jain, paithani, padmapani, unknown`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
              { text: systemPrompt },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 512,
          temperature: 0.1,
        },
      }),
    })

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text())
      return { targetKeyword: '', confidence: 0, visualClues: [] }
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    const parsed = JSON.parse(text)

    return {
      targetKeyword: parsed.targetKeyword || 'unknown',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85,
      visualClues: Array.isArray(parsed.visualClues) ? parsed.visualClues : [],
    }
  } catch (err) {
    console.error('Gemini Vision analysis failed:', err)
    return { targetKeyword: '', confidence: 0, visualClues: [] }
  }
}

export async function POST(request: Request) {
  try {
    let body: { image?: string; sampleKey?: string; inputMethod?: string }
    try {
      body = await request.json()
    } catch {
      body = {}
    }

    const { image = '', sampleKey = '', inputMethod = 'camera' } = body

    // 1. Fetch all heritage objects with site info from DB
    const dbObjects = await prisma.heritageObject.findMany({
      include: { site: true },
    })

    // 2. Try Gemini Vision if image is a real base64 data URL (not a http URL)
    let geminiKeyword = ''
    let geminiConfidence = 0
    let geminiVisualClues: string[] = []

    const isRealImageData = image.startsWith('data:image/')
    if (isRealImageData && !sampleKey) {
      const heritageNames = dbObjects.map(o => o.name)
      const geminiResult = await analyzeWithGemini(image, heritageNames)
      geminiKeyword = geminiResult.targetKeyword
      geminiConfidence = geminiResult.confidence
      geminiVisualClues = geminiResult.visualClues
    }

    // 3. Determine the effective search key
    const effectiveKey = geminiKeyword || sampleKey || 'kailasa'

    // 4. Run visionService (keyword-based matching into DB records)
    const analysis = await visionService.analyzeImage(image || '', effectiveKey, dbObjects)

    // If Gemini provided visual clues, merge them in
    if (geminiVisualClues.length > 0) {
      analysis.observedFeatures = [...geminiVisualClues, ...analysis.observedFeatures].slice(0, 6)
    }

    // If Gemini gave high-confidence result, prefer Gemini confidence
    if (geminiConfidence > 0) {
      analysis.confidence = geminiConfidence
      analysis.confidenceLevel = geminiConfidence >= 0.80 ? 'HIGH' : geminiConfidence >= 0.60 ? 'POSSIBLE' : 'UNCERTAIN'
      analysis.isFallback = geminiKeyword === 'unknown'
    }

    // 5. Find demo user
    const user = await prisma.user.findFirst({
      where: { name: 'Demo Tourist' },
    })

    // 6. Save to ScanHistory + PassportActivity
    let scanHistoryId: string | null = null
    if (user && analysis.objectId) {
      const scan = await prisma.scanHistory.create({
        data: {
          userId: user.id,
          identifiedObjectId: analysis.objectId,
          siteId: analysis.siteId,
          imageUrl: isRealImageData
            ? `data:image/jpeg;base64,...` // store just marker for DB (full data URL would be too large for SQLite)
            : image || analysis.imageUrls[0] || '',
          confidence: analysis.confidence,
          inputMethod: inputMethod as string,
        },
      })
      scanHistoryId = scan.id

      // Update user's scan count
      await prisma.user.update({
        where: { id: user.id },
        data: { scanCount: { increment: 1 } },
      })

      // Log passport activity
      await prisma.passportActivity.create({
        data: {
          userId: user.id,
          activityType: 'SCAN',
          title: `Scanned ${analysis.objectName} at ${analysis.siteName}`,
          pointsEarned: 50,
        },
      })
    }

    return NextResponse.json({
      success: true,
      scanId: scanHistoryId,
      usedGemini: isRealImageData && !!process.env.GEMINI_API_KEY,
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
