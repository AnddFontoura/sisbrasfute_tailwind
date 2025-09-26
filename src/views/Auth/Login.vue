<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Entrar na Conta
      </h2>

      <!-- Formulário -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div
          class=" "
        >
          <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Email
          </label>

          <input
            v-model="form.email"
            type="email"
            id="email"
            required
            placeholder="seu@email.com"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>

        <!-- Senha -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700"
          >
            Senha
          </label>

          <input
            v-model="form.password"
            type="password"
            id="password"
            required
            placeholder="********"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>

        <!-- Botão -->
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Entrar
        </button>
      </form>

      <!-- Link Cadastro -->
      <p class="mt-4 text-center text-sm text-gray-600">
        Não tem conta?
        <a href="/register" class="text-indigo-600 hover:underline ml-1">Cadastre-se</a>
      </p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.js";

export default {
  name: "Login",

  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      errorMessage: null,
      loading: false,
    }
  },

  methods: {
    async handleLogin() {
      const auth = useAuthStore()

      this.errorMessage = null
      this.loading = true

      try {
        await auth.login(this.form.email, this.form.password)

        // redireciona se deu certo
        this.$router.push("/dashboard")
      } catch (err) {
        this.errorMessage = err.message || "Falha no login"
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
