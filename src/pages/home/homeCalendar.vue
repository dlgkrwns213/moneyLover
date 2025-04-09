<script setup>
import axios from 'axios'
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useUserStore } from '@/stores/user'
import { TRANSLATIONS } from '@/constants/translate'
import { useRouter } from 'vue-router'

// ✅ 사용자 정보 및 데이터 로드
const userStore = useUserStore()
const allCashflowData = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    const userId = userStore.userId || '1' || 'unknown'
    const res = await axios.get(`http://localhost:3000/cashflows?userId=${userId}`)
    allCashflowData.value = res.data
  } catch (error) {
    console.error('데이터 불러오기 실패', error)
  }
})

function goBack() {
  router.replace('/')
}

// ✅ 날짜 선택 관련
const selectedDate = ref('')
const newEvent = ref('')
const cashflows = ref([])

const today = new Date()
const innerSelectedDate = ref(today)
const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

function formatDateLocal(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDateWithWeekday(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' })
  return `${y}-${m}-${d} ${weekday}`
}

// 달력에서 일 하나를 눌렀을때 event 처리
function onDayClick(day) {
  innerSelectedDate.value = day.date
  const date = day.date
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const dateKey = `${y}-${m}-${d}`

  cashflows.value = monthlyData.value.filter((data) => data.date.startsWith(dateKey))
  console.log(cashflows.value)
}

const getCategorykey = (koreanCategory) => {
  const entry = Object.entries(TRANSLATIONS).find(([_, value]) => value === koreanCategory)
  return entry ? entry[0] : null
}

const getIconPath = (koreanCategory) => {
  const key = getCategorykey(koreanCategory)
  return key ? `/src/assets/images/all/${key}.png` : '/all/bonus.png'
}

const goToDetail = (id) => {
  router.push(`/transaction/${id}`)
}

const deleteCashflow = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/cashflows/${id}`)
    cashflows.value = cashflows.value.filter((item) => item.id !== id)
  } catch (error) {
    console.error('삭제 중 오류발생:', error)
  }
}

// 월간 데이터를 추적할 pages (페이지 네이션이나 뷰어 기반)
const pages = ref([{ year: today.getFullYear(), month: today.getMonth() + 1 }])
function onPagesUpdate(newPages) {
  pages.value = newPages
}

// 월별 데이터 계산
const monthlyData = computed(() => {
  const { year, month } = pages.value[0]
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`
  return allCashflowData.value.filter((data) => data.date.startsWith(yearMonth))
})

const monthlyIncome = ref(0)
const monthlyOutcome = ref(0)
watchEffect(() => {
  let income = 0
  let outcome = 0

  for (const data of monthlyData.value) {
    if (data.cashflowType) {
      income += data.cashflowValue
    } else {
      outcome += data.cashflowValue
    }
  }

  monthlyIncome.value = income
  monthlyOutcome.value = outcome
})

// ✅ 날짜별 attributes 설정
const attributes = computed(() => {
  // const mapByDate = {}

  // for (const data of monthlyData.value) {
  //   const dateKey = data.date.split(" ")[0] // yyyy-mm-dd
  //   if (!mapByDate[dateKey]) mapByDate[dateKey] = []

  //   mapByDate[dateKey].push({
  //     date: data.date,
  //     cashflowType: data.cashflowType,
  //     cashflowValue: data.cashflowValue
  //   })
  // }

  const mapByDateSum = {}

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() // 0-based

  // 해당 월의 총 일수 계산
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // 1일부터 말일까지 기본값 세팅
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateKey = formatDateLocal(date)
    mapByDateSum[dateKey] = { income: 0, outcome: 0 }
  }

  for (const data of monthlyData.value) {
    const dateKey = data.date.split(' ')[0] // yyyy-mm-dd
    if (data.cashflowType) {
      mapByDateSum[dateKey].income += data.cashflowValue
    } else {
      mapByDateSum[dateKey].outcome += data.cashflowValue
    }
  }

  return Object.entries(mapByDateSum).map(([date, items], i) => ({
    key: `date-${i}`,
    dates: date,
    content: {
      base: {
        color: [items.income, -items.outcome],
      },
    },
  }))
})

// 숫자 색상 클래스 반환
const getColorClass = (value) => {
  return value > 0 ? 'positive' : value < 0 ? 'negative' : 'zero'
}
</script>

