export interface PlaceItem {
  placeId: string
  name: string
  address: string
  rating: number
  userRatingCount: number
  latitude: number
  longitude: number
  distanceKm: number
  googleMapsUri: string
  photoUrl: string
  category: string
  discoveryScore: number
  popularitySignal: 'LOWER_POPULARITY_SIGNAL' | 'MODERATE' | 'POPULAR'
  whyRecommended: string
  sourceType: 'PLACES_API' | 'CURATED'
}

export class PlacesService {
  /**
   * Calculates the Discovery Score for finding quieter, less-crowded cultural places.
   * Ranking formula:
   * lessPopularScore = (inverseReviewCount * 0.35) + (distanceScore * 0.25) + (ratingScore * 0.15) + (relevance * 0.25)
   */
  calculateDiscoveryScore(reviewCount: number, rating: number, distanceKm: number, categoryRelevance: number = 0.9): number {
    // Fewer reviews = higher inverse count score (normalized 0 to 1)
    const inverseReviewScore = Math.max(0, 1 - Math.min(reviewCount, 1000) / 1000)
    // Closer distance = higher distance score (within 20km)
    const distanceScore = Math.max(0, 1 - Math.min(distanceKm, 20) / 20)
    // Higher rating = higher rating score
    const ratingScore = Math.min(rating, 5) / 5

    const score = inverseReviewScore * 0.35 + distanceScore * 0.25 + ratingScore * 0.15 + categoryRelevance * 0.25
    return Math.round(score * 100) / 100
  }

  /**
   * Fetches nearby places using Google Places API (v1) if API key is configured,
   * or returns curated regional Maharashtra discoveries.
   */
  async searchNearbyPlaces(latitude: number, longitude: number, siteId?: string): Promise<PlaceItem[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY

    if (apiKey) {
      try {
        const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.googleMapsUri,places.photos',
          },
          body: JSON.stringify({
            includedTypes: ['tourist_attraction', 'museum', 'art_gallery', 'place_of_worship', 'cultural_center'],
            maxResultCount: 8,
            locationRestriction: {
              circle: {
                center: { latitude, longitude },
                radius: 15000, // 15km radius
              },
            },
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const rawPlaces = data.places || []

          if (rawPlaces.length > 0) {
            return rawPlaces.map((p: any) => {
              const pLat = p.location?.latitude || latitude
              const pLng = p.location?.longitude || longitude
              const distanceKm = this.haversineDistance(latitude, longitude, pLat, pLng)
              const reviewCount = p.userRatingCount || 25
              const rating = p.rating || 4.5
              const score = this.calculateDiscoveryScore(reviewCount, rating, distanceKm)

              const photoName = p.photos?.[0]?.name
              const photoUrl = photoName
                ? `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=600&key=${apiKey}`
                : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600'

              return {
                placeId: p.id || `place-${Math.random().toString(36).substr(2, 6)}`,
                name: p.displayName?.text || 'Cultural Heritage Landmark',
                address: p.formattedAddress || 'Maharashtra Region',
                rating,
                userRatingCount: reviewCount,
                latitude: pLat,
                longitude: pLng,
                distanceKm,
                googleMapsUri: p.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName?.text || 'Heritage')}`,
                photoUrl,
                category: 'cultural_landmark',
                discoveryScore: score,
                popularitySignal: reviewCount < 150 ? 'LOWER_POPULARITY_SIGNAL' : reviewCount < 500 ? 'MODERATE' : 'POPULAR',
                whyRecommended: reviewCount < 150 ? 'Lower review volume than major nearby sites — a quieter cultural experience.' : 'Highly rated cultural landmark nearby.',
                sourceType: 'PLACES_API',
              }
            })
          }
        }
      } catch (err) {
        console.warn('PlacesService: Google Places API call failed, using curated fallback', err)
      }
    }

    // Fallback Curated Maharashtra Places around Ellora/Paithan/Ajanta
    return this.getCuratedPlaces(latitude, longitude)
  }

  private getCuratedPlaces(latitude: number, longitude: number): PlaceItem[] {
    const fallbackList = [
      {
        placeId: 'curated-paithan-loom',
        name: 'Paithan Handloom Silk Weaving Cluster',
        address: 'Near Jayakwadi Dam Road, Paithan 431107',
        rating: 4.8,
        userRatingCount: 64,
        latitude: 19.4784,
        longitude: 75.3792,
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Paithani_Saree_Border.jpg/800px-Paithani_Saree_Border.jpg',
        category: 'living_craft',
        whyRecommended: 'Lower popularity signal (64 reviews) — authentic 2,000-year-old living silk handloom weaving cluster.',
      },
      {
        placeId: 'curated-sant-eknath',
        name: 'Sant Eknath Maharaj Samadhi Temple',
        address: 'Godavari Riverbank, Paithan 431107',
        rating: 4.7,
        userRatingCount: 112,
        latitude: 19.4721,
        longitude: 75.3815,
        photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
        category: 'spiritual_heritage',
        whyRecommended: 'Quieter riverside pilgrimage heritage site dedicated to 16th century Bhakti poet Sant Eknath.',
      },
      {
        placeId: 'curated-khuldabad-heritage',
        name: 'Khuldabad Sufi Heritage Valley',
        address: 'Khuldabad, Chhatrapati Sambhajinagar 431101',
        rating: 4.6,
        userRatingCount: 88,
        latitude: 20.0094,
        longitude: 75.1852,
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Ellora_cave12_01.jpg/800px-Ellora_cave12_01.jpg',
        category: 'historical_landmark',
        whyRecommended: 'Just 3 km from Ellora Caves — historic Valley of Saints with minimal crowd footfall.',
      },
      {
        placeId: 'curated-daulatabad-fort',
        name: 'Daulatabad (Devagiri) Fort Outer Bailey',
        address: 'Daulatabad, Chhatrapati Sambhajinagar 431002',
        rating: 4.6,
        userRatingCount: 420,
        latitude: 19.9426,
        longitude: 75.2139,
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg/800px-Ellora_Caves_-_Kailasanatha_Temple_-_01.jpg',
        category: 'fortress_architecture',
        whyRecommended: 'Impregnable 12th-century hill fortress with labyrinthine defense passages.',
      },
    ]

    return fallbackList.map((item) => {
      const distanceKm = this.haversineDistance(latitude, longitude, item.latitude, item.longitude)
      const score = this.calculateDiscoveryScore(item.userRatingCount, item.rating, distanceKm)

      return {
        ...item,
        distanceKm,
        googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + item.address)}`,
        discoveryScore: score,
        popularitySignal: item.userRatingCount < 150 ? 'LOWER_POPULARITY_SIGNAL' : 'MODERATE',
        sourceType: 'CURATED',
      }
    })
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10
  }
}

export const placesService = new PlacesService()
