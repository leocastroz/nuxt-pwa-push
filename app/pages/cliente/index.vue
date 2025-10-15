<template>
  <div>

    

    <div style="background-color: red;padding: 20px;margin: 40px 20px;">
      Transporte personalizado (Viagem)
    </div>

    <div style="background-color: red;padding: 20px;margin: 40px 20px;">
      Transporte personalizado (Entregas)
    </div>


    <div style="background-color: red;padding: 20px;margin: 40px 20px;">
      Minhas Corridas realizadas
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashcliente',
  ssr: false
})

</script>

<style scoped>
.map-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 56px); /* leave room for a header if layout has one */
  overflow: hidden;
  background: #0b0b0f;
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

.leaflet-control-attribution .leaflet-control-attribution {
  display: none;
}

/* Ensure map tiles render crisp on dark bg */
/* :deep(.leaflet-container) {
  background: #0b0b0f;
} */
</style>