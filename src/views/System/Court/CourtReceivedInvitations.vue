<template>
  <system-layout>
    <main>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Convites de Quadra Recebidos
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
        Nenhum convite de quadra recebido.
      </div>

      <!-- Invitations list -->
      <div v-else class="flex flex-col gap-4 mt-6">
        <div
          v-for="invitation in invitations"
          :key="invitation.id"
          class="w-full rounded-xl border border-gray-100 bg-white shadow-sm p-4 flex items-center gap-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <!-- Cover -->
          <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            <img
              :src="coverPhoto(invitation) || fallbackImage"
              @error="$event.target.src = fallbackImage"
              alt=""
              class="h-full w-full object-cover"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-gray-900 truncate dark:text-white">
              {{ invitation.court_info?.name ?? 'Quadra' }}
            </h2>

            <span class="mt-1 inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
              {{ roleLabel(invitation.role) }}
            </span>

            <p class="text-sm text-gray-500 mt-1 dark:text-gray-400">
              Convidado em: {{ formatDate(invitation.created_at) }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              class="inline-flex justify-center rounded-md bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
              @click="acceptInvitation(invitation)"
            >
              Aceitar
            </button>
            <button
              type="button"
              class="inline-flex justify-center rounded-md bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
              @click="rejectInvitation(invitation)"
            >
              Recusar
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
  name: "CourtReceivedInvitations",
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
      fallbackImage:
        "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
    };
  },
  created() {
    this.getReceivedInvitations();
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("pt-BR");
    },
    roleLabel(role) {
      const map = { owner: "Proprietário", manager: "Gerente", employee: "Funcionário" };
      return map[role] ?? role;
    },
    coverPhoto(invitation) {
      const photos = invitation.court_info?.photos ?? [];
      if (photos.length === 0) return null;
      const cover = photos.find((p) => p.position === 0) ?? photos[0];
      return cover?.photo_url ?? null;
    },
    async getReceivedInvitations(page = 1) {
      this.loading = true;

      try {
        const response = await api.get("/court-invitation/received", {
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
    async acceptInvitation(invitation) {
      try {
        await api.post("/court-invitation/accept", { token: invitation.token });

        this.invitations = this.invitations.filter(
          (inv) => inv.id !== invitation.id
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
          err.response?.data?.message || "Não foi possível aceitar o convite.";

        await Swal.fire({
          icon: "error",
          title: "Erro",
          text: message,
          confirmButtonText: "Ok",
        });
      }
    },
    async rejectInvitation(invitation) {
      const result = await Swal.fire({
        title: "Recusar convite?",
        text: `Deseja recusar o convite para administrar ${invitation.court_info?.name ?? "esta quadra"}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, recusar",
        cancelButtonText: "Não",
      });

      if (!result.isConfirmed) return;

      try {
        await api.post("/court-invitation/reject", { token: invitation.token });

        this.invitations = this.invitations.filter(
          (inv) => inv.id !== invitation.id
        );

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Convite recusado",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        const message =
          err.response?.data?.message || "Não foi possível recusar o convite.";

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
