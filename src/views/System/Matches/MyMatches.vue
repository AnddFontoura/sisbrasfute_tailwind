<template>
  <system-layout>
    <main class="py-4">
      <div class="max-w-6xl mx-auto space-y-6">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">Minhas Partidas</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Partidas criadas pelos times que você administra.</p>
          </div>
          <label class="inline-flex items-center gap-2 cursor-pointer">
            <input
              v-model="showInactive"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Mostrar inativas</span>
          </label>
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
        <div v-else-if="filteredMatches.length === 0" class="rounded-xl border border-amber-200 bg-amber-50 px-5 py-6 text-center dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <p class="text-sm text-amber-800 dark:text-amber-300">
            {{ showInactive ? 'Nenhuma partida encontrada.' : 'Nenhuma partida ativa encontrada.' }}
          </p>
        </div>

        <!-- Match Cards -->
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="match in filteredMatches"
            :key="match.id"
            class="group overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-md"
            :class="match.status === 0
              ? 'border-red-200 bg-red-50/50 dark:border-red-500/20 dark:bg-red-900/10'
              : 'border-gray-200 bg-white hover:border-orange-500/40 dark:border-white/10 dark:bg-gray-800'"
          >
            <!-- Header -->
            <div class="bg-gray-900 px-4 py-3 text-center dark:bg-black relative">
              <span
                v-if="match.status === 0"
                class="absolute top-2 right-2 inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white"
              >
                Inativa
              </span>
              <p class="text-sm font-bold text-white">
                <template v-if="match.my_team_score !== null && match.enemy_team_score !== null">
                  {{ match.my_team_name || 'Meu Time' }}
                  <span class="mx-1 text-orange-400 font-black">{{ match.my_team_score }}</span>
                  <span class="text-zinc-400">x</span>
                  <span class="mx-1 text-orange-400 font-black">{{ match.enemy_team_score }}</span>
                  {{ match.enemy_team_name || 'Adversário' }}
                </template>
                <template v-else>
                  {{ match.my_team_name || 'Meu Time' }}
                  <span class="mx-2 text-orange-400">VS</span>
                  {{ match.enemy_team_name || 'Adversário' }}
                </template>
              </p>
              <p class="mt-1 text-xs text-zinc-400">{{ match.schedule_br || 'Data não definida' }}</p>
            </div>

            <!-- Body -->
            <div class="px-4 py-4">
              <div class="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Cidade</p>
                  <p class="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{{ match.city_info?.name ?? '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Estado</p>
                  <p class="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{{ match.city_info?.state_info?.name ?? '—' }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-4 flex flex-col gap-2">
                <router-link
                  :to="{ name: 'matches-show', params: { id: match.id } }"
                  class="inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
                >
                  Visualizar
                </router-link>
                <div class="grid grid-cols-2 gap-2">
                  <router-link
                    :to="{ name: 'matches-edit', params: { id: match.id } }"
                    class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Editar
                  </router-link>
                  <router-link
                    :to="{ name: 'team-matches-manage', params: { teamId: match.created_by_team_id, matchId: match.id } }"
                    class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Administrar
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import api from "@/services/api.js";

export default {
  name: "MyMatches",
  components: {
    systemLayout,
  },

  data() {
    return {
      matches: [],
      loading: false,
      showInactive: false,
    }
  },

  computed: {
    filteredMatches() {
      if (this.showInactive) {
        return this.matches
      }
      return this.matches.filter(m => m.status !== 0)
    },
  },

  created() {
    this.loadMatches()
  },

  methods: {
    async loadMatches() {
      this.loading = true
      try {
        const response = await api.get('/matches/my-matches')
        this.matches = response.data || []
      } catch (err) {
        console.error('Erro ao carregar minhas partidas:', err)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
