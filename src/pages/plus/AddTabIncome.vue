<script setup>
import { ref, computed, defineEmits } from 'vue'
import AddButton from './AddButton.vue'
import { TRANSLATIONS } from '@/constants/translate.js'

const emit = defineEmits(['update-category'])

const incomeKeys = [
  'bonus',
  'debt',
  'in_cash',
  'interest',
  'mature',
  'salary',
  'side_job',
  'etc_income',
]

const incomeItems = computed(() => incomeKeys.map((key) => ({ key, text: TRANSLATIONS[key] })))

const selectedKey = ref(null)

const selectCard = (key) => {
  selectedKey.value = key
  emit('update-category', {
    type: 'income',
    category: TRANSLATIONS[key],
  })
}
</script>

<template>
  <div class="card-list">
    <AddButton
      v-for="item in incomeItems"
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
  max-height: calc(100vh - 250px); /* footer 높이 감안해서 조절 */
  overflow-y: auto;
}
</style>
