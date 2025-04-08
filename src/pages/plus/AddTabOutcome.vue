<script setup>
import { ref, computed } from 'vue'
import AddButton from './AddButton.vue'
import { TRANSLATIONS } from '@/constants/translate.js'

const outcomeKeys = [
  'book', 'car', 'clothes', 'cosmetics', 'delivery', 'drink', 'drinking',
  'entertainment', 'exercise', 'house', 'loan', 'maintenance_cost', 'meal',
  'medical', 'necessities', 'out_cash', 'pet', 'phone_bill', 'present',
  'public_transport', 'shopping', 'study', 'etc_outcome',
]

const outcomeItems = computed(() =>
  outcomeKeys.map((key) => ({ key, text: TRANSLATIONS[key] }))
)

const selectedKey = ref(null)

const selectCard = (key) => {
  selectedKey.value = key
}
</script>

<template>
  <div class="card-list">
    <AddButton
      v-for="item in outcomeItems"
      :key="item.key"
      :cardKey="item.key"
      :cardText="item.text"
      :isSelected="selectedKey === item.key"
      @select="selectCard"
    />
  </div>
</template>

<style scoped>
.card-list {
  display: grid;
  grid-template-columns: repeat(4, min-content); /* 4개 고정 */
  gap: 25px;

  /* 전체를 수평 가운데 정렬 */
  justify-content: center;

  padding: 16px;
  max-height: calc(100vh - 240px); /* footer 높이 감안해서 조절 */
  overflow-y: auto;
}
</style>