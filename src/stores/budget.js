import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBudgetStore = defineStore('budget', () => {
  const budget = ref(0)

  const setBudget = (value) => {
    budget.value = value
  }

  return { budget, setBudget }
})
