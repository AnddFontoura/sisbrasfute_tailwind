<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      />

      <div v-if="teamId" class="mt-4">
        <router-link
          :to="{ name: 'team-matches-form', params: { teamId: teamId } }"
          class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Registrar nova partida
        </router-link>
      </div>

      <!-- FILTROS -->
      <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-gray-800 dark:text-white">Filtros</h2>
          <button @click="resetFilters" class="text-xs font-medium text-gray-500 hover:text-orange-500 transition">
            Limpar filtros
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-2">
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

          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Período</label>
            <div class="flex items-center gap-2 mt-1">
              <input
                v-model="filters.date_start"
                type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <span class="text-gray-400 text-xs">até</span>
              <input
                v-model="filters.date_end"
                type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-5">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
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
        Não há partidas registradas.
      </div>

      <!-- Cards de partidas -->
      <div v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="match in matches.data"
          :key="match.id"
          class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-500/40 hover:shadow-md dark:border-white/10 dark:bg-gray-800"
        >
          <!-- Header escuro -->
          <div class="bg-gray-900 px-4 py-3 text-center dark:bg-black">
            <p class="text-sm font-bold text-white">
              {{ match.home_team_name || 'Time A' }}
              <span class="mx-2 text-orange-400">VS</span>
              {{ match.visitor_team_name || 'Time B' }}
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

            <!-- Ações -->
            <div class="mt-4 flex flex-col gap-2">
              <router-link
                :to="{ name: 'matches-show', params: { id: match.id } }"
                class="inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                Visualizar
              </router-link>

              <div v-if="isSameTeam(match.created_by_team_id)" class="grid grid-cols-2 gap-2">
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
    </main>

    <pagination-component :pagination="matches" @change="getMatchesList"></pagination-component>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue"
import CitySelect from "@/components/form/CitySelectComponent.vue"
import systemLayout from "@/components/layouts/systemLayout.vue";
import {useAuthStore} from "@/stores/auth.js";
import TeamBanner from "@/components/team/teamBanner.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import Swal from "@/services/swal.js";

export default {
  name: "MatchesList",
  components: {
    TeamBanner,
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
        date_end: null
      },
      matches: {
        data: [],
        current_page: 1,
        last_page: 1
      },
      teamId: null,
      loading: false,
    }
  },
  created() {
    this.teamId = this.$route.params.teamId ?? null
    this.auth = useAuthStore()
    this.getMatchesList()
  },
  computed: {
    user() {
      return this.auth.user
    }
  },
  methods: {
    async getMatchesList(page = 1) {
      this.loading = true
      try {
        const response = await api.get('/matches', {
          params: {
            page,
            team_id: this.teamId,
            team_name: this.filters.team_name,
            state_id: this.filters.state_id,
            city_id: this.filters.city_id,
            date_start: this.filters.date_start,
            date_end: this.filters.date_end
          }
        })
        this.matches = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar partidas',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    applyFilters() {
      this.getMatchesList(1)
    },

    resetFilters() {
      this.filters = { team_name: '', state_id: null, city_id: null, date_start: null, date_end: null }
      this.getMatchesList(1)
    },

    isSameTeam(createdByTeamId) {
      if (!createdByTeamId) return false
      if (this.teamId) return Number(createdByTeamId) === Number(this.teamId)
      return true
    },
  },
}
</script>
