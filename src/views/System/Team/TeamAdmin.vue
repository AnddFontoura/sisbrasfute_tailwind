<template>
  <system-layout>
    <!-- Team Banner -->
    <team-banner :team-data="team" />

    <div class="mx-auto max-w-5xl space-y-6 mt-6">

      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Resumo da situação atual do time.</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <!-- Pending Applications -->
        <router-link
          :to="{ name: 'team-application-list', params: { teamId: teamId } }"
          class="flex items-center gap-4 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-700 transition-all cursor-pointer"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
            <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Recrutas pendentes</p>
            <div class="flex items-baseline gap-2">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                <span v-if="loadingApplications" class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></span>
                <span v-else>{{ pendingApplications }}</span>
              </p>
              <span v-if="pendingApplications > 0" class="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                aguardando
              </span>
            </div>
          </div>
          <svg v-if="pendingApplications > 0" class="h-5 w-5 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </router-link>

        <!-- Financial Balance -->
        <router-link
          :to="{ name: 'team-finance-list', params: { teamId: teamId } }"
          class="flex items-center gap-4 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-700 transition-all cursor-pointer"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-xl" :class="balance >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'">
            <svg class="h-6 w-6" :class="balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Saldo do time</p>
            <p class="text-2xl font-bold" :class="balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              <span v-if="loadingFinance" class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></span>
              <span v-else>{{ formatCurrency(balance) }}</span>
            </p>
          </div>
          <svg class="h-5 w-5 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </router-link>

        <!-- Upcoming Matches -->
        <router-link
          :to="{ name: 'team-matches-list', params: { teamId: teamId } }"
          class="flex items-center gap-4 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-700 transition-all cursor-pointer"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Jogos futuros</p>
            <div class="flex items-baseline gap-2">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                <span v-if="loadingMatches" class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></span>
                <span v-else>{{ upcomingMatches }}</span>
              </p>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                marcados
              </span>
            </div>
          </div>
          <svg class="h-5 w-5 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </router-link>

      </div>

      <!-- Quick Actions -->
      <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Ações rápidas</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <router-link
            :to="{ name: 'team-matches-form', params: { teamId: teamId } }"
            class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
          >
            <svg class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Nova Partida</span>
          </router-link>

          <router-link
            :to="{ name: 'team-finance-form', params: { teamId: teamId } }"
            class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
          >
            <svg class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Nova Movimentação</span>
          </router-link>

          <router-link
            :to="{ name: 'team-players-list', params: { teamId: teamId } }"
            class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
          >
            <svg class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Jogadores</span>
          </router-link>

          <router-link
            :to="{ name: 'team-tags', params: { teamId: teamId } }"
            class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
          >
            <svg class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">Tags</span>
          </router-link>
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
  name: "TeamAdmin",
  components: {
    TeamBanner,
    systemLayout,
  },
  data() {
    return {
      teamId: null,
      team: {},
      loading: false,
      loadingApplications: true,
      loadingFinance: true,
      loadingMatches: true,
      pendingApplications: 0,
      balance: 0,
      upcomingMatches: 0,
    }
  },
  created() {
    this.teamId = this.$route.params.id
    this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      await this.getTeamInformation()
      // Load all summaries in parallel
      await Promise.allSettled([
        this.loadPendingApplications(),
        this.loadFinanceSummary(),
        this.loadUpcomingMatches(),
      ])
    },

    async getTeamInformation() {
      if (!this.teamId) return

      this.loading = true
      try {
        const response = await api.get("/team/show/" + this.teamId)
        this.team = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar dados do time',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    async loadPendingApplications() {
      try {
        const response = await api.get(`/team-application/${this.teamId}/list`)
        const data = response.data?.data || response.data || []
        this.pendingApplications = Array.isArray(data) ? data.length : 0
      } catch (err) {
        console.error("Erro ao carregar aplicações:", err)
        this.pendingApplications = 0
      } finally {
        this.loadingApplications = false
      }
    },

    async loadFinanceSummary() {
      try {
        const response = await api.get(`/team-finance/${this.teamId}`)
        const finances = response.data || []
        const credits = finances.filter(f => Number(f.type) === 1).reduce((sum, f) => sum + Number(f.value || 0), 0)
        const debits = finances.filter(f => Number(f.type) === 0).reduce((sum, f) => sum + Number(f.value || 0), 0)
        this.balance = credits - debits
      } catch (err) {
        console.error("Erro ao carregar finanças:", err)
        this.balance = 0
      } finally {
        this.loadingFinance = false
      }
    },

    async loadUpcomingMatches() {
      try {
        const response = await api.get('/matches', { params: { teamId: this.teamId } })
        const matches = response.data?.data || response.data || []
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        this.upcomingMatches = matches.filter(m => {
          if (!m.schedule) return false
          const matchDate = new Date(m.schedule)
          return matchDate >= now
        }).length
      } catch (err) {
        console.error("Erro ao carregar partidas:", err)
        this.upcomingMatches = 0
      } finally {
        this.loadingMatches = false
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(value || 0))
    },
  },
}
</script>
