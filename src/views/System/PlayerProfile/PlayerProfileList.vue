<template>
  <system-layout>
    <main class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="text-2xl font-black text-gray-900 dark:text-white">Jogadores</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Jogadores cadastrados na plataforma.</p>
      </div>

      <!-- Filtros (colapsável) -->
      <div class="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
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
            <div>
              <state-select-component
                v-model="filters.state_id"
                label-name="Estado"
                @update:modelValue="onStateChange"
              />
            </div>
            <div>
              <city-select-component
                v-model="filters.city_id"
                label-name="Cidade"
                :state-id="filters.state_id"
                @update:modelValue="applyFilters"
              />
            </div>
            <div>
              <player-position-select
                v-model="filters.game_position_id"
                @update:modelValue="applyFilters"
              />
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <button @click="resetFilters" class="text-xs font-medium text-gray-500 hover:text-orange-500 transition">Limpar filtros</button>
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
      <div v-else-if="players.length === 0" class="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        Nenhum jogador encontrado.
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="player in players"
          :key="player.id"
          class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-500/40 hover:shadow-md dark:border-white/10 dark:bg-gray-800"
        >
          <!-- Header escuro com nome -->
          <div class="bg-gray-900 px-4 py-3 dark:bg-black">
            <h3 class="text-sm font-bold text-white truncate">{{ player.name }}</h3>
            <p class="text-xs text-zinc-400 truncate">{{ player.nickname || 'Sem apelido' }}</p>
          </div>

          <!-- Foto centralizada -->
          <div class="flex justify-center py-4">
            <div class="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 shadow dark:border-gray-700">
              <img
                :src="player.photo_url || fallbackAvatar"
                :alt="player.name"
                class="h-full w-full object-cover"
                @error="$event.target.src = fallbackAvatar"
              />
            </div>
          </div>

          <!-- Infos -->
          <div class="px-4 pb-2">
            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="rounded-lg bg-gray-50 px-2 py-1.5 dark:bg-gray-700/50">
                <p class="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Cidade</p>
                <p class="mt-0.5 text-xs font-medium text-gray-900 truncate dark:text-white">{{ player.city_info?.name || '—' }}</p>
              </div>
              <div class="rounded-lg bg-gray-50 px-2 py-1.5 dark:bg-gray-700/50">
                <p class="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Estado</p>
                <p class="mt-0.5 text-xs font-medium text-gray-900 truncate dark:text-white">{{ player.city_info?.state_info?.name || '—' }}</p>
              </div>
            </div>
          </div>

          <!-- Ação -->
          <div class="px-4 pb-4 pt-2">
            <router-link
              :to="{ name: 'player-profile-show', params: { id: player.id } }"
              class="w-full inline-flex items-center justify-center rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
            >
              Ver perfil
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <pagination-component :pagination="pagination" @change="getPlayersList"></pagination-component>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import { useAuthStore } from "@/stores/auth.js";
import Swal from "@/services/swal.js";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import StateSelectComponent from "@/components/form/StateSelectComponent.vue";
import CitySelectComponent from "@/components/form/CitySelectComponent.vue";
import PlayerPositionSelect from "@/components/form/GamePositionSelect.vue";

export default {
  name: "PlayerProfileList",
  components: {
    systemLayout,
    PaginationComponent,
    StateSelectComponent,
    CitySelectComponent,
    PlayerPositionSelect,
  },

  data() {
    return {
      players: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      loading: false,
      showFilters: false,
      searchTimeout: null,
      filters: {
        name: '',
        state_id: null,
        city_id: null,
        game_position_id: null,
      },
      fallbackAvatar: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="%239ca3af" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>'),
    }
  },

  created() {
    this.auth = useAuthStore()
    this.getPlayersList()
  },

  computed: {
    user() {
      return this.auth.user
    },
    hasActiveFilters() {
      return !!(this.filters.name || this.filters.state_id || this.filters.city_id || this.filters.game_position_id)
    },
  },

  methods: {
    debounceSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 400)
    },

    applyFilters() {
      this.getPlayersList(1)
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
        game_position_id: null,
      }
      this.getPlayersList(1)
    },

    async getPlayersList(page = 1) {
      this.loading = true
      try {
        const response = await api.get("/player-profile", {
          params: {
            page,
            name: this.filters.name || undefined,
            state_id: this.filters.state_id || undefined,
            city_id: this.filters.city_id || undefined,
            game_position_id: this.filters.game_position_id || undefined,
          }
        })
        this.players = response.data.data
        this.pagination = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar jogadores',
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
