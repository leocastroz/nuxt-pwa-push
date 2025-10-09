<template>
  <div>
    <h1>preferencias</h1>
    <p>Bem-vindo à sua preferencias!</p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
});
</script>