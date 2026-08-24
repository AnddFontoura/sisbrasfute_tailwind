<template>
  <system-layout>
    <main>
      <div class="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-lg font-bold text-gray-900 dark:text-white">Estatísticas da Partida</h1>
          <router-link
            :to="{ name: 'matches-show', params: { id: matchId } }"
            class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition dark:text-gray-400 dark:hover:text-orange-400"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Voltar
          </router-link>
        </div>

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
          <p class="text-sm text-red-600 dark:text-red-400">Erro ao carregar estatísticas da partida.</p>
          <button
            @click="loadStatistics"
            class="mt-3 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition"
          >
            Tentar novamente
          </button>
        </div>

        <!-- Empty state (no players) -->
        <div
          v-else-if="players.length === 0"
          class="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
        >
          Nenhum jogador escalado nesta partida. É necessário escalar jogadores antes de registrar estatísticas.
        </div>

        <!-- Statistics Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-3 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 whitespace-nowrap">Jogador</th>
                <th class="px-2 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">Gols</th>
                <th class="px-2 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">Gols Sofridos</th>
                <th class="px-2 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">Assist.</th>
                <th class="px-2 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">C. Amarelo</th>
                <th class="px-2 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">C. Vermelho</th>
                <th class="px-2 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">Defesas</th>
                <th class="px-2 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">Faltas Com.</th>
                <th class="px-2 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">Faltas Sof.</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="player in sortedPlayers"
                :key="player.match_has_player_id"
                class="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
              >
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {{ player.player_name }}
                  <span v-if="player.player_nickname" class="text-xs text-gray-400 dark:text-gray-500 ml-1">({{ player.player_nickname }})</span>
                </td>
                <td class="px-2 py-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    v-model.number="player.statistics.goals_scored"
                    :class="isInvalidValue(player.statistics.goals_scored) ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'"
                    class="w-14 rounded-md border px-2 py-1 text-center text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td class="px-2 py-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    v-model.number="player.statistics.goals_conceded"
                    :class="isInvalidValue(player.statistics.goals_conceded) ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'"
                    class="w-14 rounded-md border px-2 py-1 text-center text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td class="px-2 py-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    v-model.number="player.statistics.assists"
                    :class="isInvalidValue(player.statistics.assists) ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'"
                    class="w-14 rounded-md border px-2 py-1 text-center text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td class="px-2 py-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    v-model.number="player.statistics.yellow_cards"
                    :class="isInvalidValue(player.statistics.yellow_cards) ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'"
                    class="w-14 rounded-md border px-2 py-1 text-center text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td class="px-2 py-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    v-model.number="player.statistics.red_cards"
                    :class="isInvalidValue(player.statistics.red_cards) ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'"
                    class="w-14 rounded-md border px-2 py-1 text-center text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td class="px-2 py-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    v-model.number="player.statistics.saves"
                    :class="isInvalidValue(player.statistics.saves) ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'"
                    class="w-14 rounded-md border px-2 py-1 text-center text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td class="px-2 py-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    v-model.number="player.statistics.fouls_committed"
                    :class="isInvalidValue(player.statistics.fouls_committed) ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'"
                    class="w-14 rounded-md border px-2 py-1 text-center text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td class="px-2 py-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    v-model.number="player.statistics.fouls_suffered"
                    :class="isInvalidValue(player.statistics.fouls_suffered) ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'"
                    class="w-14 rounded-md border px-2 py-1 text-center text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                <td class="px-3 py-2 text-gray-900 dark:text-white whitespace-nowrap">Totais</td>
                <td class="px-2 py-2 text-center text-gray-900 dark:text-white">{{ totals.goals_scored }}</td>
                <td class="px-2 py-2 text-center text-gray-900 dark:text-white">{{ totals.goals_conceded }}</td>
                <td class="px-2 py-2 text-center text-gray-900 dark:text-white">{{ totals.assists }}</td>
                <td class="px-2 py-2 text-center text-gray-900 dark:text-white">{{ totals.yellow_cards }}</td>
                <td class="px-2 py-2 text-center text-gray-900 dark:text-white">{{ totals.red_cards }}</td>
                <td class="px-2 py-2 text-center text-gray-900 dark:text-white">{{ totals.saves }}</td>
                <td class="px-2 py-2 text-center text-gray-900 dark:text-white">{{ totals.fouls_committed }}</td>
                <td class="px-2 py-2 text-center text-gray-900 dark:text-white">{{ totals.fouls_suffered }}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Validation error message -->
          <p v-if="hasValidationErrors" class="mt-3 text-sm text-red-600 dark:text-red-400">
            Valor deve ser entre 0 e 99
          </p>

          <!-- Server errors display -->
          <div v-if="Object.keys(serverErrors).length > 0" class="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-500/30 dark:bg-red-500/10">
            <p class="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Erros de validação do servidor:</p>
            <ul class="list-disc list-inside text-sm text-red-700 dark:text-red-400">
              <li v-for="(messages, field) in serverErrors" :key="field">
                <span v-for="(msg, idx) in (Array.isArray(messages) ? messages : [messages])" :key="idx">{{ msg }}</span>
              </li>
            </ul>
          </div>

          <!-- Save button -->
          <div class="mt-4 flex justify-end">
            <button
              @click="saveStatistics"
              :disabled="hasValidationErrors || saving"
              :class="(hasValidationErrors || saving) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'"
              class="rounded-lg bg-orange-500 px-6 py-2 text-sm font-semibold text-white transition inline-flex items-center gap-2"
            >
              <svg v-if="saving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ saving ? 'Salvando...' : 'Salvar Estatísticas' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import { playerStatisticsService } from "@/services/playerStatisticsService.js";
