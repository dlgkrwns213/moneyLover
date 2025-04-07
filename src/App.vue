<script setup>
import Navigator from './pages/home/Navigator.vue'
</script>

<template>
  <RouterView />
  <Navigator />
</template>

<style scoped>
@font-face {
  font-family: 'MyFontBold';
  src: url('/src/assets/fonts/Cafe24Ssurround-v2.0.ttf') format('truetype');
}
@font-face {
  font-family: 'MyFont';
  src: url('/src/assets/fonts/Cafe24SsurroundAir-v1.1.ttf') format('truetype');
}
</style>
