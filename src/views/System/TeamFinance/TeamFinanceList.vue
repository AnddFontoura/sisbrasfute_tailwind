<template>
  <system-layout>
    <!-- Team Banner -->
    <team-banner :team-info-id="teamId"></team-banner>

    <div class="space-y-6 mt-6">

      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Financeiro do Time</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Controle de entradas e saídas financeiras.</p>
        </div>
        <router-link
          :to="{ name: 'team-finance-form', params: { teamId: this.teamId } }"
          class="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
        >
          + Nova Movimentação
        </router-link>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
            <svg class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Entradas</p>
            <p class="text-sm font-bold text-green-600 dark:text-green-400">{{ formatCurrency(totalCredits) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
            <svg class="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Saídas</p>
            <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ formatCurrency(totalDebits) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <svg class="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Saldo</p>
            <p class="text-sm font-bold" :class="balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ formatCurrency(balance) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Filtros (colapsável) -->
      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
        <button
          type="button"
          @click="showFilters = !showFilters"
          class="flex w-full items-center justify-between px-5 py-4"
        >
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
            <span class="text-sm font-bold text-gray-800 dark:text-white">Filtros</span>
            <span v-if="hasActiveFilters" class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">!</span>
          </div>
          <svg
            class="h-4 w-4 text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': showFilters }"
            fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <div v-show="showFilters" class="border-t border-gray-200 dark:border-white/10 px-5 pb-5 pt-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Tipo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo</label>
              <select
                v-model="filters.type"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option value="">Todos</option>
                <option value="1">Crédito (entrada)</option>
                <option value="0">Débito (saída)</option>
              </select>
            </div>

            <!-- Razão -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Razão</label>
              <select
                v-model="filters.reason_id"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option value="">Todas as razões</option>
                <option v-for="reason in reasons" :key="reason.id" :value="reason.id">
                  {{ reason.name }}
                </option>
              </select>
            </div>

            <!-- Jogador -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Jogador</label>
              <select
                v-model="filters.team_player_id"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option value="">Todos os jogadores</option>
                <option v-for="player in players" :key="player.id" :value="player.id">
                  {{ player.nickname || player.name }}
                </option>
              </select>
            </div>

            <!-- Data início -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Data início</label>
              <input
                v-model="filters.date_start"
                type="date"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <!-- Data fim -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Data fim</label>
              <input
                v-model="filters.date_end"
                type="date"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <!-- Valor mínimo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Valor mínimo (R$)</label>
              <input
                v-model="filters.value_min"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <!-- Valor máximo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Valor máximo (R$)</label>
              <input
                v-model="filters.value_max"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="resetFilters"
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 dark:text-gray-300"
            >
              Limpar
            </button>
            <button
              @click="applyFilters"
              class="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 shadow-sm transition"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tipo</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Valor</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Razão</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Jogador</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Partida</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Data</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="finance in finances"
                :key="finance.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    :class="Number(finance.type) === 1
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'"
                  >
                    {{ Number(finance.type) === 1 ? 'Crédito' : 'Débito' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(finance.value) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  <span v-if="finance.reason_info" class="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                    {{ finance.reason_info.name }}
                  </span>
                  <span v-else-if="finance.description" class="truncate max-w-[180px] inline-block" :title="finance.description">
                    {{ finance.description }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  <span v-if="finance.team_player_info">
                    {{ finance.team_player_info.nickname || finance.team_player_info.name || '-' }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  <button
                    v-if="finance.match_info"
                    type="button"
                    class="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium underline-offset-2 hover:underline"
                    @click="$router.push({ name: 'matches-show', params: { id: finance.match_id } })"
                  >
                    {{ finance.match_info.home_team_name || 'Time' }} vs {{ finance.match_info.visitor_team_name || 'Adv.' }}
                  </button>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(finance.created_at) }}
                </td>
                <td class="px-4 py-3">
                  <router-link
                    :to="{ name: 'team-edit-finance', params: { teamId: teamId, id: finance.id } }"
                    class="inline-flex items-center rounded-md bg-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors"
                  >
                    Editar
                  </router-link>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="!finances.length && !loading">
                <td colspan="7" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    <p class="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">Nenhuma movimentação financeira encontrada.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <pagination-component :pagination="pagination" @change="getFinancesList"></pagination-component>

    </div>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import Swal from "@/services/swal.js";

export default {
  name: "TeamFinanceList",
  components: {
    systemLayout,
    TeamBanner,
    PaginationComponent,
  },

  data() {
    return {
      teamId: null,
      finances: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      loading: false,
      showFilters: false,
      filters: {
        type: '',
        reason_id: '',
        team_player_id: '',
        date_start: '',
        date_end: '',
        value_min: '',
        value_max: '',
      },
      reasons: [],
      players: [],
    }
  },

  created() {
    this.teamId = this.$route.params.teamId
    this.loadFilterOptions()
    this.getFinancesList()
  },

  computed: {
    totalCredits() {
      return this.finances
        .filter(f => Number(f.type) === 1)
        .reduce((sum, f) => sum + Number(f.value || 0), 0)
    },
    totalDebits() {
      return this.finances
        .filter(f => Number(f.type) === 0)
        .reduce((sum, f) => sum + Number(f.value || 0), 0)
    },
    balance() {
      return this.totalCredits - this.totalDebits
    },
    hasActiveFilters() {
      return !!(
        this.filters.type ||
        this.filters.reason_id ||
        this.filters.team_player_id ||
        this.filters.date_start ||
        this.filters.date_end ||
        this.filters.value_min ||
        this.filters.value_max
      )
    },
  },

  methods: {
    async loadFilterOptions() {
      try {
        const [reasonsRes, playersRes] = await Promise.all([
          api.get(`/team/${this.teamId}/finance-reasons`),
          api.get(`/team-player/${this.teamId}/list`),
        ])
        this.reasons = reasonsRes.data || []
        const playersData = playersRes.data?.data || playersRes.data || []
        this.players = Array.isArray(playersData) ? playersData : []
      } catch (err) {
        console.error('Erro ao carregar opções de filtros:', err)
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(value || 0))
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },

    applyFilters() {
      this.getFinancesList(1)
    },

    resetFilters() {
      this.filters = {
        type: '',
        reason_id: '',
        team_player_id: '',
        date_start: '',
        date_end: '',
        value_min: '',
        value_max: '',
      }
      this.getFinancesList(1)
    },

    async getFinancesList(page = 1) {
      this.loading = true
      try {
        const params = { page }

        if (this.filters.type !== '') params.type = this.filters.type
        if (this.filters.reason_id) params.reason_id = this.filters.reason_id
        if (this.filters.team_player_id) params.team_player_id = this.filters.team_player_id
        if (this.filters.date_start) params.date_start = this.filters.date_start
        if (this.filters.date_end) params.date_end = this.filters.date_end
        if (this.filters.value_min) params.value_min = this.filters.value_min
        if (this.filters.value_max) params.value_max = this.filters.value_max

        const response = await api.get("/team-finance/" + this.teamId, { params })
        this.finances = response.data.data || []
        this.pagination = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar dados financeiros',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },
  },
};
</script>
