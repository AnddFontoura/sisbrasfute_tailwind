<template>
  <system-layout>
    <!-- Team Banner -->
    <team-banner :team-info-id="teamId"></team-banner>

    <div class="space-y-6 mt-6">

      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Configurações Financeiras</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie as razões de movimentações financeiras do time.</p>
        </div>
        <router-link
          :to="{ name: 'team-finance-list', params: { teamId: teamId } }"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition dark:border-white/10 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Voltar ao Financeiro
        </router-link>
      </div>

      <!-- Add New Reason -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Adicionar Nova Razão</h2>
        <form @submit.prevent="handleCreateReason" class="flex gap-3">
          <input
            v-model="newReasonName"
            type="text"
            maxlength="100"
            placeholder="Nome da nova razão..."
            class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            :disabled="!newReasonName.trim() || creating"
            class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="creating" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            Adicionar
          </button>
        </form>
      </div>

      <!-- Reasons List -->
      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
        <div class="border-b border-gray-200 dark:border-white/10 px-6 py-4">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Razões Cadastradas</h2>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <!-- Reasons -->
        <ul v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <li v-if="!reasons.length" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Nenhuma razão cadastrada ainda.
          </li>

          <li
            v-for="reason in reasons"
            :key="reason.id"
            class="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
          >
            <!-- Editing mode -->
            <div v-if="editingId === reason.id" class="flex flex-1 items-center gap-3">
              <input
                v-model="editingName"
                type="text"
                maxlength="100"
                class="flex-1 rounded-lg border border-orange-400 px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-orange-500/50 dark:bg-white/5 dark:text-white"
                @keyup.enter="handleUpdateReason(reason)"
                @keyup.escape="cancelEdit"
              />
              <button
                @click="handleUpdateReason(reason)"
                :disabled="!editingName.trim() || updating"
                class="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
              >
                Salvar
              </button>
              <button
                @click="cancelEdit"
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Cancelar
              </button>
            </div>

            <!-- Display mode -->
            <div v-else class="flex flex-1 items-center gap-3">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ reason.name }}</span>
              <span
                v-if="reason.team_id === null"
                class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              >
                Sistema
              </span>
            </div>

            <!-- Actions -->
            <div v-if="editingId !== reason.id" class="flex items-center gap-2">
              <button
                v-if="reason.team_id !== null"
                @click="startEdit(reason)"
                class="rounded-lg p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                title="Editar razão"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button
                v-if="reason.team_id !== null"
                @click="handleDeleteReason(reason)"
                class="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition dark:hover:bg-red-900/20 dark:hover:text-red-400"
                title="Excluir razão"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
              <span
                v-if="reason.team_id === null"
                class="text-xs text-gray-400 dark:text-gray-500 italic"
              >
                (não editável)
              </span>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </system-layout>
</template>

<script>
import SystemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import api from "@/services/api.js";
import Swal from "@/services/swal.js";

export default {
  name: "TeamFinanceSettings",
  components: {
    SystemLayout,
    TeamBanner,
  },

  data() {
    return {
      teamId: null,
      reasons: [],
      loading: false,
      creating: false,
      updating: false,
      newReasonName: '',
      editingId: null,
      editingName: '',
    }
  },

  created() {
    this.teamId = this.$route.params.teamId
    this.loadReasons()
  },

  methods: {
    async loadReasons() {
      this.loading = true
      try {
        const response = await api.get(`/team/${this.teamId}/finance-reasons`)
        this.reasons = response.data || []
      } catch (err) {
        console.error('Erro ao carregar razões:', err)
      } finally {
        this.loading = false
      }
    },

    async handleCreateReason() {
      if (!this.newReasonName.trim()) return

      this.creating = true
      try {
        await api.post(`/team/${this.teamId}/finance-reasons`, {
          name: this.newReasonName.trim(),
        })
        this.newReasonName = ''
        await this.loadReasons()

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Razão adicionada!',
          showConfirmButton: false,
          timer: 2000,
        })
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao criar razão.'
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.creating = false
      }
    },

    startEdit(reason) {
      this.editingId = reason.id
      this.editingName = reason.name
    },

    cancelEdit() {
      this.editingId = null
      this.editingName = ''
    },

    async handleUpdateReason(reason) {
      if (!this.editingName.trim()) return

      this.updating = true
      try {
        await api.put(`/team/${this.teamId}/finance-reasons/${reason.id}`, {
          name: this.editingName.trim(),
        })
        this.cancelEdit()
        await this.loadReasons()

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Razão atualizada!',
          showConfirmButton: false,
          timer: 2000,
        })
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao atualizar razão.'
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.updating = false
      }
    },

    async handleDeleteReason(reason) {
      const result = await Swal.fire({
        title: 'Excluir razão?',
        text: `Deseja remover a razão "${reason.name}"? Esta ação não pode ser desfeita.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
      })

      if (!result.isConfirmed) return

      try {
        await api.delete(`/team/${this.teamId}/finance-reasons/${reason.id}`)
        await this.loadReasons()

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Razão removida!',
          showConfirmButton: false,
          timer: 2000,
        })
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao excluir razão.'
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 3000,
        })
      }
    },
  },
}
</script>
