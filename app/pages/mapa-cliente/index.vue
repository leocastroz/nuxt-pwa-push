<template>
  <div class="map-page">
    <!-- Full-bleed map container -->
    <div ref="mapEl" class="map-view" />

  
  <!-- Exibimos apenas sua localização em tempo real no mapa -->

    <!-- Address search box -->
    <div class="search-box" @keyup.enter="handleSearchSubmit">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Digite um endereço"
        :disabled="searchLoading"
        aria-label="Buscar endereço"
        autocomplete="off"
        autocapitalize="none"
        autocorrect="off"
        @input="onSearchInput"
        @focus="onSearchFocus"
        @keyup.enter="handleSearchSubmit"
      />
      <button class="btn search-btn" @click="handleSearchSubmit" :disabled="searchLoading" aria-label="Buscar">
        <span class="material-icons" v-if="!searchLoading">search</span>
        <span class="material-icons spin" v-else>autorenew</span>
      </button>
    </div>

    <div v-if="searchMessage" class="search-message">{{ searchMessage }}</div>

    <!-- Suggestions dropdown -->
    <div v-if="showSuggestions && suggestions.length" class="search-suggestions">
      <ul>
        <li v-for="s in suggestions" :key="s.id" @mousedown.prevent="selectSuggestion(s)">
          <div class="primary">{{ s.display_name }}</div>
          <div v-if="s.distanceKm !== undefined" class="secondary">{{ s.distanceKm.toFixed(2) }} km</div>
        </li>
      </ul>
    </div>

    <!-- Floating controls -->
    <div class="floating-controls">
      <button class="btn" @click="recenterToUser" aria-label="Centralizar localização">
        <!-- <span class="mdi mdi-crosshairs-gps" /> -->
        <span class="material-icons">my_location</span>
      </button>
    </div>

    <!-- Bottom sheet (summary/action) -->
    <div v-if="false" class="bottom-sheet" :class="{ open: sheetOpen }">
      <div class="handle" @click="sheetOpen = !sheetOpen" />
      <div class="sheet-content">
        <h3>Sua localização no mapa</h3>
        <p class="muted">Estamos exibindo sua posição em tempo real. Use o botão para centralizar a visão.</p>
        <div class="coords">
          <div>
            <small>Latitude</small>
            <strong>{{ userPosition?.lat?.toFixed(6) ?? '---' }}</strong>
          </div>
          <div>
            <small>Longitude</small>
            <strong>{{ userPosition?.lng?.toFixed(6) ?? '---' }}</strong>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef } from 'vue'
import L, { Map as LeafletMap, Marker, TileLayer } from 'leaflet'
import 'leaflet-routing-machine'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente',
  ssr: false
})

// Map DOM ref
const mapEl = ref<HTMLDivElement | null>(null)

// Leaflet instances
const map = shallowRef<LeafletMap | null>(null)
const baseLayer = shallowRef<TileLayer | null>(null)
const userMarker = shallowRef<Marker | null>(null)
const searchMarker = shallowRef<Marker | null>(null)
const routingControl = shallowRef<L.Routing.Control | null>(null)
const geoWatchId = ref<number | null>(null)
// Apenas a localização do usuário

// State
const sheetOpen = ref(true)
const center = ref({ lat: -23.55052, lng: -46.633308 }) // São Paulo default
const userPosition = ref<{ lat: number; lng: number } | null>(null)
const searchQuery = ref('')
const searchLoading = ref(false)
const searchMessage = ref('')
type SearchSuggestion = { id: string; lat: number; lon: number; display_name: string; distanceKm?: number }
const suggestions = ref<SearchSuggestion[]>([])
const showSuggestions = ref(false)
let suggestTimer: number | null = null
// Reverse geocoding state for user's current address
const userAddress = ref<string | null>(null)
const lastReverse = ref<number>(0)
const lastReverseCoords = ref<{ lat: number; lng: number } | null>(null)
const reverseInFlight = ref(false)

// Tile style (Light only)
const LIGHT_TILES = {
  url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  attr: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
} as const

