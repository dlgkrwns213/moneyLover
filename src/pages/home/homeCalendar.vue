<script setup>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

// ✅ 사용자 정보 및 데이터 로드
const userStore = useUserStore()
const allCashflowData = ref([])

onMounted(async () => {
  try {
    const userId = userStore.userId || '1' || 'unknown'
    const res = await axios.get(`http://localhost:3000/cashflows?userId=${userId}`)
    allCashflowData.value = res.data
  } catch (error) {
    console.error('데이터 불러오기 실패', error)
  }
})

// ✅ 날짜 선택 관련
const selectedDate = ref('')
const newEvent = ref('')
const events = ref({})

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

function onDayClick(day) {
  innerSelectedDate.value = day.date
}

function addEvent() {
  if (!selectedDate.value || !newEvent.value.trim()) return

  if (!events.value[selectedDate.value]) {
    events.value[selectedDate.value] = []
  }
  events.value[selectedDate.value].push(newEvent.value.trim())
  newEvent.value = ''
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
  return allCashflowData.value.filter(data => data.date.startsWith(yearMonth))
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
    const dateKey = data.date.split(" ")[0] // yyyy-mm-dd
    if (!mapByDateSum[dateKey]) mapByDateSum[dateKey] = {income: 0, outcome: 0}

    console.log(data.cashflowValue)
    console.log(mapByDateSum[dateKey])
    if (data.cashflowType) {
      mapByDateSum[dateKey].income += data.cashflowValue
    } else {
      mapByDateSum[dateKey].outcome += data.cashflowValue
    }
  }

  console.log(mapByDateSum)

  return Object.entries(mapByDateSum).map(([date, items], i) => ({
    key: `date-${i}`,
    dates: date,
    content: {
      base: {
        // 예시: 수입-지출 차액을 기준으로 색상 설정
        color: [items.income, -items.outcome]
      }
    }
  }))
})


// 숫자 색상 클래스 반환
const getColorClass = (value) => {
  return value > 0 ? 'positive' : value < 0 ? 'negative' : 'zero'
}
</script>

<template>
  <div class="container">
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
            selected: innerSelectedDate && formatDateLocal(innerSelectedDate) === formatDateLocal(day.date),
            disabled: day.date > maxDate
          }"          
          @click="onDayClick(day)"
        >
          <span>{{ day.day }}</span> <!-- 날짜 숫자 -->

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

    <!-- 일정 추가 패널 -->
    <div class="event-panel">
      <h5>선택 날짜: 
        <span class="selected-date">
          {{ formatDateWithWeekday(innerSelectedDate)}}
        </span>
      </h5>

      <ul class="event-list" v-if="events[selectedDate]?.length">
        <li v-for="(event, idx) in events[selectedDate]" :key="idx">
          📌 {{ event }}
        </li>
      </ul>
      <p v-else class="no-event">기록이 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
/* 📌 기본 컨테이너 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f4f6f9;
}

/* ✅ FullCalendar 날짜 스타일 */
:deep(.vc-day) {
  position: relative;
  min-height: 68px; /* 날짜 크기 조정 */
}

/* 🔢 날짜 안의 숫자 content 스타일 */
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
}

/* ✅ 선택된 날짜 (초록색 네모 테두리) */
.day-content.selected {
  border: 2px solid #4caf50 !important; /* 초록색 테두리 */
  font-weight: bold;
}

/* 지정 불가 날짜 설정 */
.day-content.disabled {
  pointer-events: none;
  opacity: 0.3;
}

/* 🎨 content 색상 */
.positive {
  color: #61905A; /* 초록색 */
  font-size: 10px;
}

.negative {
  color: #E35050; /* 빨간색 */
  font-size: 10px;
}

.zero {
  visibility: hidden;
  font-size: 10px;
}

.event-panel {
  margin-top: 10px;

  text-align: center;
}

</style>
