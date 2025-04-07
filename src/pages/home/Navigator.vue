<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { setEntryFromPath } from '@/utils/navigation';

const router = useRouter();
const route = useRoute();

function handlePlusClick() {
  setEntryFromPath(route.fullPath);
  router.push('/add/outcome');
}

</script>

<template>
  <nav class="bottom-nav">
    <RouterLink to="/" class="nav-item">
      <img src="@/assets/images/navigator/footer_home.png" alt="홈" />
      <span>홈</span>
    </RouterLink>
    <RouterLink to="/chart" class="nav-item">
      <img src="@/assets/images/navigator/footer_chart.png" alt="보고서" />
      <span>보고서</span>
    </RouterLink>

    <div class="nav-item" @click="handlePlusClick">
      <img 
        src="@/assets/images/navigator/footer_plus.png" 
        alt="더하기" 
        style="width: 48px; height: 48px;"
      />
    </div>

    <RouterLink to="/saving" class="nav-item">
      <img src="@/assets/images/navigator/footer_bank.png" alt="저축" />
      <span>저축</span>
    </RouterLink>
    <RouterLink to="/settings" class="nav-item">
      <img src="@/assets/images/navigator/footer_setting.png" alt="설정" />
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
