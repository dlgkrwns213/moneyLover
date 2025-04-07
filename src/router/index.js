import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/home/HomeView.vue'
import BudgetComparison from '@/pages/home/BudgetComparison.vue'
import BudgetSettings from '@/pages/home/BudgetSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BudgetComparison,
    },
  ],
})

export default router
