<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      />

      <!-- Loading -->
      <div v-if="loading && !showApplicationModal" class="flex items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="players.length === 0 && !loading" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        Nenhum jogador encontrado.
      </div>

      <div v-else class="flex flex-col gap-4 mt-6">
        <div
          v-for="(player, key) in players"
          :key="player.id ?? key"
          class="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="flex items-center gap-4">
            <!-- Foto circular 56x56 -->
            <div class="flex-shrink-0">
              <img
                :src="player?.photo_url || fallbackImage"
                :alt="player.player_info?.name || player.name"
                class="w-14 h-14 rounded-full object-cover bg-gray-100 dark:bg-gray-700"
              >
            </div>

            <!-- Informações do jogador -->
            <div class="flex-1 min-w-0">
              <h2 class="text-base font-bold text-gray-900 truncate dark:text-white">
                {{ player.player_info?.name || player.name }}
                <span v-if="player.nickname || player.player_info?.nickname" class="font-normal text-gray-500 dark:text-gray-400">
                  ({{ player.nickname || player.player_info?.nickname }})
                </span>
              </h2>

              <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
                {{ formatPositions(player) }} • {{ player.age ?? 'N/A' }} anos
              </p>

              <p v-if="player.created_at" class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                Inscrição: {{ formatDate(player.created_at) }}
              </p>
            </div>

            <!-- Botões - visíveis apenas em sm+ -->
            <div class="hidden sm:flex flex-shrink-0 items-center gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                @click="openApplicationModal(player)"
              >
                Avaliar
              </button>
            </div>
          </div>

          <!-- Botões - visíveis apenas em mobile (<640px), full width -->
          <div class="mt-3 flex sm:hidden">
            <button
              type="button"
              class="w-full inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              @click="openApplicationModal(player)"
            >
              Avaliar
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="showApplicationModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Avaliar jogador
              </h2>

              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Deseja aceitar ou rejeitar
                <b>{{ selectedApplication?.player_info?.name ?? 'este jogador' }}</b>
                neste time?
              </p>
            </div>

            <button
              type="button"
              class="rounded-lg px-2 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="closeApplicationModal"
            >
              ×
            </button>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Decisão
            </label>

            <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                class="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-xl
                  border
                  p-4
                  transition
                  hover:border-green-500
                  hover:bg-green-50
                  dark:border-gray-600
                  dark:hover:bg-green-900/20
                "
                :class="applicationDecision === 'accepted' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300'"
              >
                <input
                  v-model="applicationDecision"
                  type="radio"
                  value="accepted"
                  class="h-4 w-4 text-green-600"
                >

                <span class="font-semibold text-gray-800 dark:text-white">
                  Aceitar
                </span>
              </label>

              <label
                class="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-xl
                  border
                  p-4
                  transition
                  hover:border-red-500
                  hover:bg-red-50
                  dark:border-gray-600
                  dark:hover:bg-red-900/20
                "
                :class="applicationDecision === 'rejected' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'"
              >
                <input
                  v-model="applicationDecision"
                  type="radio"
                  value="rejected"
                  class="h-4 w-4 text-red-600"
                >

                <span class="font-semibold text-gray-800 dark:text-white">
                  Rejeitar
                </span>
              </label>
            </div>
          </div>

          <div
            v-if="applicationDecision === 'rejected'"
            class="mt-6"
          >
            <label
              for="applicationRejectionReason"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Justificativa da recusa
            </label>

            <textarea
              id="applicationRejectionReason"
              v-model="applicationRejectionReason"
              rows="4"
              class="
                mt-2
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2
                text-gray-900
                shadow-sm
                focus:border-orange-500
                focus:outline-none
                focus:ring-2
                focus:ring-orange-500/30
                dark:border-gray-600
                dark:bg-gray-700
                dark:text-white
              "
              placeholder="Informe o motivo da recusa..."
            >
            </textarea>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="
                rounded-xl
                border
                border-gray-300
                bg-white
                px-5
                py-2
                font-semibold
                text-gray-700
                shadow-sm
                transition
                hover:bg-gray-50
                dark:border-gray-600
                dark:bg-gray-700
                dark:text-gray-100
                dark:hover:bg-gray-600
              "
              @click="closeApplicationModal"
            >
              Cancelar
            </button>

            <button
              type="button"
              class="
                rounded-xl
                bg-orange-500
                px-5
                py-2
                font-semibold
                text-white
                shadow-md
                transition
                hover:bg-orange-400
                disabled:cursor-not-allowed
                disabled:bg-orange-300
              "
              :disabled="loading || !applicationDecision"
              @click="submitApplicationDecision"
            >
              {{ loading ? 'Salvando...' : 'Salvar decisão' }}
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
import {useAuthStore} from "@/stores/auth.js";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import Swal from "@/services/swal.js";

