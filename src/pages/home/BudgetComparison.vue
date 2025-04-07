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
const remain = ref(80000)

// const used = props.budget - props.remain
// const percent = Math.round((props.remain / props.budget) * 100)

const used = budget.value - remain.value
const percent = Math.round((remain.value / budget.value) * 100)

const chartData = {
  labels: ['남은 금액', '사용한 금액'],
  datasets: [
    {
      data: [remain.value, budget.value],
      backgroundColor: ['#ffffff', '#61905a'],
      borderWidth: 0,
    },
  ],
}

const chartOptions = {
  responsive: true,
  cutout: '70%',
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
  <div class="card mb-3 rounded-4" style="max-width: 540px">
    <div class="row g-0 align-items-center">
      <!-- 도넛 차트 넣어야함 -->
      <div class="col-md-4 d-flex justify-content-center align-items-center">
        <div class="donut-container">
          <Doughnut :data="chartData" :options="chartOptions" />
          <img class="donut-image" src="/src/assets/images/income/bonus.png" />
        </div>
      </div>

      <!-- text -->
      <div class="col-md-8">
        <div class="card-body">
          <!-- 예산 -->
          <div class="line">
            <span class="label">예산</span>
            <span class="value">{{ budget }}</span>
          </div>
          <!-- 남음 -->
          <div class="line">
            <span class="label">남음</span>
            <span class="value">{{ remain }}</span>
          </div>
          <!-- 퍼센트 -->
          <div class="line" id="percent">
            <span class="label">퍼센트</span>
            <span class="value">{{ percent }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donut-container {
  position: relative;
  width: 100px;
  height: 100px;
}
.donut-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.label {
  text-align: left;
  font-weight: bold;
  flex: 1;
}
.value {
  text-align: right;
  flex: 1;
  color: #90c569;
}
</style>
