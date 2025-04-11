<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { setEntryFromPath } from '@/utils/navigation'
import footerChart from '@/assets/images/navigator/footer_chart.png'
import footerColorChart from '@/assets/images/navigator/footer_color_chart.png'
import footerHome from '@/assets/images/navigator/footer_home.png'
import footerColorHome from '@/assets/images/navigator/footer_color_home.png'
import footerSaving from '@/assets/images/navigator/footer_saving.png'
import footerColorSaving from '@/assets/images/navigator/footer_color_saving.png'
import footerSetting from '@/assets/images/navigator/footer_setting.png'
import footerColorSetting from '@/assets/images/navigator/footer_color_setting.png'

const router = useRouter()
const route = useRoute()

function handlePlusClick() {
  setEntryFromPath(route.fullPath)
  router.push('/add/outcome')
}

const isActive = (path) => route.path === path

const iconMap = {
  chart: { active: footerColorChart, default: footerChart },
  home: { active: footerColorHome, default: footerHome },
  saving: { active: footerColorSaving, default: footerSaving },
  setting: { active: footerColorSetting, default: footerSetting }
}

const getIconSrc = (path, baseName) => {
  return isActive(path) ? iconMap[baseName].active : iconMap[baseName].default
}

const getTextClass = (path) => (isActive(path) ? 'text-bold' : '')
</script>

<template>
  <div style="background-color: white;">
    <nav class="bottom-nav">
      <RouterLink to="/" class="nav-item">
        <img :src="getIconSrc('/', 'home')" alt="홈" />
        <span :class="getTextClass('/')">홈</span>
      </RouterLink>
      <RouterLink to="/chart" class="nav-item">
        <img :src="getIconSrc('/chart', 'chart')" alt="보고서" />
        <span :class="getTextClass('/chart')">보고서</span>
      </RouterLink>

      <div class="nav-item" @click="handlePlusClick">
        <img
          src="@/assets/images/navigator/footer_plus.png"
          alt="더하기"
          style="width: 48px; height: 48px"
        />
      </div>

      <RouterLink to="/saving" class="nav-item">
        <img :src="getIconSrc('/saving', 'saving')" alt="저축" />
        <span :class="getTextClass('/saving')">저축</span>
      </RouterLink>

      <RouterLink to="/settings" class="nav-item">
        <img :src="getIconSrc('/settings', 'setting')" alt="설정" />
        <span :class="getTextClass('/settings')">설정</span>
      </RouterLink>
    </nav>
  </div>
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
  font-family: Myfont;
  font-size: 12px;
  color: #444;
  text-decoration: none;
  background-color: transparent;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  opacity: 1;
}

.nav-item:hover img {
  transform: scale(1.1);
  transition: transform 0.2s ease;
  cursor: pointer;
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
  background-color: #79AC61;
  border-radius: 50%;
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.text-bold{
  font-family: "MyfontBold";
}
</style>
