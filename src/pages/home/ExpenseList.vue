<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { TRANSLATIONS } from '@/constants/translate'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import TransactionDetailModal from './TransactionDetailModal.vue'

const cashflows = ref([])
const userStore = useUserStore()

onMounted(async () => {
  if (!userStore.userId) {
    console.warn('userId가 없습니다. cashflow를 불러오지 않습니다.')
    return
  }
  try {
    const response = await axios.get(`http://localhost:3000/cashflows`, {
      params: {
        userId: userStore.userId, // user.js에서 정의한 userId 사용
      },
    })
    cashflows.value = response.data
  } catch (error) {
    console.error('cashflow 불러오기 실패:', error)
  }
})

const sortedCashflows = computed(() => {
  return [...cashflows.value].sort((a, b) => {
    const dateA = new Date(a.date.split(' ')[0])
    const dateB = new Date(b.date.split(' ')[0])
    return dateB - dateA
  })
})

// const getCategorykey = (koreanCategory) => {
//   const entry = Object.entries(TRANSLATIONS).find(([_, value]) => value === koreanCategory)
//   return entry ? entry[0] : null
// }

const getCategorykey = (koreanCategory) => {
  if (typeof koreanCategory !== 'string') return null
  const trimmed = koreanCategory.trim()
  const entry = Object.entries(TRANSLATIONS).find(([_, value]) => value.trim() === trimmed)
  return entry ? entry[0] : null
}

function getCategoryKeyFromLabel(label) {
  const reversed = Object.entries(TRANSLATIONS).reduce((acc, [key, value]) => {
    acc[value] = key
    return acc
  }, {})

  return reversed[label] || 'etc'
}
const icons = import.meta.glob('@/assets/images/all/*.png', {
  eager: true,
  import: 'default',
})

const getIconPath = (category) => {
  const key = getCategoryKeyFromLabel(category)
  const path = `/src/assets/images/all/${key}.png`
  return icons[path] || icons['/src/assets/images/income/etc.png']
}

const router = useRouter()
const showModal = ref(false)
const selectedId = ref(null)

const goToDetail = (id) => {
  selectedId.value = id
  showModal.value = true
}
</script>

<template>
  <div class="expense-list">
    <div v-for="(item, index) in sortedCashflows" :key="item.id">
      <div class="expense-header">
        <span class="date">{{ item.date }}</span>
        <!-- <span class="amount" :class="item.cashflowType ? 'income' : 'expense'">
          {{ item.cashflowType ? '+' : '-' }}{{ item.cashflowValue.toLocaleString() }}원
        </span> -->
      </div>

      <div class="expense-item" @click="goToDetail(item.id)">
        <div class="expense-content">
          <div class="icon">
            <img :src="getIconPath(item.category)" alt="카테고리 아이콘" class="category-icon" />
          </div>
          <div class="info">
            <div class="title">{{ item.category || '카테고리 없음' }}</div>
            <div class="category">{{ item.cashflowName }}</div>
          </div>
          <div class="value">
            <span class="amount" :class="item.cashflowType ? 'income' : 'expense'">
              {{ item.cashflowType ? '+' : '-' }}{{ item.cashflowValue.toLocaleString()
              }}<span class="won"> 원</span>
            </span>
          </div>
        </div>
      </div>

      <TransactionDetailModal
        v-if="showModal"
        :id="selectedId"
        @close="showModal = false"
      />
    </div>
  </div>
</template>

<style scoped>
.expense-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 320px;
  font-family: 'MyFont';
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
  font-size: 13px;
  color: black;
  padding: 2px 4px;
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
  color: #cc4444;
}

.expense-content {
  display: flex;
  align-items: center;
  margin: 5px 0;
  margin-right: 5px;
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
  font-family: 'MyfontBold';
}

.category {
  font-size: 11px;
  font-family: 'Myfont';
  color: #61905a;
  padding-left: 1px;
}

.value {
  font-family: 'MyfontBold';
  color: #333;
}
.amount {
  margin-left: auto;
}
.won {
  color: #000;
}
* {
  letter-spacing: -0.05em;
}
</style>
