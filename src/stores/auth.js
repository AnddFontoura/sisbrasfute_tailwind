import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('access_token') || null,
  }),
  actions: {
    async login(email, password) {
      const response = await api.post('/login', { email, password })
      this.token = response.data.access_token
      this.user = response.data.user
      localStorage.setItem('access_token', this.token)
      localStorage.setItem('user',  JSON.stringify(this.user))

    },
    loadFromStorage() {
      const token = localStorage.getItem('access_token')
      const user = localStorage.getItem('user')

      this.token = token
      this.user = user ? JSON.parse(user) : null
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }
  },
})
