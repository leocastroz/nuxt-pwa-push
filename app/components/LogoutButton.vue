<template>
  <button @click="onClick" :disabled="loading" class="btn-logout">
    <span v-if="!loading">Sair</span>
    <span v-else>Saindo...</span>
  </button>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthUser } from '~/composables/useAuthUser'

const loading = ref(false)
const { logout } = useAuthUser()

const onClick = async () => {
  loading.value = true
  try {
    await logout()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.btn-logout {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
