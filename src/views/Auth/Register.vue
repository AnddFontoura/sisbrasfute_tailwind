<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Criar Conta
      </h2>

      <!-- Erro geral (ex: email já existe, erro de servidor) -->
      <div
        v-if="generalError"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
      >
        {{ generalError }}
      </div>

      <!-- Formulário -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Nome -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nome completo
          </label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            placeholder="Seu nome completo"
            class="mt-1 block w-full rounded-lg border p-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-white/5 dark:text-white dark:border-white/10"
            :class="errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
          />
          <p v-if="errors.fullName" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.fullName }}
          </p>
        </div>

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
            class="mt-1 block w-full rounded-lg border p-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-white/5 dark:text-white dark:border-white/10"
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
            placeholder="Mínimo 8 caracteres"
            class="mt-1 block w-full rounded-lg border p-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-white/5 dark:text-white dark:border-white/10"
            :class="errors.password ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirmação de Senha -->
        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Confirme a Senha
          </label>
          <input
            v-model="form.password_confirmation"
            type="password"
            id="password_confirmation"
            placeholder="Repita a senha"
            class="mt-1 block w-full rounded-lg border p-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-white/5 dark:text-white dark:border-white/10"
            :class="errors.passwordConfirmation ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
          />
          <p v-if="errors.passwordConfirmation" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.passwordConfirmation }}
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
          {{ loading ? 'Criando conta...' : 'Cadastrar' }}
        </button>
      </form>

      <!-- Link Login -->
      <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Já tem conta?
        <router-link to="/login" class="text-orange-500 hover:underline ml-1">Entrar</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api.js'
import Swal from "@/services/swal.js"

export default {
  name: "Register",

  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
      },
      errors: {
        fullName: null,
        email: null,
        password: null,
        passwordConfirmation: null,
      },
      generalError: null,
      loading: false,
    }
  },

  watch: {
    'form.name'() { this.errors.fullName = null },
    'form.email'() { this.errors.email = null },
    'form.password'() { this.errors.password = null },
    'form.password_confirmation'() { this.errors.passwordConfirmation = null },
  },

  methods: {
    clearErrors() {
      this.errors = { fullName: null, email: null, password: null, passwordConfirmation: null }
      this.generalError = null
    },

    validateClient() {
      this.clearErrors()
      let valid = true

      if (!this.form.name.trim()) {
        this.errors.fullName = 'O nome é obrigatório.'
        valid = false
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'O email é obrigatório.'
        valid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = 'Informe um email válido.'
        valid = false
      }

      if (!this.form.password) {
        this.errors.password = 'A senha é obrigatória.'
        valid = false
      } else if (this.form.password.length < 8) {
        this.errors.password = 'A senha deve ter no mínimo 8 caracteres.'
        valid = false
      }

      if (!this.form.password_confirmation) {
        this.errors.passwordConfirmation = 'Confirme a senha.'
        valid = false
      } else if (this.form.password !== this.form.password_confirmation) {
        this.errors.passwordConfirmation = 'As senhas não coincidem.'
        valid = false
      }

      return valid
    },

    async handleRegister() {
      if (!this.validateClient()) return

      this.loading = true
      this.clearErrors()

      try {
        await api.post("register", {
          fullName: this.form.name,
          email: this.form.email,
          password: this.form.password,
          passwordConfirmation: this.form.password_confirmation
        })

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Conta criada com sucesso!',
          showConfirmButton: false,
          timer: 2500,
        })

        this.$router.push("/login")
      } catch (error) {
        const status = error.response?.status
        const data = error.response?.data

        // Erro 422 — validação do backend
        if (status === 422 && data?.errors) {
          const apiErrors = data.errors

          // Mapeia campos da API para campos locais
          if (apiErrors.fullName) this.errors.fullName = apiErrors.fullName[0]
          if (apiErrors.name) this.errors.fullName = apiErrors.name[0]
          if (apiErrors.email) this.errors.email = apiErrors.email[0]
          if (apiErrors.password) this.errors.password = apiErrors.password[0]
          if (apiErrors.passwordConfirmation) this.errors.passwordConfirmation = apiErrors.passwordConfirmation[0]
          if (apiErrors.password_confirmation) this.errors.passwordConfirmation = apiErrors.password_confirmation[0]

          return
        }

        // Erro 409 ou mensagem genérica do backend
        if (data?.message) {
          this.generalError = data.message
          return
        }

        // Erro de rede ou servidor
        if (!error.response) {
          this.generalError = 'Erro de conexão. Verifique sua internet e tente novamente.'
          return
        }

        if (status >= 500) {
          this.generalError = 'Erro interno do servidor. Tente novamente mais tarde.'
          return
        }

        // Fallback
        this.generalError = 'Não foi possível criar a conta. Tente novamente.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
