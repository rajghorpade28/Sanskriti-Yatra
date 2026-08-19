import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      placeId,
      name,
      address,
      rating,
      userRatingCount,
      latitude,
      longitude,
      distanceKm,
      googleMapsUri,
      photoUrl,
      category = 'cultural',
      discoveryScore = 0.85,
      sourceType = 'PLACES_API',
    } = body

    // Find demo user
    const demoUser = await prisma.user.findFirst({
      where: { name: 'Demo Tourist' },
    })

    if (!demoUser) {
      return NextResponse.json({ error: 'Demo user not found' }, { status: 404 })
    }

    // Check if place already saved
    const existing = await prisma.placeDiscovery.findFirst({
      where: {
        userId: demoUser.id,
        placeId,
      },
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadySaved: true,
        discovery: existing,
      })
    }

    // 1. Create PlaceDiscovery record
    const discovery = await prisma.placeDiscovery.create({
      data: {
        userId: demoUser.id,
        placeId,
        name,
        address,
        rating: rating ? parseFloat(rating) : undefined,
        userRatingCount: userRatingCount ? parseInt(userRatingCount, 10) : undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        distanceKm: distanceKm ? parseFloat(distanceKm) : undefined,
        googleMapsUri,
        photoUrl,
        category,
        discoveryScore: discoveryScore ? parseFloat(discoveryScore) : undefined,
        sourceType,
      },
    })

    // 2. Log PassportActivity
    await prisma.passportActivity.create({
      data: {
        userId: demoUser.id,
        activityType: 'PLACE_DISCOVERY',
        title: `Discovered ${name}`,
        pointsEarned: 100,
      },
    })

    return NextResponse.json({
      success: true,
      alreadySaved: false,
      discovery,
    })
  } catch (error) {
    console.error('Save Place API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
