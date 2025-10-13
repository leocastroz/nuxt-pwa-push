<template>
  <div class="user-badge" @click="goProfile" role="button" :aria-label="`Perfil de ${profile.name}`">
    <img :src="profile.avatarUrl" :alt="profile.name" class="avatar" />
    <div class="info">
      <span class="name">{{ profile.name }}</span>
      <span v-if="profile.email" class="email">{{ profile.email }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthUser } from '~/composables/useAuthUser'

const { profile } = useAuthUser()

const goProfile = () => {
  navigateTo('/perfilusuario')
}
</script>
<!-- 
<style scoped>
.user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
}
.user-badge:hover {
  background: rgba(255, 255, 255, 0.15);
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.6);
}
.info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.name {
  font-weight: 600;
  color: #fff;
}
.email {
  font-size: 12px;
  color: rgba(255,255,255,0.85);
}
</style> -->
