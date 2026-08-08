<template>
  <system-layout>
    <main>
      <div class="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Gerenciar Posições da Partida
        </h2>

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

        <!-- Positions list -->
        <div v-if="!loading" class="space-y-3">
          <div
            v-if="positions.length === 0"
            class="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            Nenhuma posição configurada para esta partida.
          </div>

          <div
            v-for="position in positions"
            :key="position.id"
            class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-4"
          >
            <!-- Position info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ position.game_position_name }}
                </span>
                <span class="text-xs font-medium text-orange-600 dark:text-orange-400">
                  {{ formatCurrency(position.value) }}
                </span>
              </div>

              <!-- Player assignment area -->
              <div class="mt-2">
                <!-- Editing mode: show Multiselect -->
                <div v-if="editingPosition === position.id">
                  <Multiselect
                    v-model="selectedPlayerId"
                    :options="playerOptions"
                    :searchable="true"
                    :close-on-select="true"
                    :clear-on-select="false"
                    placeholder="Selecione um jogador"
                    track-by="label"
                    label="label"
                    value-prop="value"
                    mode="single"
                    :disabled="!playersLoaded"
                    class="mt-1"
                  />
                  <div class="mt-2 flex gap-2">
                    <button
                      type="button"
                      @click="saveAssignment(position)"
                      :disabled="!selectedPlayerId"
                      class="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      @click="cancelEditing()"
                      class="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                <!-- Display mode: player assigned -->
                <div v-else-if="position.player_name" class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">
                      {{ position.player_name }}
                      <span v-if="position.player_nickname" class="text-gray-500 dark:text-gray-400">
                        ({{ position.player_nickname }})
                      </span>
                    </span>
                    <button
                      type="button"
                      @click="startEditing(position)"
                      :disabled="!playersLoaded"
                      class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Editar
                    </button>
                  </div>

                  <!-- Payment info -->
                  <div class="flex items-center gap-3 mt-1">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      Pago: {{ formatCurrency(position.price_payed) }}
                    </span>
                    <span
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                      :class="getPaymentStatusClasses(position)"
                    >
                      {{ getPaymentStatusLabel(position) }}
                    </span>
                  </div>

                  <!-- Payment editing -->
                  <div v-if="editingPayment === position.id" class="mt-2">
                    <div class="flex items-center gap-2">
                      <input
                        v-model="editedPaymentValue"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-32 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        @click="updatePayment(position)"
                        :disabled="!isPaymentValueValid"
                        class="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        @click="cancelPaymentEditing()"
                        class="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                    <p v-if="paymentValidationMessage" class="mt-1 text-xs text-red-600 dark:text-red-400">
                      {{ paymentValidationMessage }}
                    </p>
                  </div>
                  <div v-else class="mt-1">
                    <button
                      type="button"
                      @click="startPaymentEditing(position)"
                      class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Editar Pagamento
                    </button>
                  </div>
                </div>

                <!-- Display mode: no player assigned, show Multiselect directly -->
                <div v-else>
                  <div v-if="playersLoaded">
                    <Multiselect
                      v-model="selectedPlayerId"
                      :options="playerOptions"
                      :searchable="true"
                      :close-on-select="true"
                      :clear-on-select="false"
                      placeholder="Selecione um jogador"
                      track-by="label"
                      label="label"
                      value-prop="value"
                      mode="single"
                      :disabled="!playersLoaded"
                      class="mt-1"
                      @select="onDirectSelect(position)"
                    />
                  </div>
                  <span
                    v-else
                    class="text-sm italic text-gray-400 dark:text-gray-500"
                  >
                    Vaga Disponível
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import Multiselect from "@vueform/multiselect";
import Swal from "@/services/swal.js";

