<template>
  <div class="expense-wrap">
    <template v-if="hasData">
      <div class="expense-ranking">
        <span style="font-size: 15px; font-weight: bold">분류 순위</span>
        <div class="chart-container">
          <Chart />
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
        <!-- <img src="" alt="데이터 없음" /> -->
        <p>데이터가 없습니다.</p>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Chart from '@/components/chart.vue';
import ExpenseList from '@/components/ExpenseList.vue';
import ExpenseSingleAmount from '@/components/ExpenseSingleAmount.vue';

const hasData = ref(false);

onMounted(async () => {
  try {
    const res = await axios.get(
      'http://localhost:3000/cashflows?cashflowType=false'
    );
    hasData.value = res.data.length > 0;
  } catch (error) {
    hasData.value = false;
  }
});
</script>
<style scoped>
.expense-wrap {
  width: 100%;
  max-width: 360px;
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
  justify-content: space-between;
  padding: 0 10px;
}
</style>
