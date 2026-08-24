<template>
  <system-layout>
    <!-- Team Banner -->
    <team-banner :team-info-id="teamId"></team-banner>

    <div class="space-y-6 mt-6">

      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Recebíveis do Time</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Valores recebidos a partir de pagamentos de posições em partidas.</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
      </div>

      <template v-else>
        <!-- Total Available Balance Card -->
        <div class="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <svg class="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Saldo Disponível</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(totalAvailableCents) }}</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!receivables.length" class="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
          <div class="flex flex-col items-center">
            <svg class="h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            <p class="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">Nenhum recebível encontrado.</p>
            <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Os recebíveis aparecerão aqui quando jogadores pagarem por posições nas partidas do time.</p>
          </div>
        </div>

        <!-- Receivables List (grouped by match) -->
        <div v-else class="space-y-4">
          <div
            v-for="group in receivables"
            :key="group.match_id"
            class="rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <!-- Match Info -->
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <svg class="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ group.match_info || 'Partida' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(group.match_date) }}
                  </p>
                </div>
              </div>

              <!-- Match Summary -->
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Posições pagas</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ group.paid_positions_count }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Total recebido</p>
                  <p class="text-sm font-bold text-green-600 dark:text-green-400">{{ formatCurrency(group.total_earned_cents) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

    </div>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import Swal from "@/services/swal.js";

export default {
  name: "TeamReceivables",
  components: {
    systemLayout,
    TeamBanner,
  },

  data() {
    return {
      teamId: null,
      totalAvailableCents: 0,
      receivables: [],
      loading: false,
    }
  },

  created() {
    this.teamId = this.$route.params.teamId
    this.fetchReceivables()
  },

  methods: {
    async fetchReceivables() {
      this.loading = true
      try {
        const response = await api.get(`/team/${this.teamId}/receivables`)
        const data = response.data

        this.totalAvailableCents = data.total_available_cents || 0
        this.receivables = data.receivables || []
      } catch (err) {
        console.error('Erro ao carregar recebíveis:', err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar recebíveis do time',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    formatCurrency(cents) {
      const value = Number(cents || 0) / 100
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
  },
};
</script>
