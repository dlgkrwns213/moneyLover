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

<<<<<<< HEAD
app.use(VCalendar, {})

=======
>>>>>>> 09a1b006a15d3b62d7667d990c23cdbdfb4174e3
app.component('font-awesome-icon', FontAwesomeIcon)
const pinia = createPinia()
app.use(createPinia())
pinia.use(piniaPluginPersistedstate)
app.use(router)

app.mount('#app')
