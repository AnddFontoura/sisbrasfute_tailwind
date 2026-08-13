<template>
  <system-layout>
    <main class="py-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Administração - Usuários</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lista de usuários cadastrados no sistema.
          </p>
        </div>

        <!-- Filters -->
        <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Name filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Nome</label>
              <input
                v-model="filters.name"
                type="text"
                placeholder="Filtrar por nome..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @input="debouncedFetch"
              >
            </div>

            <!-- Email filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Email</label>
              <input
                v-model="filters.email"
                type="text"
                placeholder="Filtrar por email..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @input="debouncedFetch"
              >
            </div>

            <!-- Email verified filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Email verificado</label>
              <select
                v-model="filters.email_verified"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="fetchUsers(1)"
              >
                <option value="">Todos</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>

            <!-- Has player profile filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Perfil de jogador</label>
              <select
                v-model="filters.has_player_profile"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="fetchUsers(1)"
              >
                <option value="">Todos</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>

          <!-- Page size selector -->
          <div class="mt-4 flex items-center gap-2">
            <label class="text-xs font-semibold text-gray-600 dark:text-gray-300">Itens por página:</label>
            <select
              v-model="perPage"
              class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              @change="fetchUsers(1)"
            >
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="30">30</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
        </div>

        <!-- Empty state -->
        <div v-else-if="users.length === 0" class="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          Nenhum usuário encontrado.
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
          <table class="w-full text-sm text-left">
            <thead class="border-b border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Nome</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Email</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Email verificado</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Perfil de jogador</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-white/5">
              <tr
                v-for="user in users"
                :key="user.id"
                class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <td class="px-4 py-3 text-gray-900 dark:text-white">{{ user.name }}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ user.email }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="user.email_verified
                      ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'"
                  >
                    {{ user.email_verified ? 'Verificado' : 'Não verificado' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="user.has_player_profile
                      ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400'"
                  >
                    {{ user.has_player_profile ? 'Com perfil' : 'Sem perfil' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-md bg-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors"
                    @click="openDetailModal(user)"
                  >
                    Ver detalhes
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <pagination-component :pagination="pagination" @change="fetchUsers"></pagination-component>
      </div>
    </main>

    <!-- User Detail Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    >
      <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div class="flex items-start justify-between gap-4 mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Detalhes do Usuário
          </h2>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            @click="closeDetailModal"
          >
            ×
          </button>
        </div>

        <!-- Loading state in modal -->
        <div v-if="modalLoading" class="flex items-center justify-center py-8">
          <svg class="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando detalhes...</span>
        </div>

        <!-- User detail data -->
        <div v-else-if="selectedUser">
          <!-- User Data Section -->
          <div class="mb-6">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 dark:text-gray-400">Dados do Usuário</h3>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">ID</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.id }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Nome</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.name }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Email</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.email }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Email verificado em</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.email_verified_at || 'Não verificado' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">CPF</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.cpf || '—' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">RG</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.rg || '—' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Administrador</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.is_admin ? 'Sim' : 'Não' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Idioma</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.language || '—' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Criado em</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.created_at || '—' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Atualizado em</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.updated_at || '—' }}</dd>
              </div>
            </dl>
          </div>

          <!-- Player Profile Section -->
          <div v-if="selectedUser.player_profile" class="border-t border-gray-200 pt-6 dark:border-white/10">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 dark:text-gray-400">Perfil de Jogador</h3>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Nome</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.player_profile.name }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Apelido</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ selectedUser.player_profile.nickname || '—' }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Foto</dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  <img
                    v-if="selectedUser.player_profile.photo_url"
                    :src="selectedUser.player_profile.photo_url"
                    :alt="selectedUser.player_profile.name"
                    class="w-16 h-16 rounded-lg object-cover mt-1"
                  >
                  <span v-else>—</span>
                </dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Posições</dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  <ul v-if="selectedUser.player_profile.positions && selectedUser.player_profile.positions.length" class="list-disc list-inside">
                    <li v-for="position in selectedUser.player_profile.positions" :key="position.id">
                      {{ position.name }}
                    </li>
                  </ul>
                  <span v-else>Nenhuma posição cadastrada</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Close button -->
        <div class="mt-6 flex justify-end">
          <button
            type="button"
            class="rounded-xl border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            @click="closeDetailModal"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import Swal from "@/services/swal.js";

export default {
  name: "AdminUserList",
  components: {
    systemLayout,
    PaginationComponent,
  },
  data() {
    return {
      users: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      filters: {
        name: "",
        email: "",
        email_verified: "",
        has_player_profile: "",
      },
      perPage: 15,
      loading: false,
      showModal: false,
      modalLoading: false,
      selectedUser: null,
      debounceTimer: null,
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    debouncedFetch() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchUsers(1)
      }, 400)
    },

    async fetchUsers(page = 1) {
      this.loading = true

      try {
        const params = {
          page: page,
          per_page: this.perPage,
        }

        if (this.filters.name) {
          params.name = this.filters.name
        }
        if (this.filters.email) {
          params.email = this.filters.email
        }
        if (this.filters.email_verified) {
          params.email_verified = this.filters.email_verified
        }
        if (this.filters.has_player_profile) {
          params.has_player_profile = this.filters.has_player_profile
        }

        const response = await api.get("/admin/users", { params })
        this.users = response.data.data
        this.pagination = response.data
      } catch {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar usuários",
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    async openDetailModal(user) {
      this.showModal = true
      this.modalLoading = true
      this.selectedUser = null

      try {
        const response = await api.get(`/admin/users/${user.id}`)
        this.selectedUser = response.data
      } catch {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar detalhes do usuário",
          showConfirmButton: false,
          timer: 3000,
        })
        this.showModal = false
      } finally {
        this.modalLoading = false
      }
    },

    closeDetailModal() {
      this.showModal = false
      this.selectedUser = null
    },
  },
}
</script>
