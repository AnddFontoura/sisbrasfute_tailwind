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

        <!-- Not a member banner -->
        <div v-if="!isMember" class="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-700 dark:bg-red-900/20">
          <span class="text-red-600 dark:text-red-400">🔒</span>
          <div>
            <p class="text-sm font-medium text-red-800 dark:text-red-300">
              Você não faz parte deste time
            </p>
            <p class="text-xs text-red-600 dark:text-red-400 mt-0.5">
              Apenas jogadores do time que criou a partida podem escolher uma posição.
            </p>
          </div>
        </div>

        <!-- Wallet balance display -->
        <div v-if="isMember && walletBalance !== null" class="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
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
                      <span
                        v-if="position.payment_status === 'pending'"
                        class="ml-1 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                      >
                        Aguardando pagamento
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
                    v-if="getPositionState(position) === 'available' && isMember"
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
                    {{ position.payment_status === 'pending' ? 'Cancelar' : 'Liberar posição' }}
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
                      <span
                        v-if="position.payment_status === 'pending'"
                        class="ml-1 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                      >
                        Aguardando pagamento
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
                    v-if="getPositionState(position) === 'available' && isMember"
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
                    {{ position.payment_status === 'pending' ? 'Cancelar' : 'Liberar posição' }}
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

    <!-- Payment charge modal (Pix / Boleto) -->
    <div
      v-if="paymentModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closePaymentModal"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ paymentModal.method === 'boleto' ? 'Pague com Boleto' : 'Pague com Pix' }}
          </h3>
          <button
            @click="closePaymentModal"
            class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Sua posição está reservada como <strong>aguardando pagamento</strong> e será confirmada
          automaticamente após a compensação.
        </p>

        <!-- Pix -->
        <template v-if="paymentModal.method !== 'boleto'">
          <div v-if="paymentModal.qrCodeBase64" class="mb-4 flex justify-center">
            <img
              :src="paymentQrCodeSrc"
              alt="QR Code Pix"
              class="h-52 w-52 rounded-lg border border-gray-200 dark:border-white/10"
            />
          </div>
          <div v-if="paymentModal.copiaECola" class="space-y-2">
            <label class="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Pix copia e cola</label>
            <textarea
              readonly
              :value="paymentModal.copiaECola"
              rows="3"
              class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            ></textarea>
            <button
              @click="copyPaymentCode(paymentModal.copiaECola)"
              class="w-full rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {{ paymentModal.copied ? 'Copiado!' : 'Copiar código Pix' }}
            </button>
          </div>
        </template>

        <!-- Boleto -->
        <template v-else>
          <p v-if="paymentModal.boletoDueDate" class="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Vencimento: {{ paymentModal.boletoDueDate }}
          </p>
          <div v-if="paymentModal.boletoLinhaDigitavel" class="space-y-2">
            <label class="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Linha digitável</label>
            <textarea
              readonly
              :value="paymentModal.boletoLinhaDigitavel"
              rows="2"
              class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            ></textarea>
            <button
              @click="copyPaymentCode(paymentModal.boletoLinhaDigitavel)"
              class="w-full rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {{ paymentModal.copied ? 'Copiado!' : 'Copiar linha digitável' }}
            </button>
          </div>
        </template>
      </div>
    </div>

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
      isMember: true,
      paymentModal: {
        open: false,
        method: 'pix',
        copiaECola: '',
        qrCodeBase64: '',
        boletoLinhaDigitavel: '',
        boletoDueDate: '',
        copied: false,
      },
    };
  },
  computed: {
    paymentQrCodeSrc() {
      if (!this.paymentModal.qrCodeBase64) return '';
      return this.paymentModal.qrCodeBase64.startsWith('data:')
        ? this.paymentModal.qrCodeBase64
        : `data:image/png;base64,${this.paymentModal.qrCodeBase64}`;
    },
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
        this.isMember = response.data.is_member ?? false;

        // Backend is the reliable source for the current team_player_id.
        if (response.data.current_team_player_id) {
          this.currentTeamPlayerId = response.data.current_team_player_id;
          this.findCurrentAssignment();
        }
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
      // Guard: only team members can choose a position.
      if (!this.isMember) {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Você não faz parte deste time",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

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

      // Free position: assign directly without choosing a method.
      let method = 'wallet';
      if (totalCostCents > 0) {
        method = await this.choosePaymentMethod(position, positionValue, feeCents, totalCostCents);
        if (!method) return;
      }

      // Wallet: verify balance before proceeding.
      if (method === 'wallet' && this.walletBalance !== null && this.walletBalance < totalCostCents) {
        const insufficientResult = await Swal.fire({
          title: 'Saldo insuficiente',
          text: `Seu saldo (${this.formatCurrencyCents(this.walletBalance)}) é insuficiente. Escolha Pix/Boleto ou deposite fundos.`,
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

      const payload = {
        game_position_id: position.game_position_id,
        payment_method: method,
      };

      // Boleto requires payer identification.
      if (method === 'boleto') {
        const payer = await this.promptPayerData();
        if (!payer) return;
        Object.assign(payload, payer);
      }

      try {
        const { data } = await api.post(`/matches/${this.matchId}/players/self-assign`, payload);

        // Update position locally with current user data
        const userJson = localStorage.getItem("user");
        if (userJson) {
          const user = JSON.parse(userJson);
          position.player_name = user.name;
          position.player_nickname = user.nickname || null;
          position.team_player_id = user.team_player_id;
        }
        position.payment_status = data.payment_status || 'paid';
        position.payment_method = method;

        this.currentAssignment = position;
        this.loadWalletBalance();

        // Gateway charge (Pix/boleto): show payment instructions.
        const charge = data.charge;
        if (charge && (charge.pix_copia_e_cola || charge.pix_qrcode_base64 || charge.boleto_linha_digitavel)) {
          this.paymentModal = {
            open: true,
            method: charge.method || method,
            copiaECola: charge.pix_copia_e_cola || '',
            qrCodeBase64: charge.pix_qrcode_base64 || '',
            boletoLinhaDigitavel: charge.boleto_linha_digitavel || '',
            boletoDueDate: charge.boleto_due_date || '',
            copied: false,
          };
        } else {
          await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Posição escolhida com sucesso!",
            showConfirmButton: false,
            timer: 2000,
          });
        }
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

    async choosePaymentMethod(position, positionValue, feeCents, totalCostCents) {
      const balanceLine = this.walletBalance !== null
        ? `<p class="mt-2 text-gray-500 text-sm">Seu saldo: ${this.formatCurrencyCents(this.walletBalance)}</p>`
        : '';

      const result = await Swal.fire({
        title: 'Forma de pagamento',
        html: `
          <div class="text-left text-sm mb-3">
            <p><strong>Posição:</strong> ${position.game_position_name}</p>
            <p><strong>Valor:</strong> ${this.formatCurrency(positionValue)}</p>
            ${feeCents > 0 ? `<p><strong>Taxa do sistema:</strong> ${this.formatCurrencyCents(feeCents)}</p>` : ''}
            ${feeCents > 0 ? `<p class="font-bold mt-1"><strong>Total:</strong> ${this.formatCurrencyCents(totalCostCents)}</p>` : ''}
            ${balanceLine}
          </div>
        `,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Carteira',
        denyButtonText: 'Pix',
        cancelButtonText: 'Boleto',
        confirmButtonColor: '#f97316',
        denyButtonColor: '#16a34a',
        cancelButtonColor: '#3b82f6',
      });

      if (result.isConfirmed) return 'wallet';
      if (result.isDenied) return 'pix';
      if (result.dismiss === Swal.DismissReason.cancel) return 'boleto';
      return null;
    },

    async promptPayerData() {
      const { value: formValues } = await Swal.fire({
        title: 'Dados para o boleto',
        html: `
          <input id="swal-payer-name" class="swal2-input" placeholder="Nome completo">
          <input id="swal-payer-document" class="swal2-input" placeholder="CPF ou CNPJ">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Gerar boleto',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f97316',
        preConfirm: () => {
          const name = document.getElementById('swal-payer-name').value.trim();
          const doc = document.getElementById('swal-payer-document').value.replace(/\D/g, '');
          if (!name || !doc) {
            Swal.showValidationMessage('Informe nome e CPF/CNPJ');
            return false;
          }
          return { payer_name: name, payer_document: doc };
        },
      });

      return formValues || null;
    },

    async copyPaymentCode(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.paymentModal.copied = true;
        setTimeout(() => { this.paymentModal.copied = false; }, 2000);
      } catch {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Não foi possível copiar',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },

    closePaymentModal() {
      this.paymentModal.open = false;
      this.loadPositions();
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
