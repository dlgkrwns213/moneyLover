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
      localStorage.setItem('userId', id)
    },
    logout() {
      this.token = null
      this.isLoggedIn = false
      this.userId = null
      localStorage.removeItem('token')
      localStorage.removeItem('id')
    },
    checkToken() {
      const storedUserId = localStorage.getItem('userId')
      const storedToken = localStorage.getItem('token')
      if (storedToken && storedUserId) {
        this.token = storedToken
        this.userId = storedUserId
        this.isLoggedIn = true
      } else {
        this.logout()
      }
    },
  },
})
