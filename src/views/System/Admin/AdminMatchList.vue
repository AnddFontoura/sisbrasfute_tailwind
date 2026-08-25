<template>
  <system-layout>
    <main class="mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Administração - Partidas</h1>

      <!-- FILTROS (colapsável) -->
      <div class="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome do time</label>
              <input
                v-model="filters.team_name"
                type="text"
                placeholder="Ex: Flamengo"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <state-select v-model="filters.state_id"></state-select>
            <city-select :stateId="filters.state_id" v-model="filters.city_id"></city-select>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Período</label>
              <div class="flex items-center gap-2 mt-1">
                <input
                  v-model="filters.date_start"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <span class="text-gray-400 text-xs shrink-0">até</span>
                <input
                  v-model="filters.date_end"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
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

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="matches.data.length === 0"
        class="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
      >
        Nenhuma partida encontrada.
      </div>

      <!-- Table -->
      <div v-else class="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-white/10">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Meu time</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Adversário</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Data</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Cidade</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Estado</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            <tr v-for="match in matches.data" :key="match.id" class="hover:bg-gray-50 dark:hover:bg-white/5 transition">
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ match.my_team_name }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ match.enemy_team_name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{{ match.schedule_br || '—' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{{ match.city_name || '—' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{{ match.state_name || '—' }}</td>
              <td class="px-4 py-3">
                <router-link
                  :to="{ name: 'matches-show', params: { id: match.id } }"
                  class="inline-flex items-center rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
                >
                  Visualizar
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <pagination-component :pagination="matches" @change="getMatchesList"></pagination-component>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue";
import CitySelect from "@/components/form/CitySelectComponent.vue";
import systemLayout from "@/components/layouts/systemLayout.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import Swal from "@/services/swal.js";

export default {
  name: "AdminMatchList",
  components: {
    CitySelect,
    StateSelect,
    systemLayout,
    PaginationComponent,
  },
  data() {
    return {
      filters: {
        team_name: '',
        state_id: null,
        city_id: null,
        date_start: null,
        date_end: null,
      },
      matches: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      loading: false,
      showFilters: false,
    };
  },
  created() {
    this.getMatchesList();
  },
  computed: {
    hasActiveFilters() {
      return !!(
        this.filters.team_name ||
        this.filters.state_id ||
        this.filters.city_id ||
        this.filters.date_start ||
        this.filters.date_end
      );
    },
  },
  methods: {
    async getMatchesList(page = 1) {
      this.loading = true;
      try {
        const response = await api.get('/admin/matches', {
          params: {
            page,
            per_page: 15,
            team_name: this.filters.team_name || undefined,
            state_id: this.filters.state_id || undefined,
            city_id: this.filters.city_id || undefined,
            date_start: this.filters.date_start || undefined,
            date_end: this.filters.date_end || undefined,
          },
        });
        this.matches = response.data;
      } catch (err) {
        console.error(err);
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar partidas',
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    applyFilters() {
      this.getMatchesList(1);
    },

    resetFilters() {
      this.filters = {
        team_name: '',
        state_id: null,
        city_id: null,
        date_start: null,
        date_end: null,
      };
      this.getMatchesList(1);
    },
  },
};
</script>
