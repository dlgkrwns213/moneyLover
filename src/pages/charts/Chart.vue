<template>
  <div class="main-page">
    <header class="chart-header">
      <div class="fixed-header">
        <div class="header-title">4월</div>
        <div class="tab-buttons">
          <span :class="['tab', { active: tab === 'expense' }]" @click="tab = 'expense'">지출</span>
          <span :class="['tab', { active: tab === 'income' }]" @click="tab = 'income'">수입</span>
        </div>
      </div>
    </header>

    <div class="tab-content">
      <Expense v-if="tab === 'expense'" />
      <Income v-else-if="tab === 'income'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Expense from '@/pages/charts/expense/Expense.vue'
import Income from '@/pages/charts/income/Income.vue'

const tab = ref('expense')
</script>

<style scoped>
.main-page {
  width: 100%;
  max-width: 360px;
  height: 100vh;
  margin: auto;
  padding-top: 110px;
}
.chart-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #f6f6f6;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}

.fixed-header {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  font-family: 'MyFontBold';
  margin-bottom: 26px;
}

.tab-buttons {
  display: flex;
  width: 100%;
  justify-content: space-around;
  font-weight: bold;
  font-family: 'MyFontBold';
}
.tab {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  position: relative;
  padding-bottom: 6px;
}

.tab.active {
  color: #61905a;
}

.tab.active::after {
  display: none;
}
.tab-content {
  height: calc(100vh - 65px);
  overflow-y: auto;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.tab-content::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
</style>
