<template>
  <system-layout>
    <main>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Meus Times</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie e visualize seus times cadastrados.</p>
        </div>
        <router-link
          :to="{ name: 'team-form' }"
          class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Criar Time
        </router-link>
      </div>

      <!-- Filtros -->
      <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-gray-800 dark:text-white">Filtros</h2>
          <button @click="resetFilters" class="text-xs font-medium text-gray-500 hover:text-orange-500 transition">Limpar</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Nome -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome</label>
            <input
              v-model="filters.name"
              type="text"
              placeholder="Buscar por nome..."
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              @input="debounceSearch"
            />
          </div>

          <!-- Estado -->
          <div>
            <state-select-component
              v-model="filters.state_id"
              label-name="Estado"
              @update:modelValue="onStateChange"
            />
          </div>

          <!-- Cidade -->
          <div>
            <city-select-component
              v-model="filters.city_id"
              label-name="Cidade"
              :state-id="filters.state_id"
              @update:modelValue="applyFilters"
            />
          </div>

          <!-- Modalidade -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Modalidade</label>
            <select
              v-model="filters.modality_id"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              @change="applyFilters"
            >
              <option :value="null">Todas</option>
              <option :value="1">Futsal</option>
              <option :value="2">Fut7/Fut5</option>
              <option :value="3">Suíço</option>
              <option :value="4">Campo de 11</option>
            </select>
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
      <div v-else-if="teams.length === 0" class="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        Nenhum time cadastrado.
      </div>

      <!-- Grid de times -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="team in teams"
          :key="team.id"
          class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-500/40 hover:shadow-md dark:border-white/10 dark:bg-gray-800"
        >
          <!-- Banner -->
          <div
            class="relative h-24 bg-cover bg-center"
            :style="{ backgroundImage: `url(${team.banner_url || fallbackImage})` }"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          <!-- Logo overlap -->
          <div class="relative px-4">
            <div class="-mt-8 flex items-end gap-3">
              <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-md dark:border-gray-800">
                <img
                  :src="team.logo_url || fallbackImage"
                  :alt="team.name"
                  class="h-full w-full object-cover"
                  @error="$event.target.src = fallbackImage"
                />
              </div>
              <div class="min-w-0 pb-1">
                <h3 class="truncate text-base font-bold text-gray-900 dark:text-white">
                  {{ team.name }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Infos -->
          <div class="px-4 py-3">
            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="rounded-lg bg-gray-50 px-2 py-2 dark:bg-gray-700/50">
                <p class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Cidade</p>
                <p class="mt-0.5 text-sm font-medium text-gray-900 dark:text-white truncate">{{ team.city_name || '—' }}</p>
              </div>
              <div class="rounded-lg bg-gray-50 px-2 py-2 dark:bg-gray-700/50">
                <p class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Estado</p>
                <p class="mt-0.5 text-sm font-medium text-gray-900 dark:text-white truncate">{{ team.state_name || '—' }}</p>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="px-4 pb-4">
            <div class="flex gap-2">
              <router-link
                :to="{ name: 'team-show', params: { id: team.id } }"
                class="flex-1 inline-flex items-center justify-center rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                Visualizar
              </router-link>
              <router-link
                v-if="team.user_id === user.id"
                :to="{ name: 'team-admin', params: { id: team.id } }"
                class="flex-1 inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Administrar
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <pagination-component :pagination="pagination" @change="getTeamsList"></pagination-component>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import { useAuthStore } from "@/stores/auth.js";
import Swal from "@/services/swal.js";
import StateSelectComponent from "@/components/form/StateSelectComponent.vue";
import CitySelectComponent from "@/components/form/CitySelectComponent.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";

export default {
  name: "TeamList",
  components: {
    systemLayout,
    StateSelectComponent,
    CitySelectComponent,
    PaginationComponent,
  },
  data() {
    return {
      teams: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      loading: false,
      searchTimeout: null,
      filters: {
        name: '',
        state_id: null,
        city_id: null,
        modality_id: null,
      },
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg'
    }
  },
  created() {
    this.auth = useAuthStore()
    this.getTeamsList()
  },
  computed: {
    user() {
      return this.auth.user
    }
  },
  methods: {
    debounceSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 400)
    },

    applyFilters() {
      this.getTeamsList(1)
    },

    onStateChange() {
      this.filters.city_id = null
      this.applyFilters()
    },

    resetFilters() {
      this.filters = {
        name: '',
        state_id: null,
        city_id: null,
        modality_id: null,
      }
      this.getTeamsList(1)
    },

    async getTeamsList(page = 1) {
      this.loading = true
      try {
        const response = await api.get("/team", {
          params: {
            page,
            name: this.filters.name || undefined,
            state_id: this.filters.state_id || undefined,
            city_id: this.filters.city_id || undefined,
            modality_id: this.filters.modality_id || undefined,
          }
        })
        this.teams = response.data.data
        this.pagination = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar times',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    }
  },
}
</script>