import Swal from "@/services/swal.js";

export default {
  name: "MatchStatistics",
  components: {
    systemLayout,
  },
  data() {
    return {
      matchId: null,
      players: [],
      loading: false,
      loadError: false,
      saving: false,
      serverErrors: {},
    };
  },
  computed: {
    sortedPlayers() {
      return [...this.players].sort((a, b) =>
        a.player_name.localeCompare(b.player_name, "pt-BR")
      );
    },
    totals() {
      const fields = [
        "goals_scored",
        "goals_conceded",
        "assists",
        "yellow_cards",
        "red_cards",
        "saves",
        "fouls_committed",
        "fouls_suffered",
      ];
      const sums = {};
      for (const field of fields) {
        sums[field] = this.players.reduce((sum, player) => {
          const val = player.statistics[field];
          return sum + (Number.isFinite(val) ? val : 0);
        }, 0);
      }
      return sums;
    },
    hasValidationErrors() {
      return this.players.some((player) => {
        const stats = player.statistics;
        return Object.values(stats).some((val) => this.isInvalidValue(val));
      });
    },
  },
  mounted() {
    this.matchId = this.$route.params.id;
    this.loadStatistics();
  },
  methods: {
    isInvalidValue(val) {
      if (val === null || val === undefined || val === "") return true;
      if (!Number.isInteger(val)) return true;
      if (val < 0 || val > 99) return true;
      return false;
    },
    async saveStatistics() {
      if (this.hasValidationErrors || this.saving) return;

      this.saving = true;
      this.serverErrors = {};

      const statistics = this.players.map((player) => ({
        match_has_player_id: player.match_has_player_id,
        ...player.statistics,
      }));

      try {
        await playerStatisticsService.saveMatchStatistics(this.matchId, statistics);

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Sucesso",
          text: "Estatísticas salvas com sucesso.",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        console.error(err);

        if (err.response?.status === 422) {
          this.serverErrors = err.response.data.errors || {};

          const mensagens = Object.values(this.serverErrors).flat().join("<br>");
          await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Erro de validação",
            html: mensagens,
            showConfirmButton: true,
          });
        } else {
          await Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Erro ao salvar estatísticas. Tente novamente.",
            showConfirmButton: true,
            confirmButtonText: "Tentar novamente",
          });
        }
      } finally {
        this.saving = false;
      }
    },
    async loadStatistics() {
      this.loading = true;
      this.loadError = false;

      try {
        const response = await playerStatisticsService.getMatchStatistics(this.matchId);
        const data = response.data;

        this.players = (data.players || []).map((player) => ({
          match_has_player_id: player.match_has_player_id,
          player_name: player.player_name,
          player_nickname: player.player_nickname,
          statistics: {
            goals_scored: player.statistics?.goals_scored ?? 0,
            goals_conceded: player.statistics?.goals_conceded ?? 0,
            assists: player.statistics?.assists ?? 0,
            yellow_cards: player.statistics?.yellow_cards ?? 0,
            red_cards: player.statistics?.red_cards ?? 0,
            saves: player.statistics?.saves ?? 0,
            fouls_committed: player.statistics?.fouls_committed ?? 0,
            fouls_suffered: player.statistics?.fouls_suffered ?? 0,
          },
        }));
      } catch (err) {
        console.error(err);
        this.loadError = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
