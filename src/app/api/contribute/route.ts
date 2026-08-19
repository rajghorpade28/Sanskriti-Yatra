import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { saveUploadedFile } from '@/lib/storage'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let title = 'Community Story Contribution'
    let transcript = ''
    let translation = ''
    let language = 'Marathi'
    let audioUrl = '/demo-audio.mp3'
    let siteId: string | undefined = undefined
    let latitude: number | undefined = undefined
    let longitude: number | undefined = undefined
    let category = 'audio_story'

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      title = (formData.get('title') as string) || title
      transcript = (formData.get('transcript') as string) || ''
      translation = (formData.get('translation') as string) || transcript
      language = (formData.get('language') as string) || language
      category = (formData.get('category') as string) || category
      siteId = (formData.get('siteId') as string) || undefined

      const latStr = formData.get('latitude') as string
      const lngStr = formData.get('longitude') as string
      if (latStr) latitude = parseFloat(latStr)
      if (lngStr) longitude = parseFloat(lngStr)

      const audioFile = formData.get('audio') as File | null
      if (audioFile && audioFile.size > 0) {
        audioUrl = await saveUploadedFile(audioFile, 'audio')
      }
    } else {
      const body = await request.json().catch(() => ({}))
      title = body.title || body.metadata?.title || title
      transcript = body.transcript || ''
      translation = body.translation || transcript
      language = body.language || body.metadata?.language || language
      audioUrl = body.audioUrl || audioUrl
      siteId = body.siteId
      latitude = body.latitude
      longitude = body.longitude
    }

    // Find demo tourist user
    const demoUser = await prisma.user.findFirst({
      where: { name: 'Demo Tourist' },
    })

    if (!demoUser) {
      return NextResponse.json({ error: 'Demo user not found' }, { status: 404 })
    }

    // Default site if none provided
    if (!siteId) {
      const defaultSite = await prisma.site.findFirst({ where: { name: { contains: 'Paithan' } } })
      siteId = defaultSite?.id
    }

    const contribution = await prisma.contribution.create({
      data: {
        userId: demoUser.id,
        siteId,
        title,
        type: category,
        audioUrl,
        transcript,
        translation,
        originalLanguage: language === 'Marathi' ? 'mr' : 'en',
        targetLanguage: 'en',
        language,
        status: 'PENDING',
        latitude,
        longitude,
        metadata: JSON.stringify({ category, submittedAt: new Date().toISOString() }),
      },
    })

    // Log passport activity for contribution submission
    await prisma.passportActivity.create({
      data: {
        userId: demoUser.id,
        activityType: 'CONTRIBUTION',
        title: `Submitted: ${title}`,
        pointsEarned: 200,
      },
    })

    return NextResponse.json({
      success: true,
      contributionId: contribution.id,
      status: contribution.status,
      audioUrl: contribution.audioUrl,
    })
  } catch (error) {
    console.error('Contribution API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
