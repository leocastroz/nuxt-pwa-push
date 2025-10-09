<template>
  <div>
    <h1>Configurações</h1>
    <p>Gerencie suas configurações aqui.</p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
});
</script>