export default {
  name: "MatchPositions",
  components: {
    systemLayout,
    Multiselect,
  },
  data() {
    return {
      matchId: null,
      teamId: null,
      positions: [],
      teamPlayers: [],
      loading: true,
      playersLoaded: false,
      editingPosition: null,
      selectedPlayerId: null,
      editingPayment: null,
      editedPaymentValue: null,
      paymentValidationMessage: "",
    };
  },
  computed: {
    playerOptions() {
      return this.teamPlayers.map((player) => ({
        value: player.id,
        label: player.nickname
          ? `${player.name} (${player.nickname})`
          : player.name,
      }));
    },
    isPaymentValueValid() {
      const value = parseFloat(this.editedPaymentValue);
      return !isNaN(value) && value >= 0;
    },
  },
  created() {
    this.matchId = this.$route.params.id || this.$route.params.matchId;
    this.loadPositions();
  },
  methods: {
    async loadPositions() {
      this.loading = true;

      try {
        const response = await api.get(`/matches/${this.matchId}/players`);
        this.positions = response.data;
        await this.loadMatchInfo();
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

    async loadMatchInfo() {
      try {
        const response = await api.get(`/matches/show/${this.matchId}`);
        this.teamId = response.data.created_by_team_id;
        await this.loadTeamPlayers();
      } catch (err) {
        console.error(err);
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar informações da partida",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },

    async loadTeamPlayers() {
      try {
        const response = await api.get(`/team-player/${this.teamId}/list`);
        this.teamPlayers = response.data;
        this.playersLoaded = true;
      } catch (err) {
        console.error(err);
        this.playersLoaded = false;
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar jogadores do time",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },

    startEditing(position) {
      this.editingPosition = position.id;
      this.selectedPlayerId = position.team_player_id || null;
    },

    cancelEditing() {
      this.editingPosition = null;
      this.selectedPlayerId = null;
    },

    onDirectSelect(position) {
      if (this.selectedPlayerId) {
        this.saveAssignment(position);
      }
    },

    async saveAssignment(position) {
      if (!this.selectedPlayerId) return;

      const previousPlayerId = position.team_player_id;

      try {
        await api.post(`/matches/${this.matchId}/players/save`, {
          game_position_id: position.game_position_id,
          team_player_id: this.selectedPlayerId,
        });

        // Update position locally
        const selectedPlayer = this.teamPlayers.find(
          (p) => p.id === this.selectedPlayerId
        );
        if (selectedPlayer) {
          position.player_name = selectedPlayer.name;
          position.player_nickname = selectedPlayer.nickname || null;
          position.team_player_id = selectedPlayer.id;
        }

        // Close editing mode
        this.editingPosition = null;
        this.selectedPlayerId = null;

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Jogador atribuído com sucesso",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        console.error(err);

        // Revert selection on failure
        this.selectedPlayerId = previousPlayerId;

        const message =
          err.response?.data?.message || "Erro ao atribuir jogador à posição";

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
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

    getPaymentStatus(position) {
      const payed = Number(position.price_payed) || 0;
      const expected = Number(position.value) || 0;

      if (payed === expected) return "complete";
      if (payed > expected) return "excess";
      if (payed > 0 && payed < expected) return "partial";
      return "pending";
    },

    getPaymentStatusLabel(position) {
      const status = this.getPaymentStatus(position);
      const labels = {
        complete: "Pago ✓",
        partial: "Parcial",
        pending: "Pendente",
        excess: "Excedente",
      };
      return labels[status];
    },

    getPaymentStatusClasses(position) {
      const status = this.getPaymentStatus(position);
      const classes = {
        complete: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
        partial: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
        pending: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        excess: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      };
      return classes[status];
    },

    startPaymentEditing(position) {
      this.editingPayment = position.id;
      this.editedPaymentValue = Number(position.price_payed) || 0;
      this.paymentValidationMessage = "";
    },

    cancelPaymentEditing() {
      this.editingPayment = null;
      this.editedPaymentValue = null;
      this.paymentValidationMessage = "";
    },

    async updatePayment(position) {
      const value = parseFloat(this.editedPaymentValue);

      if (isNaN(value) || value < 0) {
        this.paymentValidationMessage = "O valor deve ser numérico e igual ou superior a zero.";
        return;
      }

      this.paymentValidationMessage = "";

      try {
        await api.post(
          `/matches/${this.matchId}/players/${position.match_has_player_id}/payment`,
          { price_payed: value }
        );

        // Update locally without page reload
        position.price_payed = value;
        this.editingPayment = null;
        this.editedPaymentValue = null;
      } catch (err) {
        console.error(err);

        const message =
          err.response?.data?.message || "Erro ao atualizar pagamento";

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
  },
};
</script>
