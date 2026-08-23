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
        Não há partidas registradas.
      </div>

      <!-- Cards de partidas -->
      <div v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="match in matches.data"
          :key="match.id"
          class="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-500/40 hover:shadow-md dark:border-white/10 dark:bg-gray-800"
        >
          <!-- Header escuro -->
          <div class="rounded-t-2xl bg-gray-900 px-4 py-3 text-center dark:bg-black">
            <p class="text-sm font-bold text-white">
              <template v-if="match.my_team_score !== null && match.enemy_team_score !== null">
                {{ match.my_team_name || 'Meu Time' }}
                <span class="mx-1 text-orange-400 font-black">{{ match.my_team_score }}</span>
                <span v-if="match.has_penalties" class="text-zinc-400">({{ match.my_team_penalty_score }})</span>
                <span class="text-zinc-400">x</span>
                <span v-if="match.has_penalties" class="text-zinc-400">({{ match.enemy_team_penalty_score }})</span>
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

            <!-- Ações -->
            <div class="mt-4 flex gap-2">
              <router-link
                :to="{ name: 'matches-show', params: { id: match.id } }"
                class="inline-flex flex-1 items-center justify-center rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                Visualizar
              </router-link>

              <div v-if="isSameTeam(match.created_by_team_id)" class="relative">
                <button
                  type="button"
                  @click.stop="toggleDropdown(match.id)"
                  class="dropdown-trigger inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                  </svg>
                </button>

                <div
                  v-if="openDropdownId === match.id"
                  class="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-700"
                >
                  <router-link
                    :to="{ name: 'matches-edit', params: { id: match.id } }"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                    </svg>
                    Editar
                  </router-link>
                  <router-link
                    :to="{ name: 'team-matches-manage', params: { teamId: match.created_by_team_id, matchId: match.id } }"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Administrar
                  </router-link>
                  <router-link
                    :to="{ name: 'matches-form', query: { repeatFrom: match.id } }"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 dark:text-orange-300 dark:hover:bg-orange-500/10"
                  >
                    <svg class="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Repetir
                  </router-link>
                </div>
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
      myTeamIds: [],
      loading: false,
      showFilters: false,
      openDropdownId: null,
    }
  },
  created() {
    this.teamId = this.$route.params.teamId ?? null
    this.auth = useAuthStore()
    this.loadMyTeams()
    this.getMatchesList()
  },
  mounted() {
    this._closeDropdowns = (e) => {
      if (this.openDropdownId && !e.target.closest('.dropdown-trigger')) {
        this.openDropdownId = null
      }
    }
    document.addEventListener('click', this._closeDropdowns)
  },
  beforeUnmount() {
    document.removeEventListener('click', this._closeDropdowns)
  },
  computed: {
    user() {
      return this.auth.user
    },
    hasActiveFilters() {
      return !!(this.filters.team_name || this.filters.state_id || this.filters.city_id || this.filters.date_start || this.filters.date_end)
    }
  },
  methods: {
    toggleDropdown(matchId) {
      this.openDropdownId = this.openDropdownId === matchId ? null : matchId
    },
    closeDropdowns() {
      this.openDropdownId = null
    },
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
      return this.myTeamIds.includes(Number(createdByTeamId))
    },

    async loadMyTeams() {
      try {
        const { data } = await api.get('/team/list/my-teams')
        this.myTeamIds = (data.teams || []).map(t => Number(t.id))
      } catch (err) {
        console.error('Erro ao carregar times do usuário:', err)
        this.myTeamIds = []
      }
    },
  },
}
</script>
