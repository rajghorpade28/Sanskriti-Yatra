export interface UserCoordinates {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface HeritageSiteDistance {
  siteId: string
  siteName: string
  distanceKm: number
}

// Fixed coordinates of Maharashtra heritage sites
export const MAHARASHTRA_SITE_COORDS = [
  { id: 'ellora', name: 'Ellora Caves', lat: 20.0268, lng: 75.1771 },
  { id: 'ajanta', name: 'Ajanta Caves', lat: 20.5519, lng: 75.7033 },
  { id: 'paithan', name: 'Paithan', lat: 19.4784, lng: 75.3792 },
]

export class LocationService {
  async getCurrentPosition(): Promise<UserCoordinates | null> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return null
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          })
        },
        (err) => {
          console.warn('LocationService: Permission denied or location error', err)
          resolve(null)
        },
        { timeout: 8000, maximumAge: 60000 }
      )
    })
  }

  // Haversine formula to compute distance in km between two GPS coordinates
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10 // Rounded to 1 decimal place
  }

  getDistancesToHeritageSites(userCoords: UserCoordinates): HeritageSiteDistance[] {
    return MAHARASHTRA_SITE_COORDS.map((site) => ({
      siteId: site.id,
      siteName: site.name,
      distanceKm: this.calculateDistanceKm(userCoords.latitude, userCoords.longitude, site.lat, site.lng),
    }))
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }
}

export const locationService = new LocationService()
