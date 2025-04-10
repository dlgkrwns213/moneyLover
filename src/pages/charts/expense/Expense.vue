<template>
  <div class="expense-wrap">
    <template v-if="hasData">
      <div class="expense-ranking">
        <span class="top-text">분류 순위</span>
        <div class="chart-container">
          <ExpenseChart />
        </div>
        <ExpenseList />
      </div>
      <div class="expense-single-amount">
        <div class="top-text">
          <span>단일 금액 순위</span>
          <span>Top 10</span>
        </div>
        <ExpenseSingleAmount />
      </div>
    </template>

    <template v-else>
      <div class="no-data-container">
        <img src="/src/assets/images/clover/clover_default.png" alt="데이터 없음" />
        <p>아직 집계된 내역이 없습니다.</p>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ExpenseChart from '@/pages/charts/expense/ExpenseChart.vue'
import ExpenseList from '@/pages/charts/expense/ExpenseList.vue'
import ExpenseSingleAmount from '@/pages/charts/expense/ExpenseSingleAmount.vue'
import { useUserStore } from '@/stores/user'

const hasData = ref(false)
const userStore = useUserStore()

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/cashflows', {
      params: {
        userId: userStore.userId,
        cashflowType: false,
      },
    })
    hasData.value = res.data.length > 0
  } catch (error) {
    hasData.value = false
  }
})
</script>
<style scoped>
.expense-wrap {
  width: 100%;
  background-color: #f6f6f6;
  padding: 0 25px 25px 25px;
}
.expense-ranking {
  border: 1px solid white;
  border-radius: 12px;
  letter-spacing: -5%;
  padding: 5px;
  background-color: white;
}
.chart-container {
  display: flex;
  justify-content: center;
}
.expense-single-amount {
  border: 1px solid white;
  margin-top: 30px;
  border-radius: 12px;
  letter-spacing: -5%;
  padding: 5px;
  background-color: white;
}
.top-text {
  display: flex;
  font-size: 12px;
  font-family: 'MyFontBold';
  justify-content: space-between;
  padding: 10px 10px;
}
.no-data-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  gap: 25px;
  font-weight: bold;
  font-family: 'MyFontBold';
  text-align: center;
  margin-top: 50px;
}
img {
  width: 207px;
  height: 207px;
}
</style>
