import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import BudgetComparison from '@/pages/home/BudgetComparison.vue'
import BudgetSettings from '@/pages/home/BudgetSettings.vue'
import Chart from '@/pages/charts/Chart.vue'
import SavingManagement from '@/pages/saving/SavingManagement.vue'
import AddSavings from '@/pages/saving/AddSavings.vue'
import SavingDetail from '@/pages/saving/SavingDetail.vue'
import NotFound from '@/pages/NotFound.vue'
import AddModal from '@/pages/plus/AddCalendarModal.vue'
import HomeView from '@/pages/home/HomeView.vue'
import AddTab from '@/pages/plus/AddTab.vue'
import AddTabOutcome from '@/pages/plus/AddTabOutcome.vue'
import AddTabIncome from '@/pages/plus/AddTabIncome.vue'
import SignIn from '@/pages/login/SignIn.vue'
import SignUp from '@/pages/login/SignUp.vue'
import SettingsMain from '@/pages/settings/SettingsMain.vue'
import SearchFilter from '@/pages/home/SearchFilter.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/chart',
      name: 'chart',
      component: Chart,
      meta: { requiresAuth: true },
    },
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
        },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: '/saving',
      name: 'saving',
      component: SavingManagement,
      meta: { requiresAuth: true },
    },
    {
      path: '/add-saving',
      name: 'AddSavings',
      component: AddSavings,
      meta: { requiresAuth: true },
    },
    {
      path: '/saving/:id',
      name: 'SavingDetail',
      component: SavingDetail,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { requiresAuth: true },
    },
    {
      path: '/budgetSetting',
      name: 'budgetSettings',
      component: BudgetSettings,
      meta: { requiresAuth: true },
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/settings',
      name: 'SettingsMain',
      component: SettingsMain,
      meta: { requiresAuth: true },
    },
    {
      path: '/searchFilter',
      name: 'searchFilter',
      component: SearchFilter,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  userStore.checkToken()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/signin')
  } else {
    next()
  }
})

export default router
