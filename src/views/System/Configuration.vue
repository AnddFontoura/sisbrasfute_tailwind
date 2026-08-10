<template>
  <system-layout>
    <main class="py-4">
      <div class="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Configurações da Conta</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie seus dados pessoais e senha.</p>
        </div>

        <!-- SEÇÃO 1: Dados Pessoais -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Dados Pessoais</h2>

          <form @submit.prevent="handleProfileSubmit" class="space-y-4">
            <!-- Nome -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome completo</label>
              <input
                v-model="profileForm.name"
                type="text"
                class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-white/5 dark:text-white"
                :class="profileErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
              />
              <p v-if="profileErrors.name" class="mt-1 text-xs text-red-600">{{ profileErrors.name }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-white/5 dark:text-white"
                :class="profileErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
              />
              <p v-if="profileErrors.email" class="mt-1 text-xs text-red-600">{{ profileErrors.email }}</p>
            </div>

            <!-- CPF -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">CPF</label>
              <input
                v-model="profileForm.cpf"
                type="text"
                placeholder="000.000.000-00"
                maxlength="14"
                class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-white/5 dark:text-white"
                :class="profileErrors.cpf ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
                @input="formatCpf"
              />
              <p v-if="profileErrors.cpf" class="mt-1 text-xs text-red-600">{{ profileErrors.cpf }}</p>
              <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                O CPF é necessário para realizar pagamentos através da aplicação.
              </p>
            </div>

            <!-- RG -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">RG</label>
              <input
                v-model="profileForm.rg"
                type="text"
                placeholder="00.000.000-0"
                maxlength="12"
                class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-white/5 dark:text-white"
                :class="profileErrors.rg ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
              />
              <p v-if="profileErrors.rg" class="mt-1 text-xs text-red-600">{{ profileErrors.rg }}</p>
            </div>

            <button
              type="submit"
              :disabled="profileLoading"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="profileLoading" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              {{ profileLoading ? 'Salvando...' : 'Salvar dados pessoais' }}
            </button>
          </form>
        </div>

        <!-- SEÇÃO 2: Alterar Senha -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Alterar Senha</h2>

          <form @submit.prevent="handlePasswordSubmit" class="space-y-4">
            <!-- Senha atual -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Senha atual</label>
              <input
                v-model="passwordForm.current_password"
                type="password"
                class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-white/5 dark:text-white"
                :class="passwordErrors.current_password ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
              />
              <p v-if="passwordErrors.current_password" class="mt-1 text-xs text-red-600">{{ passwordErrors.current_password }}</p>
            </div>

            <!-- Nova senha -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nova senha</label>
              <input
                v-model="passwordForm.new_password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-white/5 dark:text-white"
                :class="passwordErrors.new_password ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
              />
              <p v-if="passwordErrors.new_password" class="mt-1 text-xs text-red-600">{{ passwordErrors.new_password }}</p>
            </div>

            <!-- Confirmar nova senha -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Confirmar nova senha</label>
              <input
                v-model="passwordForm.new_password_confirmation"
                type="password"
                class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-white/5 dark:text-white"
                :class="passwordErrors.new_password_confirmation ? 'border-red-500' : 'border-gray-300 dark:border-white/10'"
              />
              <p v-if="passwordErrors.new_password_confirmation" class="mt-1 text-xs text-red-600">{{ passwordErrors.new_password_confirmation }}</p>
            </div>

            <button
              type="submit"
              :disabled="passwordLoading"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <svg v-if="passwordLoading" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              {{ passwordLoading ? 'Atualizando...' : 'Alterar senha' }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import api from "@/services/api.js";
import Swal from "@/services/swal.js";

export default {
  name: "Configuration",
  components: { systemLayout },

  data() {
    return {
      profileForm: {
        name: '',
        email: '',
        cpf: '',
        rg: '',
      },
      passwordForm: {
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      },
      profileErrors: {},
      passwordErrors: {},
      profileLoading: false,
      passwordLoading: false,
    }
  },

  created() {
    this.loadUserData()
  },

  methods: {
    async loadUserData() {
      try {
        const response = await api.get('/configuration')
        this.profileForm.name = response.data.name || ''
        this.profileForm.email = response.data.email || ''
        this.profileForm.cpf = response.data.cpf || ''
        this.profileForm.rg = response.data.rg || ''
      } catch (err) {
        console.error(err)
      }
    },

    formatCpf() {
      let value = this.profileForm.cpf.replace(/\D/g, '')
      if (value.length > 11) value = value.slice(0, 11)

      if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
      } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
      } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2')
      }

      this.profileForm.cpf = value
    },

    async handleProfileSubmit() {
      this.profileErrors = {}
      this.profileLoading = true

      try {
        const response = await api.post('/configuration/profile', this.profileForm)

        // Atualiza localStorage com novos dados
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        user.name = response.data.user.name
        user.email = response.data.user.email
        localStorage.setItem('user', JSON.stringify(user))

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Dados atualizados com sucesso!',
          showConfirmButton: false,
          timer: 2500,
        })
      } catch (err) {
        if (err.response?.status === 422 && err.response.data?.errors) {
          const errors = err.response.data.errors
          this.profileErrors = {
            name: errors.name?.[0] || null,
            email: errors.email?.[0] || null,
            cpf: errors.cpf?.[0] || null,
            rg: errors.rg?.[0] || null,
          }
        } else {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: err.response?.data?.message || 'Erro ao salvar dados.',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      } finally {
        this.profileLoading = false
      }
    },

    async handlePasswordSubmit() {
      this.passwordErrors = {}

      // Validação client-side
      if (!this.passwordForm.current_password) {
        this.passwordErrors.current_password = 'Informe a senha atual.'
        return
      }
      if (!this.passwordForm.new_password || this.passwordForm.new_password.length < 8) {
        this.passwordErrors.new_password = 'A nova senha deve ter no mínimo 8 caracteres.'
        return
      }
      if (this.passwordForm.new_password !== this.passwordForm.new_password_confirmation) {
        this.passwordErrors.new_password_confirmation = 'As senhas não coincidem.'
        return
      }

      this.passwordLoading = true

      try {
        await api.post('/configuration/password', this.passwordForm)

        this.passwordForm = { current_password: '', new_password: '', new_password_confirmation: '' }

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Senha atualizada com sucesso!',
          showConfirmButton: false,
          timer: 2500,
        })
      } catch (err) {
        if (err.response?.status === 422 && err.response.data?.errors) {
          const errors = err.response.data.errors
          this.passwordErrors = {
            current_password: errors.current_password?.[0] || null,
            new_password: errors.new_password?.[0] || null,
            new_password_confirmation: errors.new_password_confirmation?.[0] || null,
          }
        } else {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: err.response?.data?.message || 'Erro ao alterar senha.',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      } finally {
        this.passwordLoading = false
      }
    },
  },
}
</script>
