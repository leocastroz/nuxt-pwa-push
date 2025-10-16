import { computed, onBeforeUnmount } from 'vue'

// Global, SSR-safe reactive store for current user location and address
// Usage (in any component):
// const { coords, address, startWatch, stopWatch } = useUserLocation()
// onMounted(() => startWatch())
// onBeforeUnmount(() => stopWatch())

export type GeoCoords = { lat: number; lng: number; accuracy?: number; timestamp?: number }
export type GeoPermission = 'granted' | 'denied' | 'prompt'

export function useUserLocation() {
  // Shared state across the app (Nuxt auto-imported useState)
  const coords = useState<GeoCoords | null>('userLoc:coords', () => null)
  const address = useState<string | null>('userLoc:address', () => null)
  const permission = useState<GeoPermission>('userLoc:permission', () => 'prompt')
  const error = useState<string | null>('userLoc:error', () => null)
  const watchId = useState<number | null>('userLoc:watchId', () => null)

  // Throttle reverse geocoding
  let reverseInFlight = false
  let lastReverse = 0
  let lastReverseCoords: { lat: number; lng: number } | null = null

  const hasLocation = computed(() => !!coords.value)

  function distanceKm(a: GeoCoords | null, b: { lat: number; lng: number } | null) {
    if (!a || !b) return null
    const { lat: lat1, lng: lon1 } = a
    const { lat: lat2, lng: lon2 } = b
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const aa =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa))
    return R * c
  }

  async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('lat', lat.toString())
    url.searchParams.set('lon', lng.toString())
    url.searchParams.set('format', 'json')
    url.searchParams.set('zoom', '18')
    url.searchParams.set('addressdetails', '1')
    const res = await fetch(url.toString(), { headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' } })
    if (!res.ok) return null
    const data: { display_name?: string } = await res.json()
    return data.display_name ?? null
  }

  async function maybeReverseGeocode(lat: number, lng: number) {
    const now = Date.now()
    if (reverseInFlight) return
    const longEnough = now - lastReverse >= 20_000 // 20s
    const farEnough = !lastReverseCoords || distanceKm({ lat, lng }, lastReverseCoords) !== null &&
      (distanceKm({ lat, lng }, lastReverseCoords) as number) >= 0.05 // ~50m
    if (!longEnough && !farEnough) return
    reverseInFlight = true
    try {
      const addr = await reverseGeocode(lat, lng)
      address.value = addr
    } finally {
      reverseInFlight = false
      lastReverse = now
      lastReverseCoords = { lat, lng }
    }
  }

  async function startWatch(options: PositionOptions = { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }) {
    if (!process.client || !('geolocation' in navigator)) return
    try {
      // Update permission state if supported
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (navigator.permissions && navigator.permissions.query) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const status = await navigator.permissions.query({ name: 'geolocation' })
        permission.value = (status.state as GeoPermission) || 'prompt'
        status.onchange = () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          permission.value = (status.state as GeoPermission) || 'prompt'
        }
      }
    } catch {}

    if (watchId.value !== null) stopWatch()
    watchId.value = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        coords.value = { lat: latitude, lng: longitude, accuracy, timestamp: pos.timestamp }
        error.value = null
        maybeReverseGeocode(latitude, longitude)
      },
      (err) => {
        error.value = err.message || 'Geolocation error'
      },
      options
    )
  }

  function stopWatch() {
    if (!process.client || !('geolocation' in navigator)) return
    if (watchId.value !== null) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }
  }

  async function refreshOnce(options: PositionOptions = { enableHighAccuracy: true, timeout: 8000 }) {
    if (!process.client || !('geolocation' in navigator)) return
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords
          coords.value = { lat: latitude, lng: longitude, accuracy, timestamp: pos.timestamp }
          error.value = null
          maybeReverseGeocode(latitude, longitude)
          resolve()
        },
        () => resolve(),
        options
      )
    })
  }

  // Optional auto-cleanup helper if used inside components
  onBeforeUnmount(() => {
    // don't auto stop for app-wide persistence; comment out if desired
    // stopWatch()
  })

  return {
    // state
    coords,
    address,
    permission,
    error,
    hasLocation,
    // actions
    startWatch,
    stopWatch,
    refreshOnce,
    // utils
    distanceKm: (to: { lat: number; lng: number } | null) => distanceKm(coords.value, to)
  }
}
