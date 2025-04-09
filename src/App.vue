<script setup>
import { useRoute } from 'vue-router'
import Navigator from './pages/home/Navigator.vue'
import './assets/main.css'

const route = useRoute()
</script>

<template>
  <div id="app" class="app-background">
    <RouterView />
    <Navigator v-if="!route.meta.hideNav" />
  </div>
</template>

<style>
@font-face {
  font-family: 'MyFontBold';
  src: url('/src/assets/fonts/Cafe24Ssurround-v2.0.ttf') format('truetype');
}
@font-face {
  font-family: 'MyFont';
  src: url('/src/assets/fonts/Cafe24SsurroundAir-v1.1.ttf') format('truetype');
}
.app-background {
  min-height: 100vh;
  background-color: #f6f6f6;
}
</style>
