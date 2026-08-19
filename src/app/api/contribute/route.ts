import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { siteId, transcript, metadata } = body

    // Fetch the demo user
    const demoUser = await prisma.user.findFirst({
      where: { name: 'Demo Tourist' }
    })

    if (!demoUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Save the contribution
    const contribution = await prisma.contribution.create({
      data: {
        userId: demoUser.id,
        title: metadata.title,
        type: 'audio_story',
        audioUrl: '/demo-audio-new.mp3', // Simulated
        transcript: transcript,
        translation: transcript, // Simulated translation same as transcript for demo
        language: metadata.language,
        status: 'PENDING',
        metadata: JSON.stringify(metadata),
      }
    })

    return NextResponse.json({ success: true, contributionId: contribution.id })
  } catch (error) {
    console.error("Contribution API Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
