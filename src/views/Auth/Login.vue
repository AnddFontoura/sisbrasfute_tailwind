<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Entrar na Conta
      </h2>

      <!-- Erro geral -->
      <div
        v-if="generalError"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
      >
        {{ generalError }}
      </div>

      <!-- Formulário -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="seu@email.com"
            class="mt-1 block w-full rounded-lg border p-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-white/5 dark:text-white"
            :class="errors.email ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.email }}
          </p>
        </div>

        <!-- Senha -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Senha
          </label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Sua senha"
            class="mt-1 block w-full rounded-lg border p-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-white/5 dark:text-white"
            :class="errors.password ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.password }}
          </p>
        </div>

        <!-- Botão -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full inline-flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            v-if="loading"
            class="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <!-- Link Cadastro -->
      <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Não tem conta?
        <router-link to="/register" class="text-orange-500 hover:underline ml-1">Cadastre-se</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.js"
import Swal from "@/services/swal.js"

export default {
  name: "Login",

  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      errors: {
        email: null,
        password: null,
      },
      generalError: null,
      loading: false,
    }
  },

  watch: {
    'form.email'() { this.errors.email = null; this.generalError = null },
    'form.password'() { this.errors.password = null; this.generalError = null },
  },

  methods: {
    validateClient() {
      this.errors = { email: null, password: null }
      this.generalError = null
      let valid = true

      if (!this.form.email.trim()) {
        this.errors.email = 'Informe seu email.'
        valid = false
      }

      if (!this.form.password) {
        this.errors.password = 'Informe sua senha.'
        valid = false
      }

      return valid
    },

    async handleLogin() {
      if (!this.validateClient()) return

      const auth = useAuthStore()
      this.loading = true
      this.generalError = null

      try {
        await auth.login(this.form.email, this.form.password)
        this.$router.push("/dashboard")
      } catch (err) {
        const status = err.response?.status
        const data = err.response?.data

        // 401 — credenciais inválidas
        if (status === 401) {
          this.generalError = 'Email ou senha incorretos. Verifique e tente novamente.'
          return
        }

        // 422 — validação
        if (status === 422 && data?.errors) {
          if (data.errors.email) this.errors.email = data.errors.email[0]
          if (data.errors.password) this.errors.password = data.errors.password[0]
          return
        }

        // Mensagem genérica do backend
        if (data?.message) {
          this.generalError = data.message
          return
        }

        // Sem resposta (rede)
        if (!err.response) {
          this.generalError = 'Erro de conexão. Verifique sua internet e tente novamente.'
          return
        }

        // Servidor
        if (status >= 500) {
          this.generalError = 'Erro interno do servidor. Tente novamente mais tarde.'
          return
        }

        // Fallback
        this.generalError = 'Não foi possível fazer login. Tente novamente.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
