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
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700"
          >
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
import axios from "axios"

export default {
  name: "Login",

  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    }
  },

  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:8000/api/login", {
          email: this.form.email,
          password: this.form.password
        })

        console.log("Login bem-sucedido:", response.data)

        // exemplo: salvar token no localStorage
        localStorage.setItem("token", response.data.token)

        // redirecionar para dashboard
        this.$router.push("/dashboard")
      } catch (error) {
        console.error("Erro no login:", error.response?.data || error.message)
        alert("Falha ao fazer login. Verifique suas credenciais.")
      }
    }
  }
}
</script>
