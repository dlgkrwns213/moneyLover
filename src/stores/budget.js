import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    budget: null,
  }),
  actions: {
    setBudget(budget) {
      this.budget = budget
      const userStore = useUserStore()
      localStorage.setItem(`budget-${userStore.userId}`, budget)
    },
    loadBudget() {
      const userStore = useUserStore()
      const saved = localStorage.getItem(`budget-${userStore.userId}`)
      if (saved !== null) {
        this.budget = Number(saved)
      }
    },
    resetBudget() {
      this.budget = null
    },
  },
  persist: true,
})

// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { useUserStore } from './user'

// export const useBudgetStore = defineStore(
//   'budget',
//   () => {
//     const budget = ref(0)

//     const setBudget = (value) => {
//       budget.value = value
//     }

//     return { budget, setBudget }
//   },
//   {
//     persist: {
//       key: () => `budget-${useUserStore().userId}`,
//       storage: localStorage,
//     },
//   },
// )
