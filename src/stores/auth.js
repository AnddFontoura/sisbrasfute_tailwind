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
        localStorage.setItem('access_token', this.token)
        this.user = response.data.user
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('access_token')
    }
  },
})
