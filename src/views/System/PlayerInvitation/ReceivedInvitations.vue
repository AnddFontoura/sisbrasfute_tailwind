<template>
  <system-layout>
    <main>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Convites Recebidos
      </h1>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="invitations.length === 0 && !loading" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        Nenhum convite recebido.
      </div>

      <!-- Invitations list -->
      <div v-else class="flex flex-col gap-4 mt-6">
        <div
          v-for="invitation in invitations"
          :key="invitation.id"
          class="
            w-full
            rounded-xl
            border
            bg-white
            shadow-sm
            p-4
            flex
            items-center
            gap-4
          "
        >
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-gray-900 truncate">
              {{ invitation.team_info.name }}
            </h2>

            <p class="text-sm text-gray-500 mt-1">
              Convidado em: {{ formatDate(invitation.created_at) }}
            </p>
          </div>

          <!-- Accept button -->
          <div class="flex-shrink-0">
            <button
              type="button"
              class="
                inline-flex
                justify-center
                rounded-md
                bg-green-600
                hover:bg-green-700
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-colors
              "
              @click="acceptInvitation(invitation.id)"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>

      <pagination-component :pagination="pagination" @change="getReceivedInvitations"></pagination-component>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import Swal from "@/services/swal.js";

export default {
  name: "ReceivedInvitations",
  components: {
    systemLayout,
    PaginationComponent,
  },
  data() {
    return {
      invitations: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      loading: false,
    };
  },
  created() {
    this.getReceivedInvitations();
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("pt-BR");
    },
    async getReceivedInvitations(page = 1) {
      this.loading = true;

      try {
        const response = await api.get("/player-invitation/received", {
          params: { page },
        });

        this.invitations = response.data.data;
        this.pagination = response.data;
      } catch (err) {
        console.error(err);
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar convites",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
    async acceptInvitation(invitationId) {
      try {
        await api.post(`/player-invitation/${invitationId}/accept`);

        this.invitations = this.invitations.filter(
          (inv) => inv.id !== invitationId
        );

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Convite aceito com sucesso!",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Não foi possível aceitar o convite.";

        await Swal.fire({
          icon: "error",
          title: "Erro",
          text: message,
          confirmButtonText: "Ok",
        });
      }
    },
  },
};
</script>
