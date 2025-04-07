<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

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
</script>

<template>
  <div class="expense-list">
    <div v-for="(item, index) in sortedCashflows" :key="item.id">
      <div class="expense-header">
        <span class="date">{{ item.date }}</span>
        <span class="delete">삭제🗑</span>
        <span class="amount" :class="item.cashflowType ? 'income' : 'expense'">
          {{ item.cashflowType ? '+' : '-' }}{{ item.cashflowValue.toLocaleString() }}원
        </span>
      </div>

      <div class="expense-item">
        <div class="expense-content">
          <div class="icon">
            <!-- 여기에 나중에 카테고리별 아이콘 매핑 -->
            📦
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
  width: 350px;
  font-family: 'MyFont';
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
  color: #black;
  padding: 4px 6px;
  margin-bottom: 4px;
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
  font-size: 20px;
  margin-right: 10px;
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
}
.amount {
  margin-left: auto;
}
</style>
