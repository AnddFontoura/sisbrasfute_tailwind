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
      </div>

      <!-- Lista de jogadores -->
      <div v-if="players.length === 0 && !loading" class="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        Nenhum jogador cadastrado neste time.
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="player in players"
          :key="player.id"
          class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-500/40 hover:shadow-md dark:border-white/10 dark:bg-gray-800"
        >
          <!-- Header com foto -->
          <div class="relative h-20 bg-gradient-to-br from-gray-900 to-gray-800">
            <div class="absolute -bottom-8 left-4">
              <div class="h-16 w-16 overflow-hidden rounded-xl border-2 border-white bg-gray-100 shadow-md dark:border-gray-700">
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
      teamId: null,
      loading: false,
      fallbackAvatar: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="%239ca3af" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>'),
    }
  },

  created() {
    this.auth = useAuthStore()
    this.teamId = this.$route.params.teamId ?? null
    this.getTeamPlayerList()
  },

  computed: {
    user() {
      return this.auth.user
    }
  },

  methods: {
    getPlayerPhoto(player) {
      // Tenta várias possibilidades de onde a foto pode vir
      return player.player_info?.photo_url
        || player.photo_url
        || player.player_info?.photo
        || player.photo
        || this.fallbackAvatar
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
      // Posição atribuída no time (game_position_info)
      if (player.game_position_info?.name) {
        return player.game_position_info.name
      }

      // Posição vinda de game_position
      if (player.game_position?.name) {
        return player.game_position.name
      }

      // Array de posições do perfil do jogador
      if (player.player_info?.positions && player.player_info.positions.length) {
        return player.player_info.positions.map(p => p.name || p).join(', ')
      }

      if (Array.isArray(player.positions) && player.positions.length) {
        return player.positions.map(p => p.name || p).join(', ')
      }

      return player.position_name || player.position || null
    },

    async getTeamPlayerList(page = 1) {
      if (!this.teamId) return

      this.loading = true
      try {
        const response = await api.get(`/team-player/${this.teamId}/list`, {
          params: { page }
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
    }
  },
}
</script>
