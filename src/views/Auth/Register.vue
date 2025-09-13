<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Criar Conta
      </h2>

      <!-- Formulário -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Nome -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>

          <input
            v-model="form.name"
            type="text"
            id="name"
            required
            placeholder="Seu nome completo"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>

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

        <!-- Confirmação de Senha -->
        <div>
          <label
            for="password_confirmation"
            class="block text-sm font-medium text-gray-700"
          >
            Confirme a Senha
          </label>

          <input
            v-model="form.password_confirmation"
            type="password"
            id="password_confirmation"
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
          Cadastrar
        </button>
      </form>

      <!-- Link Login -->
      <p class="mt-4 text-center text-sm text-gray-600">
        Já tem conta?
        <a href="/login" class="text-indigo-600 hover:underline ml-1">Entrar</a>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "Register",

  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
      }
    }
  },

  methods: {
    async handleRegister() {
      try {
        const response = await axios.post("http://localhost:8000/api/register", {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          password_confirmation: this.form.password_confirmation
        })

        console.log("Registro bem-sucedido:", response.data)

        // Exemplo: redirecionar para login após cadastro
        this.$router.push("/login")
      } catch (error) {
        console.error("Erro no registro:", error.response?.data || error.message)
        alert("Falha ao criar conta. Verifique os dados.")
      }
    }
  }
}
</script>
