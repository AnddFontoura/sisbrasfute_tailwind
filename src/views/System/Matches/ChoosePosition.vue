<template>
  <system-layout>
    <main>
      <div class="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Escolher Posição na Partida
        </h2>

        <!-- Team logos -->
        <div v-if="matchInfo.my_team_name" class="flex items-center justify-center gap-4 sm:gap-6 py-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col items-center text-center">
            <img :src="homeLogoUrl" @error="$event.target.src = fallbackImage"
                 class="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 object-cover cursor-pointer hover:scale-105 hover:ring-orange-300 transition-all duration-200"
                 @click="openLightbox(matchInfo.my_team_info?.logo_url)" />
            <p class="mt-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[100px]">{{ homeTeamName }}</p>
          </div>
          <span class="text-lg font-bold text-gray-400 dark:text-gray-500">vs</span>
          <div class="flex flex-col items-center text-center">
            <img :src="visitorLogoUrl" @error="$event.target.src = fallbackImage"
                 class="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 object-cover cursor-pointer hover:scale-105 hover:ring-orange-300 transition-all duration-200"
                 @click="openLightbox(matchInfo.enemy_team_info?.logo_url)" />
            <p class="mt-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[100px]">{{ visitorTeamName }}</p>
          </div>
        </div>

        <!-- Tag restriction banner -->
        <div v-if="matchInfo.tag_id" class="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/20">
          <span class="text-amber-600 dark:text-amber-400">⚠️</span>
          <div>
            <p class="text-sm font-medium text-amber-800 dark:text-amber-300">
              Partida restrita
              <span v-if="matchInfo.tag"
                class="inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                :style="{ backgroundColor: matchInfo.tag?.color || '#6b7280' }"
              >
                {{ matchInfo.tag?.name }}
              </span>
            </p>
            <p class="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Apenas jogadores com esta tag podem se inscrever nesta partida.
            </p>
          </div>
        </div>

        <!-- Wallet balance display -->
        <div v-if="walletBalance !== null" class="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
          <span class="text-sm text-gray-600 dark:text-gray-300">Saldo disponível: </span>
          <span class="text-sm font-bold text-orange-600 dark:text-orange-400">{{ formatCurrencyCents(walletBalance) }}</span>
        </div>

        <!-- Loading indicator -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg
            class="animate-spin h-8 w-8 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando posições...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="loadError" class="text-center py-8">
          <p class="text-sm text-red-600 dark:text-red-400 mb-4">
            Erro ao carregar posições da partida.
          </p>
          <button
            type="button"
            @click="loadPositions()"
            class="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600"
          >
            Tentar novamente
          </button>
        </div>

        <!-- Empty positions -->
        <div
          v-else-if="positions.length === 0"
          class="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          Nenhuma posição configurada para esta partida.
        </div>

        <!-- Positions split view: two columns -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Home team column -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 px-1">
              {{ homeTeamName }}
            </h3>
            <div class="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div
                v-for="position in homePositions"
                :key="position.id"
                class="py-3 px-3 flex items-center justify-between gap-4"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-0.5">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {{ position.game_position_name }}
                    </span>
                    <span class="text-xs font-medium text-orange-600 dark:text-orange-400">
                      {{ formatCurrency(position.value) }}
                    </span>
                  </div>
                  <div class="mt-1">
                    <!-- Available position -->
                    <span
                      v-if="getPositionState(position) === 'available'"
                      class="text-sm italic text-green-600 dark:text-green-400"
                    >
                      Disponível
                    </span>

                    <!-- My position -->
                    <span
                      v-else-if="getPositionState(position) === 'mine'"
                      class="text-sm font-semibold text-orange-700 dark:text-orange-300"
                    >
                      {{ position.player_name }}
                      <span v-if="position.player_nickname" class="text-orange-500 dark:text-orange-400">
                        ({{ position.player_nickname }})
                      </span>
                    </span>

                    <!-- Occupied by another player -->
                    <span
                      v-else
                      class="text-sm text-gray-700 dark:text-gray-300"
                    >
                      {{ position.player_name }}
                      <span v-if="position.player_nickname" class="text-gray-500 dark:text-gray-400">
                        ({{ position.player_nickname }})
                      </span>
                    </span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex-shrink-0">
                  <button
                    v-if="getPositionState(position) === 'available'"
                    type="button"
                    @click="handleChoose(position)"
                    class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
                  >
                    Escolher
                  </button>

                  <button
                    v-else-if="getPositionState(position) === 'mine'"
                    type="button"
                    @click="handleRelease(position)"
                    class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
                  >
                    Liberar posição
                  </button>
                </div>
              </div>
              <!-- Empty state for column -->
              <div v-if="homePositions.length === 0" class="py-4 px-3 text-center text-sm text-gray-400 dark:text-gray-500">
                Nenhuma posição disponível
              </div>
            </div>
          </div>

          <!-- Visitor team column -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 px-1">
              {{ visitorTeamName }}
            </h3>
            <div class="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div
                v-for="position in visitorPositions"
                :key="position.id"
                class="py-3 px-3 flex items-center justify-between gap-4"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-0.5">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {{ position.game_position_name }}
                    </span>
                    <span class="text-xs font-medium text-orange-600 dark:text-orange-400">
                      {{ formatCurrency(position.value) }}
                    </span>
                  </div>
                  <div class="mt-1">
                    <!-- Available position -->
                    <span
                      v-if="getPositionState(position) === 'available'"
                      class="text-sm italic text-green-600 dark:text-green-400"
                    >
                      Disponível
                    </span>

                    <!-- My position -->
                    <span
                      v-else-if="getPositionState(position) === 'mine'"
                      class="text-sm font-semibold text-orange-700 dark:text-orange-300"
                    >
                      {{ position.player_name }}
                      <span v-if="position.player_nickname" class="text-orange-500 dark:text-orange-400">
                        ({{ position.player_nickname }})
                      </span>
                    </span>

                    <!-- Occupied by another player -->
                    <span
                      v-else
                      class="text-sm text-gray-700 dark:text-gray-300"
                    >
                      {{ position.player_name }}
                      <span v-if="position.player_nickname" class="text-gray-500 dark:text-gray-400">
                        ({{ position.player_nickname }})
                      </span>
                    </span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex-shrink-0">
                  <button
                    v-if="getPositionState(position) === 'available'"
                    type="button"
                    @click="handleChoose(position)"
                    class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
                  >
                    Escolher
                  </button>

                  <button
                    v-else-if="getPositionState(position) === 'mine'"
                    type="button"
                    @click="handleRelease(position)"
                    class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
                  >
                    Liberar posição
                  </button>
                </div>
              </div>
              <!-- Empty state for column -->
              <div v-if="visitorPositions.length === 0" class="py-4 px-3 text-center text-sm text-gray-400 dark:text-gray-500">
                Nenhuma posição disponível
              </div>
            </div>
          </div>
        </div>
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
  name: "ChoosePosition",
  components: {
    systemLayout,
  },
  data() {
    return {
      matchId: null,
      positions: [],
      loading: true,
      loadError: false,
      currentAssignment: null,
      currentTeamPlayerId: null,
      matchInfo: {},
      isLightboxOpen: false,
      lightboxImageUrl: null,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      walletBalance: null,
      systemFee: 0,
    };
  },
  computed: {
    homeLogoUrl() {
      return this.matchInfo.my_team_info?.logo_url || this.fallbackImage;
    },
    visitorLogoUrl() {
      return this.matchInfo.enemy_team_info?.logo_url || this.fallbackImage;
    },
    homeTeamName() {
      return this.matchInfo.my_team_info?.name || this.matchInfo.my_team_name || 'Time Mandante';
    },
    visitorTeamName() {
      return this.matchInfo.enemy_team_info?.name || this.matchInfo.enemy_team_name || 'Time Visitante';
    },
    homePositions() {
      if (!this.positions || this.positions.length === 0) return [];

      // If positions have team_reference, group by it
      const hasTeamRef = this.positions.some(p => p.team_reference);
      if (hasTeamRef) {
        return this.positions.filter(p => p.team_reference === 'home');
      }

      // Fallback: split evenly — first half = home
      const midpoint = Math.ceil(this.positions.length / 2);
      return this.positions.slice(0, midpoint);
    },
    visitorPositions() {
      if (!this.positions || this.positions.length === 0) return [];

      // If positions have team_reference, group by it
      const hasTeamRef = this.positions.some(p => p.team_reference);
      if (hasTeamRef) {
        return this.positions.filter(p => p.team_reference === 'visitor');
      }

      // Fallback: split evenly — second half = visitor
      const midpoint = Math.ceil(this.positions.length / 2);
      return this.positions.slice(midpoint);
    },
  },
  created() {
    this.matchId = this.$route.params.id;
    this.loadPositions();
    this.loadMatchInfo();
    this.identifyCurrentPlayer();
    this.loadWalletBalance();
  },
  mounted() {
    this._escHandler = (e) => { if (e.key === 'Escape' && this.isLightboxOpen) this.closeLightbox(); };
    document.addEventListener('keydown', this._escHandler);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._escHandler);
  },
  methods: {
    async loadWalletBalance() {
      try {
        const response = await api.get('/wallet/balance');
        this.walletBalance = response.data.balance_cents ?? response.data.balance ?? null;
      } catch (err) {
        console.error('Erro ao carregar saldo da carteira:', err);
        // Silently fail — wallet balance is informational
      }
    },

    formatCurrencyCents(cents) {
      const numericValue = Number(cents) || 0;
      const reais = numericValue / 100;
      return reais.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },

    async loadMatchInfo() {
      try {
        const response = await api.get('/matches/show/' + this.matchId);
        this.matchInfo = response.data;
      } catch (err) {
        console.error(err);
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

    async loadPositions() {
      this.loading = true;
      this.loadError = false;

      try {
        const response = await api.get(`/matches/${this.matchId}/players`);
        this.positions = response.data;
        this.findCurrentAssignment();
      } catch (err) {
        console.error(err);

        if (err.response?.status === 404) {
          await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Partida não encontrada",
            showConfirmButton: false,
            timer: 3000,
          });
          this.$router.push("/matches/list");
          return;
        }

        this.loadError = true;
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar posições da partida",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    identifyCurrentPlayer() {
      const userJson = localStorage.getItem("user");
      if (!userJson) return;

      try {
        const user = JSON.parse(userJson);
        if (user && user.team_player_id) {
          this.currentTeamPlayerId = user.team_player_id;
        }
      } catch (e) {
        console.error("Erro ao identificar jogador atual:", e);
      }
    },

    findCurrentAssignment() {
      if (!this.currentTeamPlayerId) return;

      const myPosition = this.positions.find(
        (p) => p.team_player_id === this.currentTeamPlayerId
      );
      this.currentAssignment = myPosition || null;
    },

    getPositionState(position) {
      if (!position.team_player_id) {
        return 'available';
      }
      if (position.team_player_id === this.currentTeamPlayerId) {
        return 'mine';
      }
      return 'occupied';
    },

    async handleChoose(position) {
      // Check if player already has a position in this match
      if (this.currentAssignment) {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Você já possui uma posição nesta partida. Libere sua posição atual para escolher outra.",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

      const positionValue = Number(position.value || 0);
      const feeCents = this.systemFee || 0;
      const positionValueCents = positionValue * 100;
      const totalCostCents = positionValueCents + feeCents;

      // Check if wallet balance is insufficient
      if (this.walletBalance !== null && this.walletBalance < totalCostCents) {
        const insufficientResult = await Swal.fire({
          title: 'Saldo insuficiente',
          text: `Seu saldo (${this.formatCurrencyCents(this.walletBalance)}) é insuficiente para esta posição. Deposite fundos na sua carteira.`,
          icon: 'warning',
          confirmButtonText: 'Ir para Carteira',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#f97316',
        });
        if (insufficientResult.isConfirmed) {
          this.$router.push('/financeiro');
        }
        return;
      }

      // Show detailed confirmation dialog with cost breakdown
      const result = await Swal.fire({
        title: 'Confirmar escolha',
        html: `
          <div class="text-left text-sm">
            <p><strong>Posição:</strong> ${position.game_position_name}</p>
            <p><strong>Valor:</strong> ${this.formatCurrency(positionValue)}</p>
            ${feeCents > 0 ? `<p><strong>Taxa do sistema:</strong> ${this.formatCurrencyCents(feeCents)}</p>` : ''}
            ${feeCents > 0 ? `<p class="font-bold mt-2"><strong>Total:</strong> ${this.formatCurrencyCents(totalCostCents)}</p>` : ''}
            ${this.walletBalance !== null ? `<p class="mt-2 text-gray-500">Seu saldo: ${this.formatCurrencyCents(this.walletBalance)}</p>` : ''}
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar pagamento',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f97316',
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await api.post(`/matches/${this.matchId}/players/self-assign`, {
          game_position_id: position.game_position_id,
        });

        // Update position locally with current user data
        const userJson = localStorage.getItem("user");
        if (userJson) {
          const user = JSON.parse(userJson);
          position.player_name = user.name;
          position.player_nickname = user.nickname || null;
          position.team_player_id = user.team_player_id;
        }

        this.currentAssignment = position;

        // Reload wallet balance after payment
        this.loadWalletBalance();

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Posição escolhida com sucesso!",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        if (err.response?.status === 409) {
          await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Esta posição já está ocupada",
            showConfirmButton: false,
            timer: 3000,
          });
          await this.loadPositions();
        } else if (err.response?.status === 422) {
          const message = err.response.data?.message || "Erro de validação";
          await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 3000,
          });
        } else if (err.response?.status === 403) {
          const message = err.response.data?.message || "Sem permissão";
          await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 3000,
          });
        } else if (!err.response) {
          await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Erro de conexão",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    },

    async handleRelease(position) {
      const result = await Swal.fire({
        title: 'Liberar posição',
        text: `Deseja liberar sua posição "${position.game_position_name}"? Outro jogador poderá ocupá-la.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, liberar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ef4444',
      });

      if (!result.isConfirmed) return;

      try {
        await api.delete(`/matches/${this.matchId}/players/self-assign`);

        position.player_name = null;
        position.player_nickname = null;
        position.team_player_id = null;
        this.currentAssignment = null;

        // Reload wallet balance after refund
        this.loadWalletBalance();

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Posição liberada com sucesso!',
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao liberar posição';
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },

    formatCurrency(value) {
      const numericValue = Number(value) || 0;
      return numericValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
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
