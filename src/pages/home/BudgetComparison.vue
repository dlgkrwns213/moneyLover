<!-- 담당자: 예빈 -->
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useRouter } from 'vue-router'
import { useBudgetStore } from '@/stores/budget'
import axios from 'axios'

const budgetStore = useBudgetStore()
const budget = computed(() => budgetStore.budget)
const router = useRouter()

const goToCalendar = () => {
  router.push('/home/calendar')
}

const goToBudgetSettings = () => {
  router.push('/budgetSetting')
}
const goToSearch = () => {
  router.push('/SearchFilter')
}

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  budget: Number,
  remain: Number,
})

const cashflows = ref([])
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/cashflows')
    cashflows.value = response.data
  } catch (error) {
    console.error('데이터 불러오기 실패', error)
  }
})
const totalOutcome = computed(() => {
  return cashflows.value
    .filter((item) => item.cashflowType === false)
    .reduce((sum, item) => sum + item.cashflowValue, 0)
})
const remain = computed(() => budget.value - totalOutcome.value)
const imageurls = [
  '/src/assets/images/clover/clover_0.png',
  '/src/assets/images/clover/clover_25.png',
  '/src/assets/images/clover/clover_50.png',
  '/src/assets/images/clover/clover_75.png',
  '/src/assets/images/clover/clover_default.png',
]
const cloverImageUrl = computed(() => {
  if (percent.value <= 0) return imageurls[0]
  if (percent.value <= 25) return imageurls[1]
  if (percent.value <= 50) return imageurls[2]
  if (percent.value <= 75) return imageurls[3]
  return imageurls[4]
})

const used = computed(() => budget.value - remain.value)
const percent = computed(() => Math.round((remain.value / budget.value) * 100))

const chartData = computed(() => ({
  labels: ['사용한 금액', '남은 금액'],
  datasets: [
    {
      data: [used.value, remain.value < 0 ? 0 : remain.value],
      backgroundColor: ['#ffffff', '#61905a'],
      borderWidth: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  cutout: '85%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
      callbacks: {
        label: (context) => `${context.label}: ${context.raw}원`,
      },
    },
    datalabels: {
      display: false,
    },
  },
}
</script>

<template>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  />

  <!-- Bootstrap Icons -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    rel="stylesheet"
  />
  <div class="header">
    <span class="icon" @click="goToCalendar">
      <i class="fa-solid fa-calendar-days icon-img"></i>
    </span>
    <span class="menu-budgetsetting">예산설정</span>
    <span class="icon" @click="goToSearch">
      <i class="bi bi-search"></i>
    </span>
  </div>
  <div class="page-wrapper" @click="goToBudgetSettings">
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
          <span class="value">{{ remain < 0 ? '예산초과!' : remain.toLocaleString() }}</span>
        </div>
        <div class="line">
          <span class="label">%</span>
          <span class="value">{{ percent < 0 ? '예산초과!' : percent.toLocaleString() }}%</span>
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
              >목표 예산을 정해두면 <br />충동적인 소비를 줄일 수 <br />있습니다! :)
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 100px;
  flex-shrink: 0;
  cursor: pointer;
}

/* .donut-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-170%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: contain;
  z-index: 1;
} */

.donut-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: contain;
  z-index: 1;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin-right: 0;
  font-family: 'MyFont';
  flex: 1;
}

.line {
  display: flex;
  justify-content: space-between;
}

.label {
  padding: 10px;
  font-size: 16px;
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
.empty-budget {
  cursor: pointer;
}

.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f6f6f6;
  cursor: pointer;
  font-family: 'MyFont';
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 360px;
  height: 50px;
  padding: 0 10px;
  background-color: #f6f6f6;
  border-bottom: 1px solid #f6f6f6;
  margin: 0 auto;
  font-family: 'MyFontbold';
}

.icon {
  width: 24px;
  text-align: center;
}

.icon-img:hover {
  cursor: pointer;
}

.bi-x {
  font-size: 40px;
  visibility: hidden;
  color: #444;
}

.menu-budgetsetting {
  text-align: center;
  font-family: 'MyFontBold';
  font-size: 20px;
  color: #444;
}

.bi-search {
  font-family: 'MyFontBold';
  font-size: 20px;
  color: #444;
  cursor: pointer;
}
</style>
