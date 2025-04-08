<template>
  <div class="expense-wrap">
    <span></span>
    <template v-if="hasData">
      <div class="expense-ranking">
        <span class="top-text">분류 순위</span>
        <div class="chart-container">
          <IncomeChart />
        </div>
        <IncomeList />
      </div>
      <div class="expense-single-amount">
        <div class="top-text">
          <span>단일 금액 순위</span>
          <span>Top 10</span>
        </div>
        <IncomeSingleAmount />
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
import IncomeChart from '@/pages/charts/income/IncomeChart.vue'
import IncomeList from '@/pages/charts/income/IncomeList.vue'
import IncomeSingleAmount from '@/pages/charts/income/IncomeSingleAmount.vue'

const hasData = ref(false)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/cashflows?cashflowType=true')
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
  padding: 25px;
}
.expense-ranking {
  border: 1px solid #61905a;
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
  border: 1px solid #61905a;
  margin-top: 30px;
  border-radius: 12px;
  letter-spacing: -5%;
  padding: 5px;
  background-color: white;
}
.top-text {
  display: flex;
  font-size: 15px;
  font-weight: bold;
  font-family: 'MyFontBold';
  justify-content: space-between;
  padding: 0 10px;
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
