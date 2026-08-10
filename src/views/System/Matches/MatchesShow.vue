<template>
  <system-layout>
    <main>
      <div class="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="text-center py-12">
          <p class="text-sm text-red-600 dark:text-red-400">Erro ao carregar dados da partida.</p>
        </div>

        <!-- Content -->
        <template v-else>
        <!-- SEÇÃO CONFRONTO -->
        <div class="flex items-center justify-center gap-4 sm:gap-8 py-6">
          <!-- Time Mandante -->
          <div class="flex flex-col items-center text-center w-1/3">
            <img :src="homeLogoUrl" @error="$event.target.src = fallbackImage"
                 class="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-gray-200 dark:ring-gray-700 object-cover cursor-pointer hover:scale-105 hover:ring-orange-300 transition-all duration-200"
                 @click="openLightbox(matchInfo.home_team_info?.logo_url)" />
            <p class="mt-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
              {{ homeTeamDisplayName }}
            </p>
          </div>

          <!-- Placar / VS -->
          <div class="flex flex-col items-center">
            <div v-if="hasScore" class="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {{ matchInfo.home_score }} <span class="text-gray-400">x</span> {{ matchInfo.visitor_score }}
            </div>
            <div v-else class="text-xl sm:text-3xl font-bold text-gray-400 dark:text-gray-500">
              vs
            </div>
            <div v-if="showPenalties" class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ({{ matchInfo.home_penalty_score }} x {{ matchInfo.visitor_penalty_score }}) pen.
            </div>
          </div>

          <!-- Time Visitante -->
          <div class="flex flex-col items-center text-center w-1/3">
            <img :src="visitorLogoUrl" @error="$event.target.src = fallbackImage"
                 class="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-gray-200 dark:ring-gray-700 object-cover cursor-pointer hover:scale-105 hover:ring-orange-300 transition-all duration-200"
                 @click="openLightbox(matchInfo.visitor_team_info?.logo_url)" />
            <p class="mt-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
              {{ visitorTeamDisplayName }}
            </p>
          </div>
        </div>

        <!-- SEÇÃO METADADOS -->
        <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Campeonato -->
            <div v-if="matchInfo.championship_name" class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span class="text-lg">🏆</span>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Campeonato</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ matchInfo.championship_name }}</p>
              </div>
            </div>

            <!-- Data/Horário -->
            <div v-if="matchInfo.schedule_br" class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span class="text-lg">📅</span>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Data e Horário</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ matchInfo.schedule_br }}</p>
              </div>
            </div>

            <!-- Cidade/Estado -->
            <div v-if="matchInfo.city_info?.name && matchInfo.city_info?.state_info?.name" class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span class="text-lg">📍</span>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cidade</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ matchInfo.city_info.name }} / {{ matchInfo.city_info.state_info.name }}</p>
              </div>
            </div>

            <!-- Local (HTML) -->
            <div v-if="matchInfo.location" class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 sm:col-span-2">
              <span class="text-lg">🏟️</span>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Local</p>
                <div class="text-sm text-gray-900 dark:text-white prose dark:prose-invert prose-sm max-w-none" v-html="matchInfo.location"></div>
              </div>
            </div>

          </div>
        </div>

        <!-- SEÇÃO VAGAS DISPONÍVEIS -->
        <div v-if="hasPositions" class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
            <span>⚽</span> Vagas Disponíveis
          </h2>

          <!-- Tag info banner -->
          <div v-if="matchTagName" class="mb-4 rounded-lg px-4 py-3 text-sm"
            :class="playerHasRequiredTag
              ? 'border border-green-200 bg-green-50 text-green-800 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300'
              : 'border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300'"
          >
            <span v-if="playerHasRequiredTag">
              ✓ Você possui a tag <strong>{{ matchTagName }}</strong> necessária para esta partida.
            </span>
            <span v-else>
              ⚠️ Esta partida exige a tag <strong>{{ matchTagName }}</strong>. Você não possui essa tag e não pode se inscrever.
            </span>
          </div>

          <!-- Loading -->
          <div v-if="positionsLoading" class="flex items-center justify-center py-8">
            <svg class="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">Carregando posições...</span>
          </div>

          <!-- Error -->
          <div v-else-if="positionsError" class="text-center py-6">
            <p class="text-sm text-red-600 dark:text-red-400">Erro ao carregar posições.</p>
            <button @click="loadPositions" class="mt-3 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition">
              Tentar novamente
            </button>
          </div>

          <!-- Positions grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="position in positionsData"
              :key="position.game_position_id"
              class="rounded-xl border p-4 transition"
              :class="getPositionClasses(position)"
            >
              <!-- Position name + price -->
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ position.game_position_name }}
                </span>
                <span class="text-xs font-semibold text-orange-600 dark:text-orange-400">
                  {{ formatCurrency(position.value) }}
                </span>
              </div>

              <!-- State: Available -->
              <div v-if="getPositionState(position) === 'available'">
                <p class="text-xs text-green-700 dark:text-green-400 font-medium mb-2">Disponível</p>
                <button
                  v-if="!currentAssignment && playerHasRequiredTag"
                  @click="handleChoose(position)"
                  class="w-full rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
                >
                  Escolher
                </button>
                <p v-else-if="!playerHasRequiredTag" class="text-xs text-amber-600 dark:text-amber-400 italic">
                  Tag necessária ausente
                </p>
              </div>

              <!-- State: Mine -->
              <div v-else-if="getPositionState(position) === 'mine'">
                <p class="text-xs text-orange-700 dark:text-orange-300 font-semibold mb-2">✓ Sua posição</p>
                <button
                  @click="handleRelease(position)"
                  class="w-full rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                >
                  Liberar posição
                </button>
              </div>

              <!-- State: Occupied -->
              <div v-else>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ position.player_name }}
                  <span v-if="position.player_nickname" class="text-gray-400">({{ position.player_nickname }})</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- SEÇÃO BOTÕES -->
        <div class="mt-6 flex flex-wrap gap-3 justify-center">
          <router-link v-if="matchInfo.positions && matchInfo.positions.length > 0"
            :to="{ name: 'matches-positions', params: { id: matchId } }"
            class="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2">
            Gerenciar Posições
          </router-link>
        </div>
        </template>
      </div>
    </main>

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="isLightboxOpen"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer"
           @click.self="closeLightbox">
        <img :src="lightboxImageUrl"
             class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg cursor-pointer"
             @click="closeLightbox" />
      </div>
    </Transition>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import Swal from "@/services/swal.js";

