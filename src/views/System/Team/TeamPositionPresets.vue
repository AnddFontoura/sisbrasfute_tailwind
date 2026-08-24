<template>
  <system-layout>
    <team-banner :team-info-id="teamId"></team-banner>

    <div class="mx-auto max-w-4xl space-y-6 mt-6">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Configurações de Posições</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie presets de escalação para agilizar a criação de partidas.</p>
        </div>
        <router-link
          :to="{ name: 'team-admin', params: { id: teamId } }"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition dark:border-white/10 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Voltar
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>

      <template v-else>
        <!-- Empty -->
        <div v-if="presets.length === 0" class="rounded-xl border border-gray-200 bg-gray-50 px-5 py-8 text-center dark:border-white/10 dark:bg-gray-800">
          <p class="text-sm text-gray-500 dark:text-gray-400">Nenhum preset de posições salvo ainda.</p>
          <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Crie presets ao configurar posições no formulário de partida.</p>
        </div>

        <!-- Presets List -->
        <div v-else class="space-y-4">
          <div
            v-for="preset in presets"
            :key="preset.id"
            class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div v-if="editingId !== preset.id">
                <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ preset.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ preset.positions.length }} posição(ões) · {{ preset.teams_count }} time(s)
                </p>
              </div>
              <div v-else class="flex-1 mr-4">
                <input
                  v-model="editForm.name"
                  type="text"
                  maxlength="100"
                  class="w-full rounded-lg border border-orange-400 px-3 py-1.5 text-sm font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-orange-500/50 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div class="flex items-center gap-2">
                <template v-if="editingId !== preset.id">
                  <button
                    @click="startEdit(preset)"
                    class="rounded-lg p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                    title="Editar"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    @click="handleDelete(preset)"
                    class="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    title="Excluir"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="handleUpdate(preset)"
                    :disabled="saving"
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
                </template>
              </div>
            </div>

            <!-- Positions (editable when editing) -->
            <div class="px-6 py-4">
              <template v-if="editingId === preset.id">
                <!-- Teams count -->
                <div class="mb-4">
                  <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Quantidade de times</label>
                  <input
                    v-model.number="editForm.teams_count"
                    type="number"
                    min="1"
                    class="w-32 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <!-- Editable positions -->
                <div class="space-y-2">
                  <div
                    v-for="(pos, idx) in editForm.positions"
                    :key="idx"
                    class="grid grid-cols-[1fr_120px_auto] gap-3 items-center"
                  >
                    <select
                      v-model="pos.game_position_id"
                      class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option :value="null">Selecione...</option>
                      <option v-for="gp in gamePositions" :key="gp.id" :value="gp.id">{{ gp.name }}</option>
                    </select>
                    <input
                      v-model.number="pos.price"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="R$ 0"
                      class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      @click="editForm.positions.splice(idx, 1)"
                      class="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  @click="editForm.positions.push({ game_position_id: null, price: 0 })"
                  class="mt-3 inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-orange-400 hover:text-orange-600 transition dark:border-gray-600 dark:text-gray-400 dark:hover:border-orange-500 dark:hover:text-orange-400"
                >
                  + Adicionar posição
                </button>
              </template>

              <!-- Read-only view -->
              <template v-else>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(pos, idx) in preset.positions"
                    :key="idx"
                    class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {{ getPositionName(pos.game_position_id) }}
                    <span v-if="pos.price" class="text-orange-600 dark:text-orange-400">R${{ pos.price }}</span>
                  </span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
  </system-layout>
</template>

<script>
import SystemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import api from "@/services/api.js";
import Swal from "@/services/swal.js";
import { fetchGamePositions } from "@/services/gamePositionService.js";

export default {
  name: "TeamPositionPresets",
  components: {
    SystemLayout,
    TeamBanner,
  },

  data() {
    return {
      teamId: null,
      presets: [],
      gamePositions: [],
      loading: false,
      saving: false,
      editingId: null,
      editForm: {
        name: '',
        positions: [],
        teams_count: 1,
      },
    }
  },

  created() {
    this.teamId = this.$route.params.teamId
    this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      try {
        const [presetsRes, positions] = await Promise.all([
          api.get(`/team/${this.teamId}/position-presets`),
          fetchGamePositions(this.teamId),
        ])
        this.presets = presetsRes.data || []
        this.gamePositions = positions || []
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        this.loading = false
      }
    },

    getPositionName(gamePositionId) {
      const pos = this.gamePositions.find(p => p.id === gamePositionId)
      return pos?.name || `#${gamePositionId}`
    },

    startEdit(preset) {
      this.editingId = preset.id
      this.editForm = {
        name: preset.name,
        positions: JSON.parse(JSON.stringify(preset.positions)),
        teams_count: preset.teams_count,
      }
    },

    cancelEdit() {
      this.editingId = null
      this.editForm = { name: '', positions: [], teams_count: 1 }
    },

    async handleUpdate(preset) {
      if (!this.editForm.name.trim() || !this.editForm.positions.length) return

      this.saving = true
      try {
        await api.put(`/team/${this.teamId}/position-presets/${preset.id}`, {
          name: this.editForm.name.trim(),
          positions: this.editForm.positions,
          teams_count: this.editForm.teams_count,
        })

        this.cancelEdit()
        await this.loadData()

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Preset atualizado!',
          showConfirmButton: false,
          timer: 2000,
        })
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao atualizar preset.'
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.saving = false
      }
    },

    async handleDelete(preset) {
      const result = await Swal.fire({
        title: 'Excluir preset?',
        text: `Deseja remover "${preset.name}"? Esta ação não pode ser desfeita.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
      })

      if (!result.isConfirmed) return

      try {
        await api.delete(`/team/${this.teamId}/position-presets/${preset.id}`)
        await this.loadData()

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Preset removido!',
          showConfirmButton: false,
          timer: 2000,
        })
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao excluir preset.'
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
