<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink to="/" class="nav-item">
      <img src="#" alt="홈" />
      <span>홈</span>
    </RouterLink>
    <RouterLink to="/chart" class="nav-item">
      <img src="#" alt="보고서" />
      <span>보고서</span>
    </RouterLink>

    <RouterLink to="/add" class="add-button">
      <div class="plus-icon">+</div>
    </RouterLink>

    <RouterLink to="/saving" class="nav-item">
      <img src="#" alt="저축" />
      <span>저축</span>
    </RouterLink>
    <RouterLink to="/settings" class="nav-item">
      <img src="#" alt="설정" />
      <span>설정</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;

  max-width: 1280px;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #444;
  text-decoration: none;
}

.nav-item img {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
}

.add-button {
  position: relative;
  top: -20px;
  background-color: white;
  border-radius: 50%;
  padding: 10px;
}

.plus-icon {
  width: 50px;
  height: 50px;
  background-color: #4caf50;
  border-radius: 50%;
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
