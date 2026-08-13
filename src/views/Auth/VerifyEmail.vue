<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">

      <!-- Loading State -->
      <div v-if="state === 'loading'">
        <svg
          class="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p class="text-gray-700 dark:text-gray-200 text-lg font-medium">Verificando seu email...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="state === 'success'">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20">
          <svg class="h-8 w-8 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Email verificado com sucesso!</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Sua conta está pronta para uso.</p>
        <router-link
          to="/dashboard"
          class="inline-block bg-orange-500 text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition"
        >
          Ir para o Dashboard
        </router-link>
      </div>

      <!-- Error State (expired/invalid) -->
      <div v-else-if="state === 'error'">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
          <svg class="h-8 w-8 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Verificação falhou</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ errorMessage }}</p>

        <!-- Resend button if authenticated -->
        <button
          v-if="isAuthenticated"
          @click="handleResend"
          :disabled="resending"
          class="inline-flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            v-if="resending"
            class="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Reenviar email
        </button>

        <!-- Message if not authenticated -->
        <p v-else class="text-sm text-gray-500 dark:text-gray-400">
          Faça login para reenviar o email de verificação.
        </p>
      </div>

      <!-- Network Error State -->
      <div v-else-if="state === 'network-error'">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/20">
          <svg class="h-8 w-8 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Erro de conexão</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.</p>
        <button
          @click="verifyEmail"
          class="inline-block bg-orange-500 text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition"
        >
          Tentar novamente
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import Swal from '@/services/swal.js'

export default {
  name: 'VerifyEmail',

  data() {
    return {
      state: 'loading',
      errorMessage: '',
      resending: false,
    }
  },

  computed: {
    isAuthenticated() {
      const auth = useAuthStore()
      return auth.isAuthenticated
    },
  },

  mounted() {
    this.verifyEmail()
  },

  methods: {
    async verifyEmail() {
      this.state = 'loading'

      const { id, hash, expires, signature } = this.$route.query

      if (!id || !hash || !expires || !signature) {
        this.state = 'error'
        this.errorMessage = 'Link de verificação inválido. Parâmetros ausentes.'
        return
      }

      try {
        await api.get(`/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`, {
          timeout: 10000,
        })

        this.state = 'success'

        // If authenticated, refresh user data to update email_verified_at
        if (this.isAuthenticated) {
          const auth = useAuthStore()
          await auth.refreshUser()
        }
      } catch (err) {
        if (!err.response) {
          // Network error or timeout
          this.state = 'network-error'
        } else {
          // Server responded with error (403, 410, 404, etc.)
          this.state = 'error'
          this.errorMessage = err.response?.data?.message || 'Ocorreu um erro ao verificar seu email.'
        }
      }
    },

    async handleResend() {
      this.resending = true

      try {
        await api.post('/email/resend-verification')

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Email de verificação reenviado!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao reenviar email de verificação.'

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })
      } finally {
        this.resending = false
      }
    },
  },
}
</script>
