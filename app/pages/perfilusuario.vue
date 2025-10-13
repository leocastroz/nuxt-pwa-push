<template>
  <div class="profile-page">
    <header class="profile-header">
      <img :src="profile.avatarUrl" alt="Avatar" class="avatar" />
      <div class="meta">
        <h1>{{ profile.name }}</h1>
        <p v-if="profile.email">{{ profile.email }}</p>
      </div>
    </header>

    <section class="profile-content">
      <h2>Dados da Conta</h2>
      <ul>
        <li><strong>ID:</strong> {{ profile.id }}</li>
        <li><strong>Email:</strong> {{ profile.email || '—' }}</li>
      </ul>

      <div class="actions">
        <LogoutButton />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthUser } from '~/composables/useAuthUser'
import LogoutButton from '~/components/LogoutButton.vue'

definePageMeta({
  middleware: ['auth']
})

const { profile } = useAuthUser()
</script>
<!-- 
<style scoped>
.profile-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.profile-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
}
.meta h1 {
  margin: 0;
  font-size: 1.5rem;
}
.meta p {
  margin: 4px 0 0;
  color: #666;
}
.profile-content h2 {
  margin-top: 0;
}
.actions {
  margin-top: 24px;
}
</style> -->
