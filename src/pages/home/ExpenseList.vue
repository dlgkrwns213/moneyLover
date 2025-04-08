<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { TRANSLATIONS } from '@/constants/translate'

const cashflows = ref([])
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/cashflows')
    cashflows.value = response.data
  } catch (error) {
    console.error('Error fetching cashflows:', error)
  }
})

const sortedCashflows = computed(() => {
  return [...cashflows.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const getCategorykey = (koreanCategory) => {
  const entry = Object.entries(TRANSLATIONS).find(([_, value]) => value === koreanCategory)
  return entry ? entry[0] : null
}

const getIconPath = (koreanCategory) => {
  const key = getCategorykey(koreanCategory)
  return key ? `/src/assets/images/all/${key}.png` : '/all/bonus.png'
}

const deleteCashflow = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/cashflows/${id}`)
    cashflows.value = cashflows.value.filter((item) => item.id !== id)
  } catch (error) {
    console.error('삭제 중 오류발생:', error)
  }
}
</script>

<template>
  <div class="expense-list">
    <div v-for="(item, index) in sortedCashflows" :key="item.id">
      <div class="expense-header">
        <span class="date">{{ item.date }}</span>
        <span class="delete" @click="deleteCashflow(item.id)">삭제🗑</span>
        <span class="amount" :class="item.cashflowType ? 'income' : 'expense'">
          {{ item.cashflowType ? '+' : '-' }}{{ item.cashflowValue.toLocaleString() }}원
        </span>
      </div>

      <div class="expense-item">
        <div class="expense-content">
          <div class="icon">
            <img :src="getIconPath(item.category)" alt="카테고리 아이콘" class="category-icon" />
          </div>
          <div class="info">
            <div class="title">{{ item.cashflowName }}</div>
            <div class="category">{{ item.category || '카테고리 없음' }}</div>
          </div>
          <div class="value">
            {{ item.cashflowType ? '+' : '-' }}{{ item.cashflowValue.toLocaleString() }}원
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expense-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
  font-family: 'MyFontBold';
}

.expense-item {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 10px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid green;
}

.expense-header {
  display: flex;
  /* justify-content: space-between; */
  align-items: left;
  font-size: 12px;
  color: black;
  padding: 4px 6px;
  margin-bottom: 4px;
}
.category-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  /* padding-right: 50px; */
}

.amount.income {
  color: #61905a;
}

.amount.expense {
  color: #e35050;
}

.expense-content {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  font-size: 20px;
  margin-right: 10px;
  background-color: #f0f0f0;
  margin-right: 14px;
  margin-left: 6px;
}

.info {
  flex-grow: 1;
}

.title {
  font-weight: bold;
}

.category {
  font-size: 12px;
  color: #61905a;
}

.value {
  font-weight: bold;
  color: #333;
}

.delete {
  margin-left: 10px;
  color: #e35050;
  cursor: pointer;
}
.amount {
  margin-left: auto;
}
</style>
