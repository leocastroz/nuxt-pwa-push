<template>
  <div>
    <h1>language</h1>
    <p>Bem-vindo à sua language!</p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
});
</script>