function createLightBaseLayer() {
  return L.tileLayer(LIGHT_TILES.url, {
    attribution: LIGHT_TILES.attr,
    maxZoom: 18
  })
}

function initMap(el: HTMLDivElement) {
  // Create map
  const m = L.map(el, {
    zoomControl: false,
    center: [center.value.lat, center.value.lng],
    zoom: 16,
    minZoom: 12,
    maxZoom: 18,
    preferCanvas: true
  })

  map.value = m

  baseLayer.value = createLightBaseLayer()
  baseLayer.value.addTo(m)

  // Custom zoom control in top-left (cleaner)
  L.control.zoom({ position: 'topleft' }).addTo(m)

  // Track map center (for UI/controls if needed)
  m.on('move', () => {
    const c = m.getCenter()
    center.value = { lat: c.lat, lng: c.lng }
  })

  // Try geolocation
  locateUser()
  startRealtimeLocation()
}

function locateUser() {
  if (!map.value) return
  // Register listeners BEFORE calling locate to avoid missing fast events
  ;(map.value as LeafletMap).once('locationfound', (e: L.LocationEvent) => {
    const pos = e.latlng
    addOrMoveUserMarker(pos.lat, pos.lng)
  })
  ;(map.value as LeafletMap).once('locationerror', () => {
    // Fallback using plain Geolocation API
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          addOrMoveUserMarker(latitude, longitude)
          map.value!.setView([latitude, longitude], 17)
        },
        () => {
          // Keep default center silently
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    }
  })
  map.value.locate({ setView: true, enableHighAccuracy: true, maxZoom: 17 })
}

function addOrMoveUserMarker(lat: number, lng: number) {
  // Build a pin-style icon via divIcon
  const icon = createUserPinIcon()

  if (!userMarker.value) {
    userMarker.value = L.marker([lat, lng], { icon })
    userMarker.value.addTo(map.value as LeafletMap)
    updateUserPopup(lat, lng)
    // Abre o popup na primeira criação
    userMarker.value.openPopup()
  } else {
    userMarker.value.setLatLng([lat, lng])
    updateUserPopup(lat, lng)
  }
  userPosition.value = { lat, lng }
  maybeReverseGeocode(lat, lng)
}

function createUserPinIcon() {
  return L.divIcon({
    className: 'user-pin-icon',
    html: '<div class="pin"><div class="pin-head"></div><div class="pin-tail"></div></div><div class="pin-shadow"></div>',
    iconSize: [30, 44],
    iconAnchor: [15, 40] // ponta do pin
  })
}

function createSearchPinIcon() {
  return L.divIcon({
    className: 'search-pin-icon',
    html: '<div class="pin"><div class="pin-head"></div><div class="pin-tail"></div></div><div class="pin-shadow"></div>',
    iconSize: [30, 44],
    iconAnchor: [15, 40]
  })
}

function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function updateUserPopup(lat: number, lng: number) {
  const base = `Você está aqui<br/>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}`
  const address = userAddress.value ? `<br/><small>${escapeHtml(userAddress.value)}</small>` : ''
  userMarker.value?.bindPopup(base + address)
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
  // If a request is ongoing, skip
  if (reverseInFlight.value) return
  // Throttle by time (>= 20s) or distance (>= 0.05km)
  const longEnough = now - lastReverse.value >= 20_000
  const farEnough = !lastReverseCoords.value || haversineKm(lastReverseCoords.value.lat, lastReverseCoords.value.lng, lat, lng) >= 0.05
  if (!longEnough && !farEnough) return
  reverseInFlight.value = true
  try {
    const addr = await reverseGeocode(lat, lng)
    userAddress.value = addr
    // Refresh popup with address when available
    updateUserPopup(lat, lng)
  } finally {
    reverseInFlight.value = false
    lastReverse.value = now
    lastReverseCoords.value = { lat, lng }
  }
}

