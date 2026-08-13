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
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="finance in finances"
                :key="finance.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <!-- Tipo -->
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

                <!-- Valor -->
                <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(finance.value) }}
                </td>

                <!-- Razão -->
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  <span v-if="finance.reason_info" class="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                    {{ finance.reason_info.name }}
                  </span>
                  <span v-else-if="finance.description" class="truncate max-w-[180px] inline-block" :title="finance.description">
                    {{ finance.description }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>

                <!-- Jogador -->
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  <span v-if="finance.team_player_info">
                    {{ finance.team_player_info.nickname || finance.team_player_info.name || '-' }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>

                <!-- Partida -->
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

                <!-- Data -->
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(finance.created_at) }}
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="!finances.length && !loading">
                <td colspan="6" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    <p class="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">Nenhuma movimentação financeira encontrada.</p>
                    <router-link
                      :to="{ name: 'team-finance-form', params: { teamId: this.teamId } }"
                      class="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                    >
                      Registrar a primeira movimentação →
                    </router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import Swal from "@/services/swal.js";

export default {
  name: "TeamFinanceList",
  components: {
    systemLayout,
    TeamBanner,
  },

  data() {
    return {
      teamId: null,
      finances: [],
      loading: false,
    }
  },

  created() {
    this.teamId = this.$route.params.teamId
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
  },

  methods: {
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

    async getFinancesList() {
      this.loading = true
      try {
        const response = await api.get("/team-finance/" + this.teamId)
        this.finances = response.data || []
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
