import { createRouter, createWebHistory } from 'vue-router'
import BudgetComparison from '@/pages/home/BudgetComparison.vue'
import BudgetSettings from '@/pages/home/BudgetSettings.vue'
import ExpenseRanking from '@/pages/charts/ExpenseRanking.vue'
import AddSavings from '@/pages/saving/AddSavings.vue'
import ThemeSettings from '@/pages/profile/ThemeSettings.vue'
import NotFound from '@/pages/NotFound.vue'
import AddModal from '@/pages/plus/AddModal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BudgetSettings,
    },
    {
      path: '/chart',
      name: 'chart',
      component: ExpenseRanking,
    },
    {
      path: '/add',
      name: 'add',
      component: AddModal,
    },
    {
      path: '/saving',
      name: 'saving',
      component: AddSavings,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ThemeSettings,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

export default router