function recenterToUser() {
  if (!map.value) return
  if (!userMarker.value) {
    locateUser()
    return
  }
  map.value.flyTo(userMarker.value.getLatLng(), 17, { duration: 0.8 })
}

function startRealtimeLocation() {
  if (!('geolocation' in navigator)) return
  // Clear previous watcher if any
  if (geoWatchId.value !== null) {
    navigator.geolocation.clearWatch(geoWatchId.value)
  }
  geoWatchId.value = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      addOrMoveUserMarker(latitude, longitude)
    },
    (err) => {
      // Ignore errors to avoid breaking UX; user might deny permission
      // console.warn('Geolocation watch error:', err)
    },
    { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
  )
}

// Sem confirmação de ponto: exibimos apenas a localização atual

async function handleSearchSubmit() {
  if (!searchQuery.value || !map.value) return
  searchMessage.value = ''
  searchLoading.value = true
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', searchQuery.value)
    url.searchParams.set('format', 'json')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('limit', '1')
    url.searchParams.set('countrycodes', 'br')

    const res = await fetch(url.toString(), {
      headers: {
        'Accept-Language': 'pt-BR,pt;q=0.9'
      }
    })
    if (!res.ok) throw new Error('Falha ao buscar endereço')
    const data: Array<{ lat: string; lon: string; display_name: string }> = await res.json()
    if (!data || data.length === 0) {
      searchMessage.value = 'Endereço não encontrado.'
      return
    }
  const first = data[0]!
    const lat = parseFloat(first.lat)
    const lng = parseFloat(first.lon)
    addOrMoveSearchMarker(lat, lng, first.display_name)
    ;(map.value as LeafletMap).flyTo([lat, lng], Math.max(map.value!.getZoom(), 16), { duration: 0.8 })
    searchMessage.value = ''

    // Try to route from current user location to searched point
    if (!userPosition.value) {
      // Attempt to acquire location and inform user
      locateUser()
      searchMessage.value = 'Precisamos da sua localização para traçar a rota. Assim que disponível, pesquise novamente.'
    } else {
      routeToSearch()
    }
    // Hide suggestions after selection/search
    showSuggestions.value = false
    suggestions.value = []
  } catch (e: any) {
    searchMessage.value = e?.message || 'Ocorreu um erro na busca.'
  } finally {
    searchLoading.value = false
  }
}

function addOrMoveSearchMarker(lat: number, lng: number, label?: string) {
  const icon = createSearchPinIcon()
  if (!searchMarker.value) {
    searchMarker.value = L.marker([lat, lng], { icon })
    searchMarker.value.addTo(map.value as LeafletMap)
  } else {
    searchMarker.value.setLatLng([lat, lng])
  }
  const content = label ? `<strong>Destino</strong><br/>${label}` : `Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}`
  searchMarker.value.bindPopup(content)
  searchMarker.value.openPopup()
}

function onSearchFocus() {
  if (suggestions.value.length) showSuggestions.value = true
}

function onSearchInput() {
  showSuggestions.value = true
  if (suggestTimer) window.clearTimeout(suggestTimer)
  suggestTimer = window.setTimeout(fetchSuggestions, 280)
}

function bboxFromRadius(lat: number, lon: number, radiusKm: number) {
  const dLat = radiusKm / 111 // ~111km per degree latitude
  const dLon = radiusKm / (111 * Math.cos((lat * Math.PI) / 180))
  return {
    minLat: lat - dLat,
    maxLat: lat + dLat,
    minLon: lon - dLon,
    maxLon: lon + dLon
  }
}

