<template>
  <ul>
    <ExpenseSignleAmountItem
      v-for="(item, index) in top10List"
      :key="index"
      :category="item.category"
      :value="item.value"
      :date="item.date"
      :memo="item.memo"
    />
  </ul>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ExpenseSignleAmountItem from './ExpenseSignleAmountItem.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const top10List = ref([])

onMounted(async () => {
  const url = 'http://localhost:3000/cashflows?cashflowType=false'
  const res = await axios.get(url, {
    params: {
      userId: userStore.userId,
    },
  })
  const cashflows = res.data

  const singleList = cashflows
    .filter((item) => item.cashflowType === false)
    .map((item) => ({
      category: item.category || item.cashflowName || '기타',
      value: item.cashflowValue,
      date: item.date,
      memo: item.cashflowName || '',
    }))
    .sort((a, b) => b.value - a.value) // 금액 기준 내림차순
    .slice(0, 10) // Top 10

  top10List.value = singleList
})
</script>
<style scoped>
ul {
  padding: 0;
  margin: 0;
}
li {
  border-bottom: 1px solid #61905a;
  padding-bottom: 5px;
  margin-bottom: 5px;
  list-style: none;
}
li:last-child {
  border-bottom: none;
}
</style>
