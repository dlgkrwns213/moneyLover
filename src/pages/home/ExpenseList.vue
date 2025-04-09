<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { TRANSLATIONS } from '@/constants/translate'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

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

const getIconPath = (koreanCategory) => {
  const key = getCategorykey(koreanCategory)
  return key ? `/src/assets/images/all/${key}.png` : `src/assets/images/all/${key}.png`
  // return `/src/assets/images/all/${key}.png`
}

const router = useRouter()
const goToDetail = (id) => {
  router.push(`/transaction/${id}`)
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
            <div class="title">{{ item.cashflowName }}</div>
            <div class="category">{{ item.category || '카테고리 없음' }}</div>
          </div>
          <div class="value">
        <span class="amount" :class="item.cashflowType ? 'income' : 'expense'">
          {{ item.cashflowType ? '+' : '-' }}{{ item.cashflowValue.toLocaleString() }}<span class="won"> 원</span>
        </span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expense-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
  font-family: 'MyFontBold';
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
  color: #e04141;
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
  font-family: "MyfontBold";
}

.category {
  font-size: 11px;
  font-family: "Myfont";
  color: #61905a;
  padding-left: 1px;
}

.value {
  font-family: "MyfontBold";
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
