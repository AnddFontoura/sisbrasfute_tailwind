<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      />

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
        Nenhum convite enviado para este time.
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
          <!-- Invitation info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <h2 class="text-lg font-bold text-gray-900 truncate">
                  {{ invitation.email }}
                </h2>

                <p class="text-sm text-gray-500 mt-1">
                  Enviado em: {{ formatDate(invitation.created_at) }}
                </p>
              </div>

              <div class="flex-shrink-0">
                <button
                  type="button"
                  class="
                    inline-flex
                    justify-center
                    rounded-md
                    bg-red-600
                    hover:bg-red-700
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-colors
                  "
                  @click="cancelInvitation(invitation)"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <pagination-component :pagination="pagination" @change="getInvitations"></pagination-component>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import Swal from "@/services/swal.js";

export default {
  name: "PlayerInvitationList",
  components: {
    systemLayout,
    PaginationComponent,
    TeamBanner
  },
  data() {
    return {
      invitations: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1
      },
      teamId: 0,
      loading: false
    }
  },
  created() {
    this.teamId = this.$route.params.teamId ?? null
    this.getInvitations()
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pt-BR')
    },
    async getInvitations(page = 1) {
      this.loading = true

      try {
        const response = await api.get(`/player-invitation/${this.teamId}/list`, {
          params: { page }
        })
        this.invitations = response.data.data
        this.pagination = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar convites',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },
    async cancelInvitation(invitation) {
      const result = await Swal.fire({
        title: 'Cancelar convite?',
        text: `Deseja cancelar o convite enviado para ${invitation.email}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, cancelar',
        cancelButtonText: 'Não',
      })

      if (!result.isConfirmed) return

      try {
        await api.delete(`/player-invitation/${this.teamId}/cancel/${invitation.id}`)

        this.invitations = this.invitations.filter(inv => inv.id !== invitation.id)

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Convite cancelado com sucesso',
          showConfirmButton: false,
          timer: 3000,
        })
      } catch (err) {
        let mensagem = "Não foi possível cancelar o convite."

        if (err.response?.data?.message) {
          mensagem = err.response.data.message
        }

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: mensagem,
          showConfirmButton: false,
          timer: 3000,
        })
      }
    }
  }
}
</script>
