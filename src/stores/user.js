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
      localStorage.setItem('token', fakeToken)
    },
    logout() {
      this.token = null
      this.isLoggedIn = false
      this.userId = null
      localStorage.removeItem('token')
    },
    checkToken() {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        this.token = storedToken
        this.isLoggedIn = true
      } else {
        this.logout()
      }
    },
  },
})
