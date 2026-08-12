<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Redefinir Senha
      </h2>

      <!-- Erro: link inválido (sem token ou email) -->
      <div
        v-if="invalidLink"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
      >
        Link inválido. Solicite um novo link de recuperação.
      </div>

      <!-- Mensagem de sucesso -->
      <div
        v-if="successMessage"
        class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300"
      >
        {{ successMessage }}
      </div>

      <!-- Erro geral -->
      <div
        v-if="generalError"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
      >
        {{ generalError }}
      </div>

      <!-- Formulário -->
      <form v-if="!invalidLink && !successMessage" @submit.prevent="handleReset" class="space-y-4">
        <!-- Senha -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nova senha
          </label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Nova senha"
            class="mt-1 block w-full rounded-lg border p-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-white/5 dark:text-white"
            :class="errors.password ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirmar Senha -->
        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Confirme a nova senha
          </label>
          <input
            v-model="form.password_confirmation"
            type="password"
            id="password_confirmation"
            placeholder="Confirme a nova senha"
            class="mt-1 block w-full rounded-lg border p-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-white/5 dark:text-white"
            :class="errors.password_confirmation ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
          />
          <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.password_confirmation }}
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
          {{ loading ? 'Redefinindo...' : 'Redefinir Senha' }}
        </button>
      </form>

      <!-- Link voltar ao login -->
      <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <router-link to="/login" class="text-orange-500 hover:underline">Voltar ao login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from "@/services/api"

export default {
  name: "ResetPassword",

  data() {
    return {
      form: {
        password: "",
        password_confirmation: "",
      },
      token: null,
      email: null,
      errors: {
        password: null,
        password_confirmation: null,
      },
      generalError: null,
      successMessage: null,
      invalidLink: false,
      loading: false,
    }
  },

  created() {
    this.token = this.$route.query.token
    this.email = this.$route.query.email

    if (!this.token || !this.email) {
      this.invalidLink = true
    }
  },

  watch: {
    'form.password'() { this.errors.password = null; this.generalError = null },
    'form.password_confirmation'() { this.errors.password_confirmation = null; this.generalError = null },
  },

  methods: {
    validateClient() {
      this.errors = { password: null, password_confirmation: null }
      this.generalError = null
      let valid = true

      if (!this.form.password || this.form.password.length < 6) {
        this.errors.password = "A senha deve ter no mínimo 6 caracteres."
        valid = false
      }

      if (this.form.password !== this.form.password_confirmation) {
        this.errors.password_confirmation = "As senhas não coincidem."
        valid = false
      }

      return valid
    },

    async handleReset() {
      if (!this.validateClient()) return

      this.loading = true
      this.generalError = null

      try {
        await api.post("/reset-password", {
          token: this.token,
          email: this.email,
          password: this.form.password,
          password_confirmation: this.form.password_confirmation,
        })

        this.successMessage = "Senha redefinida com sucesso! Redirecionando para o login..."
        setTimeout(() => this.$router.push("/login"), 3000)
      } catch (err) {
        const status = err.response?.status
        const data = err.response?.data

        if (status === 422 && data?.message) {
          this.generalError = data.message
          return
        }

        if (data?.message) {
          this.generalError = data.message
          return
        }

        if (!err.response) {
          this.generalError = "Erro de conexão. Verifique sua internet e tente novamente."
          return
        }

        this.generalError = "Não foi possível redefinir a senha. Tente novamente."
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
