<!-- 담당 박예빈: BudgetComparison 과 ExpenseList 를 합친 홈화면 작업중. -->
<!-- 두 페이지를 합친 홈 화면은 월 지출과 월 수입 표시도 보여줍니다.(기본 홈) -->

<script setup>
import BudgetComparison from './BudgetComparison.vue'
import ExpenseList from './ExpenseList.vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const cashflows = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/cashflows')
    cashflows.value = response.data
  } catch (error) {
    console.error('cashflow 불러오기 실패'.error)
  }
})
const totalIncome = computed(() =>
  cashflows.value
    .filter((item) => item.cashflowType === true)
    .reduce((sum, item) => sum + item.cashflowValue, 0),
)

const totalExpense = computed(() =>
  cashflows.value
    .filter((item) => item.cashflowType === false)
    .reduce((sum, item) => sum + item.cashflowValue, 0),
)

const formatCurrency = (value) => '₩' + value.toLocaleString('ko-KR')
</script>

<template>
  <div class="home-container">
    <div class="section">
      <BudgetComparison />
    </div>
    <div class="income-expense-row">
      <div class="stat-card expense">
        <div class="label">월 지출</div>
        <div class="amount">{{ formatCurrency(totalExpense) }}</div>
      </div>
      <div class="stat-card income">
        <div class="label">월 수입</div>
        <div class="amount">{{ formatCurrency(totalIncome) }}</div>
      </div>
    </div>
    <div class="list-section scrollable-list">
      <div class="list-section">
        <ExpenseList />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 5px 16px;
  background-color: #f6f6f6;
  min-height: 100vh;
}

.section {
  width: 100%;
  max-width: 400px;
}

.income-expense-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  width: 100%;
  max-width: 340px;
}

.stat-card {
  flex: 1;
  background-color: white;
  border: 2px solid #61905a;
  border-radius: 12px;
  padding: 12px;
  max-width: 340px;
  text-align: center;
  font-family: 'MyFont';
}

.stat-card.expense {
  border-color: #cc4444;
  color: rgb(3, 3, 3);
}

.stat-card.income {
  border-color: #61905a;
  color: rgb(0, 0, 0);
}

.label {
  font-size: 14px;
}

.amount {
  font-size: 18px;
  font-weight: bold;
}

.scrollable-list {
  height: 400px;
  overflow-y: auto;
  width: 100%;
  max-width: 350px;
  background-color: white;
  border-radius: 12px;
  padding: 8px;
  background-color: #f6f6f6;
  margin: 0 auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollable-list::-webkit-scrollbar {
  display: none;
}
</style>
