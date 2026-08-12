<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
        Recuperar Senha
      </h2>

      <!-- Descrição -->
      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
        Informe seu email e enviaremos um link para redefinir sua senha.
      </p>

      <!-- Mensagem de sucesso -->
      <div v-if="success" class="text-center">
        <div
          class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300"
        >
          Verifique seu email! Se o endereço estiver cadastrado, você receberá um link de recuperação.
        </div>

        <router-link to="/login" class="text-orange-500 hover:underline text-sm">
          Voltar ao login
        </router-link>
      </div>

      <!-- Formulário -->
      <template v-else>
        <!-- Erro geral -->
        <div
          v-if="generalError"
          class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          {{ generalError }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
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
            {{ loading ? 'Enviando...' : 'Enviar link' }}
          </button>
        </form>

        <!-- Link voltar ao login -->
        <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <router-link to="/login" class="text-orange-500 hover:underline">Voltar ao login</router-link>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import api from "@/services/api"

export default {
  name: "ForgotPassword",

  data() {
    return {
      form: {
        email: "",
      },
      errors: {
        email: null,
      },
      generalError: null,
      loading: false,
      success: false,
    }
  },

  watch: {
    'form.email'() {
      this.errors.email = null
      this.generalError = null
    },
  },

  methods: {
    validateClient() {
      this.errors = { email: null }
      this.generalError = null
      let valid = true

      if (!this.form.email.trim()) {
        this.errors.email = 'Informe seu email.'
        valid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = 'Informe um email válido.'
        valid = false
      }

      return valid
    },

    async handleSubmit() {
      if (!this.validateClient()) return

      this.loading = true
      this.generalError = null

      try {
        await api.post('/forgot-password', { email: this.form.email })
        this.success = true
      } catch (err) {
        const status = err.response?.status
        const data = err.response?.data

        if (status === 422 && data?.errors) {
          if (data.errors.email) this.errors.email = data.errors.email[0]
          return
        }

        if (status === 429) {
          this.generalError = 'Aguarde antes de solicitar outro link. Tente novamente em alguns instantes.'
          return
        }

        if (data?.message) {
          this.generalError = data.message
          return
        }

        if (!err.response) {
          this.generalError = 'Erro de conexão. Verifique sua internet e tente novamente.'
          return
        }

        if (status >= 500) {
          this.generalError = 'Erro interno do servidor. Tente novamente mais tarde.'
          return
        }

        this.generalError = 'Não foi possível enviar o link. Tente novamente.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
