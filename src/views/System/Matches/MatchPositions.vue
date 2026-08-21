<template>
  <system-layout>
    <main>
      <!-- Team Banner -->
      <team-banner v-if="teamId" :teamInfoId="teamId" />

      <!-- Navigation + Match Info -->
      <div class="mt-4 mb-6">
        <!-- Navigation buttons -->
        <div class="flex flex-wrap gap-3 mb-4">
          <router-link
            v-if="teamId"
            :to="{ name: 'team-matches-list', params: { teamId: teamId } }"
            class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Voltar para Partidas
          </router-link>

          <router-link
            v-if="teamId"
            :to="{ name: 'team-finance-form', params: { teamId: teamId }, query: { matchId: matchId, returnTo: 'match-admin' } }"
            class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Nova Movimentação Financeira
          </router-link>
        </div>

        <!-- Match Info Card -->
        <div v-if="matchInfo" class="rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ matchInfo.home_team_name || 'Mandante' }}
                <span class="mx-2 text-orange-500">vs</span>
                {{ matchInfo.visitor_team_name || 'Visitante' }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                📅 {{ matchInfo.schedule_br || 'Data não definida' }}
                <span v-if="matchInfo.city_info" class="ml-3">📍 {{ matchInfo.city_info.name }}</span>
              </p>
            </div>
            <div v-if="matchInfo.home_score !== null && matchInfo.visitor_score !== null" class="flex items-center gap-2">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ matchInfo.home_score }}</span>
              <span class="text-sm text-gray-400">x</span>
              <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ matchInfo.visitor_score }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">

        <!-- Layout: Posições + Financeiro lado a lado -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Coluna principal: Posições -->
          <div class="lg:col-span-2">
            <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Posições da Partida</h3>

              <!-- Loading indicator -->
              <div v-if="loading" class="flex items-center justify-center py-12">
                <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando posições...</span>
              </div>

              <!-- Positions list -->
              <div v-if="!loading" class="space-y-3">
                <div v-if="positions.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
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
                      <!-- Editing mode -->
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

                      <!-- Display mode: no player assigned -->
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
                        <span v-else class="text-sm italic text-gray-400 dark:text-gray-500">
                          Vaga Disponível
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Coluna lateral: Resumo Financeiro da Partida -->
          <div class="lg:col-span-1">
            <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-20">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Financeiro da Partida</h3>

              <!-- Loading -->
              <div v-if="financeLoading" class="flex items-center justify-center py-8">
                <svg class="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>

              <div v-else>
                <!-- Summary cards -->
                <div class="space-y-3 mb-4">
                  <div class="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                    <span class="text-xs font-medium text-green-700 dark:text-green-400">Receitas</span>
                    <span class="text-sm font-bold text-green-700 dark:text-green-400">{{ formatCurrency(financeCredits) }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                    <span class="text-xs font-medium text-red-700 dark:text-red-400">Despesas</span>
                    <span class="text-sm font-bold text-red-700 dark:text-red-400">{{ formatCurrency(financeDebits) }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                       :class="financeBalance >= 0 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-amber-50 dark:bg-amber-900/20'">
                    <span class="text-xs font-bold text-gray-700 dark:text-gray-300">Saldo</span>
                    <span class="text-sm font-bold" :class="financeBalance >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
                      {{ formatCurrency(financeBalance) }}
                    </span>
                  </div>
                </div>

                <!-- Finance entries list -->
                <div v-if="financeEntries.length > 0" class="space-y-2 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Movimentações</p>
                  <div
                    v-for="entry in financeEntries"
                    :key="entry.id"
                    class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-medium text-gray-900 dark:text-white truncate">{{ entry.description || 'Sem descrição' }}</p>
                      <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ entry.player_name || '—' }}</p>
                    </div>
                    <span
                      class="text-xs font-bold shrink-0 ml-2"
                      :class="Number(entry.type) === 1 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                    >
                      {{ Number(entry.type) === 1 ? '+' : '-' }}{{ formatCurrency(entry.value) }}
                    </span>
                  </div>
                </div>

                <div v-else class="text-center py-4">
                  <p class="text-xs text-gray-400 dark:text-gray-500">Nenhuma movimentação registrada para esta partida.</p>
                </div>

                <!-- Link to full finance list -->
                <router-link
                  v-if="teamId"
                  :to="{ name: 'team-finance-list', params: { teamId: teamId } }"
                  class="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Ver todas as movimentações do time
                </router-link>
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
import TeamBanner from "@/components/team/teamBanner.vue";
import Multiselect from "@vueform/multiselect";
import Swal from "@/services/swal.js";

export default {
  name: "MatchPositions",
  components: {
    systemLayout,
    TeamBanner,
    Multiselect,
  },
  data() {
    return {
      matchId: null,
      teamId: null,
      matchInfo: null,
      positions: [],
      teamPlayers: [],
      loading: true,
      playersLoaded: false,
      editingPosition: null,
      selectedPlayerId: null,
      editingPayment: null,
      editedPaymentValue: null,
      paymentValidationMessage: "",
      financeLoading: true,
      financeEntries: [],
      financeCredits: 0,
      financeDebits: 0,
      financeBalance: 0,
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
        this.matchInfo = response.data;
        this.teamId = response.data.created_by_team_id;
        await Promise.all([
          this.loadTeamPlayers(),
          this.loadFinanceSummary(),
        ]);
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
        this.teamPlayers = response.data?.data || response.data || [];
        this.playersLoaded = true;
      } catch (err) {
        console.error(err);
        this.playersLoaded = false;
      }
    },

    async loadFinanceSummary() {
      this.financeLoading = true;
      try {
        const response = await api.get(`/team-finance/${this.teamId}`);
        const allFinances = response.data || [];

        // Filter finances related to this match
        this.financeEntries = allFinances.filter(
          (f) => f.match_id && Number(f.match_id) === Number(this.matchId)
        );

        this.financeCredits = this.financeEntries
          .filter((f) => Number(f.type) === 1)
          .reduce((sum, f) => sum + Number(f.value || 0), 0);

        this.financeDebits = this.financeEntries
          .filter((f) => Number(f.type) === 0)
          .reduce((sum, f) => sum + Number(f.value || 0), 0);

        this.financeBalance = this.financeCredits - this.financeDebits;
      } catch (err) {
        console.error("Erro ao carregar financeiro:", err);
        this.financeEntries = [];
        this.financeCredits = 0;
        this.financeDebits = 0;
        this.financeBalance = 0;
      } finally {
        this.financeLoading = false;
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

        const selectedPlayer = this.teamPlayers.find(
          (p) => p.id === this.selectedPlayerId
        );
        if (selectedPlayer) {
          position.player_name = selectedPlayer.name;
          position.player_nickname = selectedPlayer.nickname || null;
          position.team_player_id = selectedPlayer.id;
        }

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
