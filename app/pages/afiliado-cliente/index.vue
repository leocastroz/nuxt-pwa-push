<template>
  <div class="map-page">
    <!-- Full-bleed map container -->
    <div ref="mapEl" class="map-view" />

   
  <!-- Exibimos apenas sua localização em tempo real no mapa -->

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
const geoWatchId = ref<number | null>(null)
// Apenas a localização do usuário

// State
const sheetOpen = ref(true)
const center = ref({ lat: -23.55052, lng: -46.633308 }) // São Paulo default
const userPosition = ref<{ lat: number; lng: number } | null>(null)

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
    userMarker.value.bindPopup(`Você está aqui<br/>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}`)
    // Abre o popup na primeira criação
    userMarker.value.openPopup()
  } else {
    userMarker.value.setLatLng([lat, lng])
    userMarker.value.setPopupContent(`Você está aqui<br/>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}`)
  }
  userPosition.value = { lat, lng }
}

function createUserPinIcon() {
  return L.divIcon({
    className: 'user-pin-icon',
    html: '<div class="pin"><div class="pin-head"></div><div class="pin-tail"></div></div><div class="pin-shadow"></div>',
    iconSize: [30, 44],
    iconAnchor: [15, 40] // ponta do pin
  })
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

onMounted(() => {
  if (mapEl.value) initMap(mapEl.value)
})

onBeforeUnmount(() => {
  map.value?.remove()
  if (geoWatchId.value !== null) {
    navigator.geolocation.clearWatch(geoWatchId.value)
  }
})

</script>

<style scoped>
.map-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
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
  right: 12px;
  bottom: 180px;
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
</style>