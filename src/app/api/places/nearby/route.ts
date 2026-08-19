import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { placesService } from '@/services/placesService'

const prisma = new PrismaClient()

// Fixed fallback coordinates for known Maharashtra heritage sites
const SITE_COORDS: Record<string, { lat: number; lng: number }> = {
  ellora: { lat: 20.0268, lng: 75.1771 },
  ajanta: { lat: 20.5519, lng: 75.7033 },
  paithan: { lat: 19.4784, lng: 75.3792 },
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const latParam = searchParams.get('lat')
    const lngParam = searchParams.get('lng')
    const siteIdParam = searchParams.get('siteId')
    const siteNameParam = searchParams.get('siteName')

    let lat = 20.0268 // Default to Ellora Caves
    let lng = 75.1771

    if (latParam && lngParam) {
      lat = parseFloat(latParam)
      lng = parseFloat(lngParam)
    } else if (siteNameParam) {
      // Match by site name substring
      const lower = siteNameParam.toLowerCase()
      if (lower.includes('paithan')) {
        lat = SITE_COORDS.paithan.lat
        lng = SITE_COORDS.paithan.lng
      } else if (lower.includes('ajanta')) {
        lat = SITE_COORDS.ajanta.lat
        lng = SITE_COORDS.ajanta.lng
      } else {
        lat = SITE_COORDS.ellora.lat
        lng = SITE_COORDS.ellora.lng
      }
    } else if (siteIdParam) {
      const site = await prisma.site.findUnique({ where: { id: siteIdParam } })
      if (site) {
        const siteKey = site.name.toLowerCase()
        if (siteKey.includes('paithan')) {
          lat = SITE_COORDS.paithan.lat
          lng = SITE_COORDS.paithan.lng
        } else if (siteKey.includes('ajanta')) {
          lat = SITE_COORDS.ajanta.lat
          lng = SITE_COORDS.ajanta.lng
        }
      }
    }

    const places = await placesService.searchNearbyPlaces(lat, lng, siteIdParam || undefined)

    return NextResponse.json({
      success: true,
      latitude: lat,
      longitude: lng,
      count: places.length,
      places,
    })
  } catch (error) {
    console.error('Places Nearby API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
