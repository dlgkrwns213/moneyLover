<template>
  <div class="main-page">
    <div class="tab-buttons">
      <span :class="['tab', { active: tab === 'expense' }]" @click="tab = 'expense'">지출</span>
      <span :class="['tab', { active: tab === 'income' }]" @click="tab = 'income'">수입</span>
    </div>

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
  margin: auto;
  padding-top: 50px;
}
.tab-buttons {
  max-width: 360px;
  margin: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: right;
  gap: 30px;
  background-color: #f6f6f6;
  padding: 15px 10px;
  z-index: 1000;
  font-weight: bold;
  font-family: 'MyFontBold';
}

.tab {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  position: relative;
  padding-bottom: 6px;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  width: 100%;
  background-color: #ffd700; /* 노란색 */
  border-radius: 2px;
}
</style>
