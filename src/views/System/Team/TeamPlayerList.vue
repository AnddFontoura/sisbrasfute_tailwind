<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      />

      <div class="mt-4 flex flex-wrap gap-3">
        <router-link
          :to="{ name: 'team-players-form', params: { teamId: teamId } }"
          class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Recrutamento
        </router-link>

        <router-link
          :to="{ name: 'team-application-list', params: { teamId: teamId } }"
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          Recrutas
        </router-link>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          @click="openInviteModal"
        >
          Convidar Jogador
        </button>

        <router-link
          :to="{ name: 'player-invitation-list', params: { teamId: teamId } }"
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          Convites Enviados
        </router-link>
      </div>

      <!-- Filtros -->
      <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-gray-800 dark:text-white">Filtros</h2>
          <button @click="resetFilters" class="text-xs font-medium text-gray-500 hover:text-orange-500 transition">
            Limpar
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          <!-- Posição -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Posição</label>
            <select
              v-model="filters.game_position_id"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              @change="applyFilters"
            >
              <option :value="null">Todas as posições</option>
              <option v-for="pos in gamePositions" :key="pos.id" :value="pos.id">
                {{ pos.name }}
              </option>
            </select>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tag</label>
            <select
              v-model="filters.tag_id"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              @change="applyFilters"
            >
              <option :value="null">Todas as tags</option>
              <option v-for="tag in availableTags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
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
      <div v-else-if="players.length === 0" class="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        Nenhum jogador encontrado.
      </div>

      <!-- Grid de jogadores -->
      <div v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="player in players"
          :key="player.id"
          class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-500/40 hover:shadow-md dark:border-white/10 dark:bg-gray-800"
        >
          <!-- Header com foto -->
          <div class="relative h-20 bg-gradient-to-br from-gray-900 to-gray-800">
            <div class="absolute -bottom-8 left-4">
              <div class="h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-md dark:border-gray-700">
                <img
                  :src="getPlayerPhoto(player)"
                  :alt="getPlayerName(player)"
                  class="h-full w-full object-cover"
                  @error="$event.target.src = fallbackAvatar"
                />
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="px-4 pb-4 pt-10">
            <h3 class="text-base font-bold text-gray-900 truncate dark:text-white">
              {{ getPlayerName(player) }}
            </h3>
            <p class="text-sm text-gray-500 truncate dark:text-gray-400">
              {{ getPlayerNickname(player) }}
            </p>

            <!-- Posição no time -->
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span
                v-if="getPlayerPosition(player)"
                class="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400"
              >
                {{ getPlayerPosition(player) }}
              </span>
              <span
                v-else
                class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              >
                Sem posição definida
              </span>
            </div>

            <!-- Tags -->
            <div v-if="player.tags && player.tags.length" class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="tag in player.tags"
                :key="tag.id"
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                :style="{ backgroundColor: tag.color || '#6b7280' }"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- Ações -->
            <div class="mt-4 flex gap-2">
              <router-link
                :to="{ name: 'player-profile-show', params: { id: getPlayerId(player) } }"
                class="flex-1 inline-flex items-center justify-center rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                Ver perfil
              </router-link>
              <router-link
                v-if="player.id"
                :to="{ name: 'team-player-edit', params: { teamId: teamId, playerId: player.id } }"
                class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Editar
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal Convidar Jogador -->
      <div
        v-if="showInviteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Convidar Jogador
              </h2>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Digite o email do jogador que deseja convidar para o time.
              </p>
            </div>

            <button
              type="button"
              class="rounded-lg px-2 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="closeInviteModal"
            >
              ×
            </button>
          </div>

          <div class="mt-6">
            <label for="inviteEmailInput" class="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              id="inviteEmailInput"
              v-model="inviteEmail"
              type="email"
              maxlength="254"
              placeholder="jogador@email.com"
              class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              @keyup.enter="submitInvite"
            />
            <p v-if="inviteError" class="mt-2 text-sm text-red-600 dark:text-red-400">
              {{ inviteError }}
            </p>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-xl border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              @click="closeInviteModal"
            >
              Cancelar
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300"
              :disabled="inviteLoading"
              @click="submitInvite"
            >
              <svg
                v-if="inviteLoading"
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviar Convite
            </button>
          </div>
        </div>
      </div>
    </main>

    <pagination-component :pagination="pagination" @change="getTeamPlayerList"></pagination-component>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import { useAuthStore } from "@/stores/auth.js";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import Swal from "@/services/swal.js";

