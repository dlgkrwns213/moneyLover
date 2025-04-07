<!-- 담당자: 예빈 -->
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  budget: Number,
  remain: Number,
})

const budget = ref(200000)
const remain = ref(180000)

// const used = props.budget - props.remain
// const percent = Math.round((props.remain / props.budget) * 100)

const used = budget.value - remain.value
const percent = Math.round((remain.value / budget.value) * 100)

const chartData = {
  labels: ['사용한 금액', '남은 금액'],
  datasets: [
    {
      data: [used, remain.value],
      backgroundColor: ['#ffffff', '#61905a'],
      borderWidth: 0,
    },
  ],
}

const chartOptions = {
  responsive: true,
  cutout: '85%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.raw}원`,
      },
    },
  },
}
</script>

<template>
  <div class="page-wrapper">
    <div class="donut-row">
      <!-- 왼쪽: 도넛 + 이미지 -->
      <div class="donut-container">
        <Doughnut :data="chartData" :options="chartOptions" />
        <img class="donut-image" src="/src/assets/images/clover/clover_default.png" />
      </div>

      <!-- 오른쪽: 텍스트 -->
      <div class="info">
        <div class="line">
          <span class="label">예산</span>
          <span class="value">{{ budget.toLocaleString() }}</span>
        </div>
        <div class="line">
          <span class="label">남음</span>
          <span class="value">{{ remain.toLocaleString() }}</span>
        </div>
        <div class="line">
          <span class="label">%</span>
          <span class="value">{{ percent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donut-row {
  display: flex;
  align-items: center;
  /* padding: 16px; */
  background-color: #f6f6f6;
  border-radius: 16px;
  width: 360px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
}

.donut-container {
  position: relative;
  width: 214px;
  height: 100px;
  flex-shrink: 0;
}

.donut-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-164%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: contain;
  z-index: 1;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0;
  font-family: 'MyFont';
}

.line {
  display: flex;
  justify-content: space-between;
}

.label {
  padding: 10px;
  font-weight: bold;
  color: #444;
  flex: 1;
}

.value {
  padding: 10px;
  text-align: right;
  flex: 1;
  color: #61905a;
}

.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