export default {
  name: "teamList",
  components: {
    systemLayout,
    PaginationComponent,
    TeamBanner
  },
  data() {
    return {
      players: [],
      payload: {},
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1
      },
      teamId: 0,
      showApplicationModal: false,
      selectedApplication: null,
      applicationDecision: "",
      applicationRejectionReason: "",
      loading: false,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg'
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
    formatPositions(player) {
      if (Array.isArray(player.positions) && player.positions.length) {
        return player.positions.map((position) => position.name || position).join(', ')
      }

      return player.position_name || player.position || 'N/A'
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
    openApplicationModal(player) {
      this.selectedApplication = player;
      this.applicationDecision = "";
      this.applicationRejectionReason = "";
      this.showApplicationModal = true;
    },
    closeApplicationModal() {
      this.showApplicationModal = false;
      this.selectedApplication = null;
      this.applicationDecision = "";
      this.applicationRejectionReason = "";
    },
    async submitApplicationDecision() {
      if (!this.applicationDecision) {
        await Swal.fire({
          icon: "warning",
          title: "Atenção!",
          text: "Escolha se deseja aceitar ou rejeitar o jogador.",
        });

        return;
      }

      if (this.applicationDecision === "rejected" && !this.applicationRejectionReason.trim()) {
        await Swal.fire({
          icon: "warning",
          title: "Justificativa obrigatória!",
          text: "Informe uma justificativa para rejeitar o jogador.",
        });

        return;
      }

      this.loading = true;

      try {
        await api.post(`/team-application/${this.teamId}/${this.selectedApplication.id}/answer`, {
          applicationDecision: this.applicationDecision,
          justification: this.applicationDecision === "rejected" ? this.applicationRejectionReason : null,
        });

        const successMessage = this.applicationDecision === "accepted"
          ? "Jogador aceito com sucesso."
          : "Jogador rejeitado com sucesso.";

        this.closeApplicationModal();

        await Swal.fire({
          icon: "success",
          title: "Decisão salva!",
          text: successMessage,
          confirmButtonText: "Ok",
        });

        await this.getTeamPlayerList(this.pagination.current_page);
      } catch (err) {
        let mensagem = "Não foi possível salvar a decisão.";

        if (err.response?.data?.message) {
          mensagem = err.response.data.message;
        }

        if (err.response?.data?.errors) {
          mensagem = Object.values(err.response.data.errors).flat().join("<br><br>");
        }

        await Swal.fire({
          icon: "error",
          title: "Erro",
          html: mensagem,
          confirmButtonText: "Ok",
        });
      } finally {
        this.loading = false;
      }
    },
    async getTeamPlayerList(page = 1) {
      this.loading = true;

      if (this.teamId !== 0) {
        try {
          let response = await api.get("/team-application/" + this.teamId + "/list", {
            ...this.payload,
            page: page,
          });
          this.players = response.data.data
          this.pagination = response.data
        } catch (err) {
          console.error(err);
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Erro ao puxar lista do time',
            showConfirmButton: false,
            timer: 3000,
          })
        } finally {
          this.loading = false;
        }
      }
    }
  },
};
</script>