export default {
  name: "TeamPlayerList",
  components: {
    TeamBanner,
    systemLayout,
    PaginationComponent
  },

  data() {
    return {
      players: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1
      },
      filters: {
        name: '',
        game_position_id: null,
        tag_id: null,
      },
      gamePositions: [],
      availableTags: [],
      teamId: null,
      loading: false,
      searchTimeout: null,
      showInviteModal: false,
      inviteEmail: '',
      inviteLoading: false,
      inviteError: '',
      fallbackAvatar: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="%239ca3af" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>'),
    }
  },

  created() {
    this.auth = useAuthStore()
    this.teamId = this.$route.params.teamId ?? null
    this.loadFilterOptions()
    this.getTeamPlayerList()
  },

  computed: {
    user() {
      return this.auth.user
    }
  },

  methods: {
    async loadFilterOptions() {
      if (!this.teamId) return

      try {
        const [positionsRes, tagsRes] = await Promise.all([
          api.get('/game-positions/list'),
          api.get(`/team/${this.teamId}/tags`),
        ])
        this.gamePositions = positionsRes.data?.gamePositions ?? positionsRes.data ?? []
        this.availableTags = tagsRes.data ?? []
      } catch (err) {
        console.error('Erro ao carregar filtros:', err)
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 400)
    },

    applyFilters() {
      this.getTeamPlayerList(1)
    },

    resetFilters() {
      this.filters = { name: '', game_position_id: null, tag_id: null }
      this.getTeamPlayerList(1)
    },

    getPlayerPhoto(player) {
      if (player.photo_url) return player.photo_url
      if (player.player_info?.photo_url) return player.player_info.photo_url
      return this.fallbackAvatar
    },

    getPlayerName(player) {
      return player.player_info?.name || player.name || 'Jogador'
    },

    getPlayerNickname(player) {
      const nick = player.player_info?.nickname || player.nickname
      return nick || 'Sem apelido'
    },

    getPlayerId(player) {
      return player.player_profile_id || player.player_info?.id || player.id
    },

    getPlayerPosition(player) {
      if (player.game_position_info?.name) {
        return player.game_position_info.name
      }
      return null
    },

    async getTeamPlayerList(page = 1) {
      if (!this.teamId) return

      this.loading = true
      try {
        const response = await api.get(`/team-player/${this.teamId}/list`, {
          params: {
            page,
            name: this.filters.name || undefined,
            game_position_id: this.filters.game_position_id || undefined,
            tag_id: this.filters.tag_id || undefined,
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
          title: 'Erro ao carregar jogadores do time',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    openInviteModal() {
      this.inviteEmail = ''
      this.inviteError = ''
      this.inviteLoading = false
      this.showInviteModal = true
    },

    closeInviteModal() {
      this.showInviteModal = false
      this.inviteEmail = ''
      this.inviteError = ''
      this.inviteLoading = false
    },

    async submitInvite() {
      this.inviteError = ''

      if (!this.inviteEmail || !this.inviteEmail.trim()) {
        this.inviteError = 'O campo email é obrigatório.'
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.inviteEmail.trim())) {
        this.inviteError = 'Digite um email válido.'
        return
      }

      this.inviteLoading = true

      try {
        await api.post(`/player-invitation/${this.teamId}/send`, {
          email: this.inviteEmail.trim()
        })

        this.closeInviteModal()

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Convite enviado com sucesso!',
          showConfirmButton: false,
          timer: 3000,
        })
      } catch (err) {
        let mensagem = 'Não foi possível enviar o convite.'

        if (err.response?.data?.message) {
          mensagem = err.response.data.message
        }

        if (err.response?.data?.errors) {
          mensagem = Object.values(err.response.data.errors).flat().join(' ')
        }

        this.inviteError = mensagem
      } finally {
        this.inviteLoading = false
      }
    }
  },
}
</script>
