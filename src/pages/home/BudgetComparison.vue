<!-- 담당자: 예빈 -->
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useRouter } from 'vue-router'
import { useBudgetStore } from '@/stores/budget'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const budgetStore = useBudgetStore()
const budget = computed(() => budgetStore.budget)
const router = useRouter()
const userStore = useUserStore()

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
    const response = await axios.get('http://localhost:3000/cashflows', {
      params: {
        userId: userStore.userId, // user.js에서 정의한 userId 사용
      },
    })
    cashflows.value = response.data
  } catch (error) {
    console.error('데이터 불러오기 실패', error)
  }
})
const totalOutcome = computed(() => {
  return cashflows.value
    .filter((item) => item.cashflowType === false && item.includeInBudget)
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
      <img src="@/assets/images/all/calendar.png" alt="달력 아이콘" class="icon-img" />
    </span>
    <!-- <span class="menu-budgetsetting">moneyLover</span> -->
    <span class="menu-logo">
      <img src="@/assets/images/all/logo.png" alt="로고" class="logo-img" />
    </span>
    <span class="icon" @click="goToSearch">
      <i class="bi bi-search"></i>
    </span>
  </div>

  <!-- 변경 창 부분 -->
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
          <span class="label">이번 달 예산은</span>
          <span class="value">{{ budget.toLocaleString() + '원' }}</span>
        </div>
        <div class="line">
          <span class="label">남아 있는 돈은</span>
          <span class="value" :class="{ 'over-budget': percent < 0 }">{{
            remain < 0 ? '예산초과!' : remain.toLocaleString() + '원'
          }}</span>
        </div>
        <div class="line">
          <span class="label">아껴 쓴 정도는</span>
          <span class="value" :class="{ 'over-budget': percent < 0 }">{{
            percent < 0 ? '예산초과!' : percent.toLocaleString() + '%'
          }}</span>
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
  background-color: #ffffff;
  /* border: 1px solid #61905a; */
  border-radius: 12px;
  width: 330px;
  height: 270px;
  flex-direction: column;
  /* box-shadow: 0 0 5px rgba(0, 0, 0, 0.05); */
  padding-top: 5px;
  gap: 10px;
}
.other-donut-row {
  display: flex;
  align-items: center;
  /* padding: 16px; */
  background-color: rgb(255, 255, 255);
  border-radius: 12px;
  width: 340px;
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
  width: 130px;
  height: 130px;
  flex-shrink: 0;
  cursor: pointer;
  margin-left: 10px 0;
  margin-top: 10px;
}

.donut-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: contain;
  z-index: 1;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  margin-right: 0;
  font-family: 'MyFont';
  flex: 1;
  width: 100%;
}

.line {
  display: flex;
  justify-content: space-between;
  width: 80%;
  align-items: center;
  margin-bottom: -7px;
}

.label {
  padding: 2px;
  font-size: 16px;
  text-align: left;
  color: #444;
  flex: 1;
  letter-spacing: -0.05em;
}

.over-budget {
  font-size: 13px;
  color: #d9534f;
  font-weight: bold;
}

.value {
  padding: 10px;
  text-align: right;
  flex: 1;
  color: #61905a;
  /* margin-right: 1rem; */
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
}

.icon {
  width: 24px;
  text-align: center;
}

.icon-img {
  width: 29px;
  height: 29px;
  transform: scaleX(-1); /* 좌우반전 */
  object-fit: contain;
  cursor: pointer;
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

.menu-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex: 1;
}

.logo-img {
  height: 26px;
  object-fit: contain;
}
</style>
