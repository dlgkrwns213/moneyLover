import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    token: null,
  }),
  actions: {
    login(fakeToken) {
      this.token = fakeToken
      this.isLoggedIn = true
    },
    logout() {
      this.token = null
      this.isLoggedIn = false
    },
  },
})