export default {
  name: "MatchesShow",
  components: {
    systemLayout,
  },
  data() {
    return {
      matchId: 0,
      matchInfo: {},
      loading: false,
      loadError: false,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      isLightboxOpen: false,
      lightboxImageUrl: null,
      positionsData: [],
      positionsLoading: false,
      positionsError: false,
      currentTeamPlayerId: null,
      currentAssignment: null,
      playerHasRequiredTag: true,
      matchTagName: null,
    }
  },
  computed: {
    homeLogoUrl() {
      return this.matchInfo.home_team_info?.logo_url || this.fallbackImage;
    },
    visitorLogoUrl() {
      return this.matchInfo.visitor_team_info?.logo_url || this.fallbackImage;
    },
    homeTeamDisplayName() {
      return this.matchInfo.home_team_info?.name || this.matchInfo.home_team_name || 'Desconhecido';
    },
    visitorTeamDisplayName() {
      return this.matchInfo.visitor_team_info?.name || this.matchInfo.visitor_team_name || 'Desconhecido';
    },
    hasScore() {
      return this.matchInfo.home_score !== null && this.matchInfo.home_score !== undefined
          && this.matchInfo.visitor_score !== null && this.matchInfo.visitor_score !== undefined;
    },
    showPenalties() {
      return this.matchInfo.has_penalties === true || this.matchInfo.has_penalties === 1;
    },
    hasPositions() {
      return this.matchInfo.positions && this.matchInfo.positions.length > 0;
    },
  },
  created() {
    this.matchId = this.$route.params.id
    this.identifyCurrentPlayer()
    this.getMatchInformation()
  },
  mounted() {
    this._escHandler = (e) => { if (e.key === 'Escape' && this.isLightboxOpen) this.closeLightbox(); };
    document.addEventListener('keydown', this._escHandler);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._escHandler);
  },
  methods: {
    identifyCurrentPlayer() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        this.currentTeamPlayerId = user?.team_player_id || null
      } catch {
        this.currentTeamPlayerId = null
      }
    },

    async checkTagEligibility() {
      // Se a partida não exige tag, qualquer jogador pode participar
      if (!this.matchInfo.tag_id) {
        this.playerHasRequiredTag = true
        this.matchTagName = null
        return
      }

      // Busca nome da tag da partida
      this.matchTagName = this.matchInfo.tag?.name || 'Tag necessária'

      // Verifica se o jogador tem a tag
      if (!this.currentTeamPlayerId) {
        this.playerHasRequiredTag = false
        return
      }

      try {
        // Busca dados do jogador no time (com tags) para verificar elegibilidade
        const teamId = this.matchInfo.created_by_team_id
        if (!teamId) {
          this.playerHasRequiredTag = false
          return
        }

        const response = await api.get(`/team-player/${teamId}/show/${this.currentTeamPlayerId}`)
        const playerTags = response.data?.tags || []
        this.playerHasRequiredTag = playerTags.some(tag => tag.id === this.matchInfo.tag_id)
      } catch {
        // Se não conseguiu verificar, deixa o backend validar
        this.playerHasRequiredTag = true
      }
    },

    findCurrentAssignment() {
      if (!this.currentTeamPlayerId) {
        this.currentAssignment = null
        return
      }
      this.currentAssignment = this.positionsData.find(
        p => p.team_player_id === this.currentTeamPlayerId
      ) || null
    },

    getPositionState(position) {
      if (!position.team_player_id) return 'available'
      if (position.team_player_id === this.currentTeamPlayerId) return 'mine'
      return 'occupied'
    },

    getPositionClasses(position) {
      const state = this.getPositionState(position)
      const classes = {
        available: 'border-green-300 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10',
        mine: 'border-orange-400 bg-orange-50 ring-2 ring-orange-300 dark:border-orange-500/40 dark:bg-orange-500/10 dark:ring-orange-500/30',
        occupied: 'border-gray-300 bg-gray-50 opacity-60 dark:border-gray-600 dark:bg-gray-700/50',
      }
      return classes[state]
    },

    formatCurrency(value) {
      const number = Number(value || 0)
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number)
    },

    async loadPositions() {
      this.positionsLoading = true
      this.positionsError = false
      try {
        const response = await api.get(`/match-positions/${this.matchId}`)
        this.positionsData = response.data
        this.findCurrentAssignment()
      } catch (err) {
        console.error(err)
        this.positionsError = true
      } finally {
        this.positionsLoading = false
      }
    },

    async handleChoose(position) {
      const result = await Swal.fire({
        title: 'Confirmar escolha',
        text: `Deseja se atribuir à posição "${position.game_position_name}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, escolher',
        cancelButtonText: 'Cancelar',
      })

      if (!result.isConfirmed) return

      try {
        await api.post(`/match-positions/${this.matchId}/self-assign`, {
          game_position_id: position.game_position_id,
        })

        // Atualiza estado local
        const user = JSON.parse(localStorage.getItem('user'))
        position.team_player_id = this.currentTeamPlayerId
        position.player_name = user?.name || 'Você'
        position.player_nickname = user?.nickname || null
        this.currentAssignment = position

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Posição escolhida com sucesso!',
          showConfirmButton: false,
          timer: 2500,
        })
      } catch (err) {
        const status = err.response?.status
        const message = err.response?.data?.message || 'Erro ao escolher posição.'

        if (status === 409) {
          await Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Posição já ocupada por outro jogador.', showConfirmButton: false, timer: 3000 })
          this.loadPositions()
        } else if (status === 422) {
          await Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: message, showConfirmButton: false, timer: 3000 })
          this.loadPositions()
        } else if (status === 403) {
          await Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: message, showConfirmButton: false, timer: 3000 })
        } else if (!err.response) {
          await Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Erro de conexão.', showConfirmButton: false, timer: 3000 })
        } else {
          await Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: message, showConfirmButton: false, timer: 3000 })
        }
      }
    },

    async handleRelease(position) {
      const result = await Swal.fire({
        title: 'Liberar posição?',
        text: 'Outro jogador poderá ocupar esta vaga.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, liberar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc2626',
      })

      if (!result.isConfirmed) return

      try {
        await api.delete(`/match-positions/${this.matchId}/self-assign`)

        // Limpa estado local
        position.team_player_id = null
        position.player_name = null
        position.player_nickname = null
        this.currentAssignment = null

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Posição liberada com sucesso!',
          showConfirmButton: false,
          timer: 2500,
        })
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao liberar posição.'
        await Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: message, showConfirmButton: false, timer: 3000 })
      }
    },

    openLightbox(imageUrl) {
      if (!imageUrl || imageUrl === this.fallbackImage) return;
      this.lightboxImageUrl = imageUrl;
      this.isLightboxOpen = true;
      document.body.classList.add('overflow-hidden');
    },
    closeLightbox() {
      this.isLightboxOpen = false;
      this.lightboxImageUrl = null;
      document.body.classList.remove('overflow-hidden');
    },
    async getMatchInformation() {
      if (this.matchId !== 0) {
        this.loading = true;

        try {
          let response = await api.get("/matches/show/" + this.matchId);
          this.matchInfo = response.data

          // Carrega posições detalhadas se a partida tem posições configuradas
          if (this.matchInfo.positions && this.matchInfo.positions.length > 0) {
            this.loadPositions()
            this.checkTagEligibility()
          }

        } catch (err) {
          console.error(err);
          if (err.response?.status === 404) {
            await Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Partida não encontrada',
              showConfirmButton: false,
              timer: 3000,
            });
            this.$router.push('/matches/list');
            return;
          }
          this.loadError = true;
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Erro ao carregar dados da partida',
            showConfirmButton: false,
            timer: 3000,
          });
        } finally {
          this.loading = false;
        }
      }
    }
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
