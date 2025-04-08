<template>
  <ul>
    <IncomeListItem
      v-for="(item, index) in categorySummary"
      :key="index"
      :index="index"
      :category="item.category"
      :value="item.total"
      :percent="item.percent"
      :count="item.count"
    />
  </ul>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import IncomeListItem from './IncomeListItem.vue'

const categorySummary = ref([])

onMounted(async () => {
  const url = 'http://localhost:3000/cashflows?cashflowType=true'
  const res = await axios.get(url)
  const expenses = res.data

  // 총 수입 구하기
  const total = expenses.reduce((sum, item) => sum + item.cashflowValue, 0)

  // 카테고리별 합계/횟수 구하기
  const categoryMap = {}

  for (const item of expenses) {
    const category = item.category || '기타'
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        total: 0,
        count: 0,
      }
    }
    categoryMap[category].total += item.cashflowValue
    categoryMap[category].count += 1
  }

  // 퍼센트 계산 후 배열로 변환
  categorySummary.value = Object.values(categoryMap)
    .map((entry) => {
      return {
        ...entry,
        percent: ((entry.total / total) * 100).toFixed(1),
      }
    })
    .sort((a, b) => b.total - a.total)
})
</script>
<style scoped>
ul {
  padding: 0;
  margin: 0;
}
li {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 5px;
  margin-bottom: 5px;
  list-style: none;
}
li:last-child {
  border-bottom: none;
}
</style>
