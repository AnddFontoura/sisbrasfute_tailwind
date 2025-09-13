import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const { data } = await api.post('/login', { email, password })
        this.token = data.token
        localStorage.setItem('token', data.token)
        this.user = data.user
      } catch (err) {
        throw err.response?.data || err
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  },
})
