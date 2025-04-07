<!-- 담당자: 예빈 -->
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToBudgetSettings = () => {
  router.push('/budgetSetting')
}
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  budget: Number,
  remain: Number,
})

const budget = ref(0)
const remain = ref(150000)
const imageurls = [
  '/src/assets/images/clover/clover_0.png',
  '/src/assets/images/clover/clover_25.png',
  '/src/assets/images/clover/clover_50.png',
  '/src/assets/images/clover/clover_75.png',
  '/src/assets/images/clover/clover_default.png',
]
const cloverImageUrl = computed(() => {
  if (percent === 0) return imageurls[0]
  if (percent <= 25) return imageurls[1]
  if (percent <= 50) return imageurls[2]
  if (percent <= 75) return imageurls[3]
  return imageurls[4]
})

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
    <!-- v-id 에 true false 로 budget 설정 여부를 분별하여 다른 창을 띄운다. -->
    <div v-if="budget" class="donut-row">
      <!-- 왼쪽: 도넛 + 이미지 -->
      <div class="donut-container">
        <Doughnut :data="chartData" :options="chartOptions" />
        <img class="donut-image" :src="cloverImageUrl" />
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

    <!-- budget 을 설정하지 않은 경우 -->
    <div v-else class="empty-budget" @click="goToBudgetSettings">
      <div class="other-donut-row">
        <div class="donut-container">
          <img class="other-image" src="/src/assets/images/clover/clover_default.png" />
        </div>
        <div class="info">
          <div class="line">
            <span class="label"
              >목표 예산을 정해두면 <br />충동적인 소비를 줄일 수 있습니다! :)
            </span>
          </div>
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
  height: 200px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
}
.other-donut-row {
  display: flex;
  align-items: center;
  /* padding: 16px; */
  background-color: rgb(255, 255, 255);
  border-radius: 16px;
  width: 360px;
  height: 200px;
  box-shadow: 0 0 5px rgba(87, 87, 87, 0.05);
}

.other-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 100px;
  border-radius: 50%;
  object-fit: contain;
  z-index: 1;
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
  transform: translate(-170%, -50%);
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
  color: #f6f6f6;
}
</style>
