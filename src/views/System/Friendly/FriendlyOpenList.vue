<template>
  <system-layout>
    <main>
      <div class="space-y-6">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">Amistosos Disponíveis</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Partidas abertas esperando um adversário. Desafie um time!</p>
          </div>
        </div>

        <!-- Filters -->
        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
          <div class="px-5 py-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Estado</label>
                <state-select v-model="filters.state_id" @update:modelValue="onStateChange"></state-select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Cidade</label>
                <city-select :stateId="filters.state_id" v-model="filters.city_id" @update:modelValue="loadMatches"></city-select>
              </div>
              <div class="flex items-end">
                <button
                  @click="resetFilters"
                  class="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 dark:text-gray-300"
                >
                  Limpar
                </button>
              </div>
            </div>
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

        <!-- Empty -->
        <div v-else-if="matches.length === 0" class="rounded-xl border border-gray-200 bg-gray-50 px-5 py-8 text-center dark:border-white/10 dark:bg-gray-800">
          <p class="text-sm text-gray-500 dark:text-gray-400">Nenhum amistoso aberto no momento.</p>
        </div>

        <!-- Cards -->
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="match in matches"
            :key="match.id"
            class="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-500/40 hover:shadow-md dark:border-white/10 dark:bg-gray-800"
          >
            <!-- Header -->
            <div class="rounded-t-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-center">
              <p class="text-sm font-bold text-white">
                {{ match.my_team_name || match.my_team_info?.name || 'Time' }}
                <span class="mx-2 text-orange-200">procura adversário</span>
              </p>
            </div>

            <!-- Body -->
            <div class="px-4 py-4 space-y-3">
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

              <div class="text-center">
                <p class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Data</p>
                <p class="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{{ match.schedule_br || '—' }}</p>
              </div>

              <!-- Actions -->
              <div class="pt-2">
                <router-link
                  :to="{ name: 'matches-show', params: { id: match.id } }"
                  class="inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-600"
                >
                  Ver detalhes e desafiar
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <pagination-component :pagination="pagination" @change="loadMatches"></pagination-component>
      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import StateSelect from "@/components/form/StateSelectComponent.vue";
import CitySelect from "@/components/form/CitySelectComponent.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import api from "@/services/api.js";

export default {
  name: "FriendlyOpenList",
  components: {
    systemLayout,
    StateSelect,
    CitySelect,
    PaginationComponent,
  },

  data() {
    return {
      matches: [],
      pagination: { data: [], current_page: 1, last_page: 1 },
      loading: false,
      filters: {
        state_id: null,
        city_id: null,
      },
    }
  },

  created() {
    this.loadMatches()
  },

  methods: {
    async loadMatches(page = 1) {
      this.loading = true
      try {
        const params = { page }
        if (this.filters.state_id) params.state_id = this.filters.state_id
        if (this.filters.city_id) params.city_id = this.filters.city_id

        const response = await api.get('/match-challenges/open', { params })
        this.matches = response.data.data || []
        this.pagination = response.data
      } catch (err) {
        console.error('Erro ao carregar amistosos:', err)
      } finally {
        this.loading = false
      }
    },

    onStateChange() {
      this.filters.city_id = null
      this.loadMatches()
    },

    resetFilters() {
      this.filters = { state_id: null, city_id: null }
      this.loadMatches()
    },
  },
}
</script>