<template>
  <div style="background-color: #f6f6f6">
    <button class="back-button" @click="goBack">
      <font-awesome-icon :icon="['fas', 'xmark']" class="xmark-icon" />
    </button>
  </div>
  <div class="container">
    <div class="calendar-wrapper">
    <!-- FullCalendar -->
    <v-calendar
      is-expanded
      :attributes="attributes"
      :max-date="maxDate"
      @update:pages="onPagesUpdate"
    >
      <!-- 날짜 안에 content (숫자) 표시 -->
      <template #day-content="{ day, attributes }">
        <div
          class="day-content"
          :class="{
            selected:
              innerSelectedDate && formatDateLocal(innerSelectedDate) === formatDateLocal(day.date),
            disabled: day.date > maxDate,
          }"
          @click="onDayClick(day)"
        >
          <span>{{ day.day }}</span>
          <template v-if="attributes[0]?.content?.base?.color">
            <span
              v-for="(num, index) in attributes[0].content.base.color"
              :key="index"
              :class="getColorClass(num)"
            >
              {{ num }}
            </span>
          </template>
          
        </div>
        
      </template>
    </v-calendar>

    <!-- 월 수입/지출/수익 요약 -->
    <div class="month-data">
      월 수입: <span style="color: #61905a">{{ monthlyIncome.toLocaleString('ko-KR') + '₩' }}</span
      ><br />
      월 지출: <span style="color: #e35050">{{ monthlyOutcome.toLocaleString('ko-KR') + '₩' }}</span
      ><br />
      월 수익:
      <span
        :style="{
          color:
            monthlyIncome - monthlyOutcome > 0
              ? '#61905A'
              : monthlyIncome - monthlyOutcome < 0
                ? '#E35050'
                : '#000000',
        }"
      >
        {{ (monthlyIncome - monthlyOutcome).toLocaleString('ko-KR') + '₩' }}
      </span>
    </div>
  </div>
    <!-- 📋 선택된 날짜의 상세 내역 -->
    <div class="event-panel">
      <h6>
        선택 날짜:
        <span class="selected-date">
          {{ formatDateWithWeekday(innerSelectedDate) }}요일
        </span>
      </h6>

      <div class="expense-list" v-if="cashflows.length">
        <div v-for="(item, index) in cashflows" :key="item.id">
          <div class="expense-item" @click="goToDetail(item.id)">
            <div class="expense-content">
              <div class="icon">
                <img
                  :src="getIconPath(item.category)"
                  alt="카테고리 아이콘"
                  class="category-icon"
                />
              </div>
              <div class="info">
                <div class="title">{{ item.cashflowName }}</div>
                <div class="category">{{ item.category || '카테고리 없음' }}</div>
              </div>
              <div class="value">
                <span :style="{ color: item.cashflowType ? '#61905A' : '#E35050' }">
                  {{ item.cashflowType ? '+' : '-' }}{{ item.cashflowValue.toLocaleString() }}원
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-else class="no-event">~ 기록이 없습니다 ~</p>
    </div>

  </div>
</template>

<style scoped>
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;

  border: none;
  padding: 0;
  background-color: #f6f6f6;
}

.back-button:hover {
  cursor: pointer;
}

.xmark-icon {
  font-size: 24px;
}

/* 기본 컨테이너 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px 20px 20px;
  font-family: 'MyFontBold';
  position: relative;
}

/* FullCalendar 날짜 스타일 */
:deep(.vc-day) {
  position: relative;
  min-height: 68px; /* 날짜 크기 조정 */
}

/* 날짜 안의 숫자 content 스타일 */
.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  gap: 2px;
  cursor: pointer;
  border: 2px solid transparent; /* 기본적으로 투명 */
  border-radius: 8px; /* 둥근 네모 */
  width: 45px;
  height: 68px;
  transition: all 0.3s;
  font-family: 'MyFontBold';
}

/* 선택된 날짜 (초록색 네모 테두리) */
.day-content.selected {
  border: 2px solid #61905A !important; /* 초록색 테두리 */
}

/* 지정 불가 날짜 설정 */
.day-content.disabled {
  pointer-events: none;
  opacity: 0.3;
}

/* content 색상 */
.positive {
  color: #61905a; /* 초록색 */
  font-size: 8px;
}

.negative {
  color: #e35050; /* 빨간색 */
  font-size: 8px;
}

.zero {
  visibility: hidden;
  font-size: 10px;
}

.calendar-wrapper {
  position: relative;
  max-width: 360px;
  margin: 0 auto;
  overflow: hidden; 
}

.month-data {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(-10px, -10px);
  background-color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: bold;
  z-index: 10;
}

.month-data .income {
  color: #61905a;
  font-weight: bold;
}
.month-data .outcome {
  color: #e35050;
  font-weight: bold;
}

.event-panel {
  margin-top: 10px;

  text-align: center;
}

.expense-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
  font-family: 'MyFontBold';
  padding-bottom: 60px;
}

.expense-item {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 10px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #61905a;
}

.expense-header {
  display: flex;
  /* justify-content: space-between; */
  align-items: left;
  font-size: 12px;
  color: black;
  padding: 4px 6px;
  margin-bottom: 4px;
}
.category-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  /* padding-right: 50px; */
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  font-size: 20px;
  margin-right: 10px;
  background-color: #f0f0f0;
  margin-right: 14px;
  margin-left: 6px;
}

.info {
  flex-grow: 1;
}

.title {
  font-weight: bold;
  text-align: left;
}

.category {
  font-size: 12px;
  color: #61905a;
  text-align: left;
}

.value {
  font-weight: bold;
  color: #333;
}

.delete {
  margin-left: 10px;
  color: #e35050;
  cursor: pointer;
}

.amount {
  margin-left: auto;
}
.no-event{
  margin: 2rem;
  font-family: "Myfont";
}
</style>
