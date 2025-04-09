<template>
  <div class="container">
    <!-- Header -->
    <div class="d-flex align-items-center mb-3">
      <button class="btn me-2" @click="goHome">←</button>
      <input
        v-model="searchText"
        type="text"
        class="form-control"
        placeholder="검색어를 입력하세요"
      />
    </div>

    <!-- Filters -->
    <div class="mb-3">
      <div class="d-flex flex-wrap gap-2">
        <DropdownFilter label="유형" :options="typeOptions" v-model="filters.type" />
        <DropdownFilter label="카테고리" :options="categoryOptions" v-model="filters.category" />
        <AmoutDropdownFilter label="금액" :options="amountOptions" v-model="filters.amount" />
        <DateRangeFilter label="날짜" :options="dateOptions" v-model="filters.date" />
      </div>
    </div>

    <!-- Summary -->
    <div class="bg-light rounded p-3 mb-3 text-center">
      <div class="d-flex justify-content-around">
        <div>
          <div class="fw-bold">기록</div>
          <div>{{ filteredItems.length }}</div>
        </div>
        <div>
          <div class="fw-bold text-danger">총 지출</div>
          <div>{{ totalExpense }}</div>
        </div>
        <div>
          <div class="fw-bold text-success">총 수입</div>
          <div>{{ totalIncome }}</div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="filteredItems.length">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="d-flex justify-content-between align-items-center p-3 mb-2 bg-white shadow-sm rounded-4"
      >
        <!-- 왼쪽: 아이콘 + 텍스트 -->
        <div class="d-flex align-items-center">
          <!-- 아이콘 -->
          <div
            class="me-3 d-flex align-items-center justify-content-center rounded-circle"
            style="width: 50px; height: 50px; background-color: #f3f3f3"
          >
            <span class="fs-4"
              ><img :src="getIconPath(item.category)" alt="카테고리 아이콘" class="category-icon"
            /></span>
          </div>

          <!-- 텍스트 -->
          <div>
            <div class="fw-bold">{{ item.category }}</div>
            <div class="text-muted small">{{ item.memo }}</div>
          </div>
        </div>

        <!-- 오른쪽: 금액 + 날짜 -->
        <div class="text-end">
          <div
            :class="{
              'text-success': item.type === '수입',
              'text-danger': item.type === '지출',
              'fw-bold': true,
            }"
          >
            {{ item.type === '수입' ? '+' : '-' }}₩{{ Math.abs(item.amount).toLocaleString() }}
          </div>
          <div class="text-muted small">{{ item.date }}</div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-muted">검색된 내역이 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import DropdownFilter from './DropdwonFilter.vue'
import AmoutDropdownFilter from './AmoutDropdownFilter.vue'
import DateRangeFilter from './DateRangeFilter.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { TRANSLATIONS } from '@/constants/translate'

const router = useRouter()
const goHome = () => router.push('/')
const items = ref([])

const searchText = ref('')

const filters = reactive({
  type: '',
  category: '',
  amount: { min: null, max: null },
  date: { start: null, end: null },
})
// const filters = ref({
//   type: '',
//   category: '',
//   amount: '',
//   date: '',
// })

const fetchItems = async () => {
  try {
    const response = await axios.get('http://localhost:3000/cashflows?userId=1')
    items.value = response.data.map((item) => ({
      id: item.id,
      type: item.cashflowType ? '수입' : '지출',
      category: item.category,
      amount: item.cashflowValue,
      date: item.date,
      memo: item.cashflowName,
    }))
  } catch (error) {
    console.error('데이터 불러오기 실패:', error)
  }
}

onMounted(() => {
  fetchItems()
})

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchText = !searchText.value || item.memo.includes(searchText.value)
    const matchType = !filters.type || item.type === filters.type
    const matchCategory = !filters.category || item.category === filters.category
    const matchAmount =
      (!filters.amount.min || item.amount >= filters.amount.min) &&
      (!filters.amount.max || item.amount <= filters.amount.max)
    const matchDate =
      (!filters.date.start || item.date >= filters.date.start) &&
      (!filters.date.end || item.date <= filters.date.end)

    const passed = matchText && matchType && matchCategory && matchAmount && matchDate

    return passed
  })
})

const totalExpense = computed(() => {
  return filteredItems.value
    .filter((item) => item.type === '지출')
    .reduce((acc, cur) => acc + cur.amount, 0)
})

const totalIncome = computed(() => {
  return filteredItems.value
    .filter((item) => item.type === '수입')
    .reduce((acc, cur) => acc + cur.amount, 0)
})

const evalAmountFilter = (itemAmount, amountFilter) => {
  if (!amountFilter || typeof amountFilter !== 'object') return true

  const { min, max } = amountFilter
  return (!min || itemAmount >= min) && (!max || itemAmount <= max)
}

const typeOptions = ['지출', '수입']
const categoryOptions = [
  '보너스',
  '부채',
  '현금 수입',
  '이자',
  '만기',
  '급여',
  '부업',
  '기타 수입',
  '도서',
  '자동차',
  '의류',
  '화장품',
  '배달',
  '음료',
  '술',
  '여가/오락',
  '운동',
  '주거',
  '대출',
  '관리비',
  '식사',
  '의료',
  '생필품',
  '현금 지출',
  '반려동물',
  '통신비',
  '선물',
  '교통',
  '쇼핑',
  '학습',
  '기타 지출',
]
const amountOptions = ['10만원 이상', '10만원 미만']
const dateOptions = ['2025-04', '2025-03', '2025-02']

// 아이콘 연동용
const getCategorykey = (koreanCategory) => {
  const entry = Object.entries(TRANSLATIONS).find(([_, value]) => value === koreanCategory)
  return entry ? entry[0] : null
}

const getIconPath = (koreanCategory) => {
  const key = getCategorykey(koreanCategory)
  return key ? `/src/assets/images/all/${key}.png` : '/all/bonus.png'
}
</script>

<style scoped>
@media (max-width: 360px) {
  .container {
    padding: 1rem;
    /* font-family: 'MyFontBold'; */
  }
}

.container {
  font-family: 'MyFont';
}

.fs-4 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  font-size: 20px;
  margin-right: 10px;
  background-color: #f0f0f0;
  margin-right: 6px;
  margin-left: 6px;
}

.category-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  /* padding-right: 50px; */
}
</style>
