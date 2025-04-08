import './assets/main.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// v-calendar 관련
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

// Font Awesome 관련
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

library.add(faXmark)

const app = createApp(App)

app.use(VCalendar, {})
app.component('font-awesome-icon', FontAwesomeIcon)
const pinia = createPinia()
app.use(createPinia())
pinia.use(piniaPluginPersistedstate)
app.use(router)

import { useUserStore } from '@/stores/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  userStore.checkToken()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/signin')
  } else {
    next()
  }
})

app.mount('#app')