async function fetchSuggestions() {
  const q = searchQuery.value.trim()
  if (!q || q.length < 3) {
    suggestions.value = []
    return
  }
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', q)
    url.searchParams.set('format', 'json')
    url.searchParams.set('addressdetails', '0')
    url.searchParams.set('limit', '8')
    url.searchParams.set('countrycodes', 'br')
    // Bias results within 5km of user position using a viewbox
    if (userPosition.value) {
      const { minLat, maxLat, minLon, maxLon } = bboxFromRadius(userPosition.value.lat, userPosition.value.lng, 5)
      // viewbox expects lon,lat pairs
      url.searchParams.set('viewbox', `${minLon},${minLat},${maxLon},${maxLat}`)
      url.searchParams.set('bounded', '1')
    }
    const res = await fetch(url.toString(), {
      headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' }
    })
    if (!res.ok) throw new Error('Falha ao buscar sugestões')
    const data: Array<{ lat: string; lon: string; display_name: string }> = await res.json()
    let items: SearchSuggestion[] = data.map((d, idx) => ({
      id: `${d.lat},${d.lon}-${idx}`,
      lat: parseFloat(d.lat),
      lon: parseFloat(d.lon),
      display_name: d.display_name
    }))
    // Compute distance and filter to <= 5km if we have userPosition
    if (userPosition.value) {
      items = items
        .map((it) => ({ ...it, distanceKm: haversineKm(userPosition.value!.lat, userPosition.value!.lng, it.lat, it.lon) }))
        .filter((it) => it.distanceKm! <= 5)
        .sort((a, b) => (a.distanceKm! - b.distanceKm!))
    }
    suggestions.value = items
  } catch (err) {
    // silent fail for suggestions
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function selectSuggestion(s: SearchSuggestion) {
  searchQuery.value = s.display_name
  addOrMoveSearchMarker(s.lat, s.lon, s.display_name)
  if (map.value) (map.value as LeafletMap).flyTo([s.lat, s.lon], Math.max(map.value!.getZoom(), 16), { duration: 0.8 })
  if (userPosition.value) routeToSearch()
  showSuggestions.value = false
}

function routeToSearch() {
  if (!map.value || !userPosition.value || !searchMarker.value) return

  // Remove previous control if any
  if (routingControl.value) {
    (routingControl.value as L.Routing.Control).remove()
    routingControl.value = null
  }

  const start = L.latLng(userPosition.value.lat, userPosition.value.lng)
  const end = (searchMarker.value as Marker).getLatLng()

  const plan = L.Routing.plan([start, end], {
    createMarker: (i, wp) => {
      const icon = i === 0 ? createUserPinIcon() : createSearchPinIcon()
      return L.marker(wp.latLng, { icon })
    },
    draggableWaypoints: false,
    addWaypoints: false
  })

  routingControl.value = L.Routing.control({
    plan,
    routeWhileDragging: false,
    fitSelectedRoutes: true,
    show: false,
    router: L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1'
    }),
    lineOptions: {
      // LRM typings expect a proper PolylineOptions plus styles
      styles: [
        { color: '#2563eb', opacity: 0.9, weight: 6 },
        { color: '#93c5fd', opacity: 0.7, weight: 2 }
      ],
      extendToWaypoints: true,
      missingRouteTolerance: 0
    } as any
  })

  routingControl.value.addTo(map.value as LeafletMap)
}

onMounted(() => {
  if (mapEl.value) initMap(mapEl.value)
})

onBeforeUnmount(() => {
  map.value?.remove()
  if (geoWatchId.value !== null) {
    navigator.geolocation.clearWatch(geoWatchId.value)
  }
  if (searchMarker.value) {
    searchMarker.value.remove()
    searchMarker.value = null
  }
  if (routingControl.value) {
    routingControl.value.remove()
    routingControl.value = null
  }
})

</script>

<style scoped>
.map-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 155px);
  overflow: hidden;
}
.map-view {
  position: absolute;
  inset: 0;
}

/* Ícone de pin do usuário */
:deep(.user-pin-icon) {
  display: grid;
  place-items: center;
}
:deep(.user-pin-icon .pin) {
  position: relative;
  display: grid;
  place-items: center;
}
:deep(.user-pin-icon .pin-head) {
  width: 20px;
  height: 20px;
  background: #00a8ff;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 6px 14px rgba(0, 168, 255, 0.6);
}
:deep(.user-pin-icon .pin-tail) {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid #00a8ff;
  margin-top: 2px;
}
:deep(.user-pin-icon .pin-shadow) {
  width: 28px;
  height: 8px;
  background: rgba(0,0,0,0.25);
  border-radius: 50%;
  margin-top: 4px;
  filter: blur(2px);
}

