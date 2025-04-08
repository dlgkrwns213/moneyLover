import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userId: null,
    token: null,
  }),
  actions: {
    login(fakeToken, id) {
      this.token = fakeToken
      this.isLoggedIn = true
      this.userId = id
    },
    logout() {
      this.token = null
      this.isLoggedIn = false
    },
  },
})
