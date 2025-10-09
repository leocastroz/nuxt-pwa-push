<template>
  <div v-if="showStatus" class="session-status" :class="statusClass">
    <div class="status-content">
      <div class="status-icon">
        <svg v-if="isLoggedIn" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <div class="status-text">
        <div class="status-main">
          {{ isLoggedIn ? 'Logado' : 'Não logado' }}
          <span v-if="isPWA" class="pwa-badge">PWA</span>
        </div>
        <div v-if="userProfile" class="status-details">
          {{ userProfile.email }}
        </div>
        <div v-if="isPWA && isLoggedIn" class="status-details">
          🔒 Sessão mantida no PWA
        </div>
      </div>
      
      <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const { 
  isLoggedIn, 
  userProfile, 
  isPWA, 
  logout 
} = useAuth()

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    default: 'top-right', // top-right, top-left, bottom-right, bottom-left
    validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(value)
  }
})

// Estado local
const showStatus = computed(() => props.show)

// Classes CSS dinâmicas
const statusClass = computed(() => ({
  'logged-in': isLoggedIn.value,
  'logged-out': !isLoggedIn.value,
  'is-pwa': isPWA.value,
  [`position-${props.position}`]: true
}))

// Logout
const handleLogout = async () => {
  if (confirm('Deseja realmente sair?')) {
    await logout()
  }
}
</script>

<style scoped>
.session-status {
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  padding: 12px;
  min-width: 200px;
  max-width: 300px;
  transition: all 0.3s ease;
}

/* Posicionamento */
.position-top-right {
  top: 20px;
  right: 20px;
}

.position-top-left {
  top: 20px;
  left: 20px;
}

.position-bottom-right {
  bottom: 20px;
  right: 20px;
}

.position-bottom-left {
  bottom: 20px;
  left: 20px;
}

/* Estados */
.logged-in {
  border-left: 4px solid #10b981;
}

.logged-out {
  border-left: 4px solid #ef4444;
}

.is-pwa {
  background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%);
}

.status-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.status-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.logged-in .status-icon {
  color: #10b981;
}

.logged-out .status-icon {
  color: #ef4444;
}

.status-text {
  flex: 1;
  min-width: 0;
}

.status-main {
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.pwa-badge {
  background: #3b82f6;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.status-details {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
  word-break: break-word;
}

.logout-btn {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

/* Responsivo */
@media (max-width: 768px) {
  .session-status {
    position: relative;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    margin: 10px;
    width: calc(100% - 20px);
    max-width: none;
  }
}

/* Animação de entrada */
@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.session-status {
  animation: slideIn 0.3s ease-out;
}
</style>