/* Floating controls on map */
.floating-controls {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 500;
}
.btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: rgba(255,255,255,0.95);
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.btn:active { transform: scale(0.98); }

/* Search box */
.search-box {
  position: absolute;
  top: 10px;
  left: 60px; /* avoid overlapping Leaflet zoom (top-left) */
  right: 70px; /* avoid overlapping floating controls (top-right) */
  display: flex;
  gap: 8px;
  z-index: 600;
}
.search-input {
  flex: 1;
  height: 44px;
  padding: 0 12px;
  border-radius: 12px;
  border: none;
  outline: none;
  background: #F44336;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  font-size: 16px;
}
.search-btn {
  width: 44px;
  height: 44px;
}
.search-message {
  position: absolute;
  top: 60px;
  left: 60px;
  right: 70px;
  z-index: 600;
  background: rgba(255,255,255,0.95);
  padding: 8px 12px;
  border-radius: 10px;
  color: #1f2937;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  font-size: 13px;
}
.material-icons.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }

/* Suggestions dropdown */
.search-suggestions {
  position: absolute;
  top: 60px;
  left: 60px;
  right: 70px;
  z-index: 650;
}
.search-suggestions ul {
  list-style: none;
  margin: 0;
  padding: 6px;
  background: rgba(255,255,255,0.98);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.22);
  max-height: 40vh;
  overflow: auto;
}
.search-suggestions li {
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.search-suggestions li:hover {
  background: #f3f4f6;
}
.search-suggestions .primary {
  color: #111827;
  font-size: 14px;
  line-height: 1.2;
}
.search-suggestions .secondary {
  color: #6b7280;
  font-size: 12px;
  white-space: nowrap;
}

/* Bottom sheet */
.bottom-sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.25);
  transform: translateY(70%);
  transition: transform 260ms ease;
  z-index: 600;
}
.bottom-sheet.open { transform: translateY(0%); }
.handle {
  width: 48px;
  height: 5px;
  background: #d6d6d6;
  border-radius: 4px;
  margin: 10px auto 6px;
}
.sheet-content { padding: 8px 16px 16px; }
.sheet-content h3 { margin: 6px 0 8px; }
.sheet-content .muted { color: #6b7280; margin-bottom: 10px; }
.coords { display: flex; gap: 16px; margin-bottom: 12px; }
.coords small { color: #6b7280; display: block; }
.coords strong { font-size: 14px; }
.cta {
  width: 100%;
  background: #111827;
  color: #fff;
  border: none;
  height: 44px;
  border-radius: 10px;
  font-weight: 600;
}

/* Tweak Leaflet controls to be more modern */
:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18) !important;
  border-radius: 12px !important;
  overflow: hidden;
}
:deep(.leaflet-control-zoom a) {
  width: 40px !important;
  height: 40px !important;
  line-height: 40px !important;
}

.leaflet-control-attribution .leaflet-control-attribution, .leaflet-bottom .leaflet-right {
  display: none !important;
}

.leaflet-control-attribution, .leaflet-bottom .leaflet-right {
    display: none !important;
}

/* Ensure map tiles render crisp on dark bg */
/* :deep(.leaflet-container) {
  background: #0b0b0f;
} */

/* Ícone de pin do resultado da busca */
:deep(.search-pin-icon) {
  display: grid;
  place-items: center;
}
:deep(.search-pin-icon .pin-head) {
  width: 20px;
  height: 20px;
  background: #ef4444; /* red */
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 6px 14px rgba(239, 68, 68, 0.5);
}
:deep(.search-pin-icon .pin-tail) {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid #ef4444;
  margin-top: 2px;
}
:deep(.search-pin-icon .pin-shadow) {
  width: 28px;
  height: 8px;
  background: rgba(0,0,0,0.25);
  border-radius: 50%;
  margin-top: 4px;
  filter: blur(2px);
}
</style>