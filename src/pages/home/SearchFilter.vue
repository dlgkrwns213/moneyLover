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
            <span class="fs-4">{{ item.icon }}</span>
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
import { ref, computed, onMounted } from 'vue'
import DropdownFilter from './DropdwonFilter.vue'
import AmoutDropdownFilter from './AmoutDropdownFilter.vue'
import DateRangeFilter from './DateRangeFilter.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const goHome = () => router.push('/')
const items = ref([])

const searchText = ref('')

const filters = ref({
  type: '',
  category: '',
  amount: '',
  date: '',
})

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
    const matchesText = searchText.value === '' || item.memo.includes(searchText.value)
    const matchesType = !filters.value.type || item.type === filters.value.type
    const matchesCategory = !filters.value.category || item.category === filters.value.category
    const matchesAmount =
      !filters.value.amount || evalAmountFilter(item.amount, filters.value.amount)
    const matchesDate =
      !filters.value.date ||
      ((filters.value.date.start ? item.date.split(' ')[0] >= filters.value.date.start : true) &&
        (filters.value.date.end ? item.date.split(' ')[0] <= filters.value.date.end : true))
    return matchesText && matchesType && matchesCategory && matchesAmount && matchesDate
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
const categoryOptions = ['식비', '교통', '쇼핑', '급여', '기타']
const amountOptions = ['10만원 이상', '10만원 미만']
const dateOptions = ['2025-04', '2025-03', '2025-02']
</script>

<style scoped>
@media (max-width: 360px) {
  .container {
    padding: 1rem;
  }
}
</style>
