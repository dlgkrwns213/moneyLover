import { createRouter, createWebHistory } from 'vue-router'
import BudgetComparison from '@/pages/home/BudgetComparison.vue'
import BudgetSettings from '@/pages/home/BudgetSettings.vue'
// import ExpenseRanking from '@/pages/charts/expense/chart.vue'
import SavingManagement from '@/pages/saving/SavingManagement.vue'
import AddSavings from '@/pages/saving/AddSavings.vue'
import ThemeSettings from '@/pages/profile/ThemeSettings.vue'
import NotFound from '@/pages/NotFound.vue'
import AddModal from '@/pages/plus/AddModal.vue'
import HomeView from '@/pages/home/HomeView.vue'
import AddTab from '@/pages/plus/AddTab.vue'
import AddTabOutcome from '@/pages/plus/AddTabOutcome.vue'
import AddTabIncome from '@/pages/plus/AddTabIncome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // {
    //   path: '/chart',
    //   name: 'chart',
    //   component: ExpenseRanking,
    // },
    {
      path: '/add',
      name: 'add',
      component: AddTab,
      children: [
        {
          path: 'outcome',
          component: AddTabOutcome,
        },
        {
          path: 'income',
          component: AddTabIncome,
        }
      ]
    },
    {
      path: '/saving',
      name: 'saving',
      component: SavingManagement,
    },
    {
      path: '/add-saving', // ✅ register-button이 이동할 경로
      name: 'AddSavings',
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
    {
      path: '/budgetSetting',
      name: 'budgetSettings',
      component: BudgetSettings,
    },
  ],
})

export default router
