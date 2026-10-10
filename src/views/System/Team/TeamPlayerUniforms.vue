<template>
  <system-layout>
    <main>
      <team-banner v-if="teamId" :teamInfoId="teamId"></team-banner>

      <div class="mt-6 flex flex-col gap-1">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Uniformes dos Jogadores</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Números que cada jogador informou possuir para cada modelo de camisa do time.
        </p>
      </div>

      <!-- Filters -->
      <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-gray-800 dark:text-white">Filtros</h3>
          <button @click="resetFilters" class="text-xs font-medium text-gray-500 hover:text-orange-500 transition">
            Limpar
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Jogador</label>
            <input
              v-model="filters.name"
              type="text"
              placeholder="Buscar por nome..."
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Modelo da camisa</label>
            <select
              v-model="filters.uniformId"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option :value="null">Todos os modelos</option>
              <option v-for="uniform in uniforms" :key="uniform.id" :value="uniform.id">
                {{ uniform.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="mt-8 flex items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="filteredEntries.length === 0"
        class="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
      >
        Nenhum número de uniforme informado pelos jogadores.
      </div>

      <!-- Table -->
      <div v-else class="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-white/10">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Jogador</th>
              <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Número</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Modelo do uniforme</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-white/10">
            <tr
              v-for="entry in filteredEntries"
              :key="entry.id"
              class="hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-600">
                    <img
                      :src="entry.player_photo_url || playerFallbackAvatar"
                      :alt="entry.player_name"
                      class="h-full w-full object-cover"
                      @error="$event.target.src = playerFallbackAvatar"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ entry.player_name || 'Jogador' }}</p>
                    <p v-if="entry.player_nickname" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ entry.player_nickname }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span class="inline-flex items-center justify-center rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                  {{ entry.number }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <img
                    v-if="uniformPhotoById(entry.uniform_id)"
                    :src="uniformPhotoById(entry.uniform_id)"
                    alt=""
                    class="h-8 w-8 rounded object-cover border border-gray-200 dark:border-white/10"
                  />
                  <span>{{ entry.uniform_name || uniformNameById(entry.uniform_id) || '—' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <button
                  @click="startEdit(entry)"
                  class="inline-flex items-center gap-1 rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 dark:border-orange-500/30 dark:bg-transparent dark:text-orange-400 dark:hover:bg-orange-500/10"
                >
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="editing"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar uniforme</h2>
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="cancelEdit"
            >
              ×
            </button>
          </div>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ editing.player_name }}
          </p>

          <div class="mt-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Número</label>
              <input
                v-model.number="editForm.number"
                type="number"
                min="1"
                max="999"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Modelo do uniforme</label>
              <select
                v-model="editForm.uniformId"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option v-for="uniform in uniforms" :key="uniform.id" :value="uniform.id">
                  {{ uniform.name }}
                </option>
              </select>
            </div>

            <p v-if="editError" class="text-sm text-red-600 dark:text-red-400">{{ editError }}</p>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-xl border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              @click="cancelEdit"
            >
              Cancelar
            </button>
            <button
              type="button"
              :disabled="savingEdit || !isEditValid"
              class="rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              @click="saveEdit"
            >
              {{ savingEdit ? 'Salvando...' : 'Salvar' }}
            </button>
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
import Swal from "@/services/swal.js";
import { resolveStorageUrl } from "@/services/storage.js";

export default {
  name: "TeamPlayerUniforms",
  components: {
    systemLayout,
    TeamBanner,
  },
  data() {
    return {
      teamId: null,
      entries: [],
      uniforms: [],
      loading: false,
      filters: {
        name: '',
        uniformId: null,
      },
      editing: null,
      editForm: {
        number: null,
        uniformId: null,
      },
      editError: null,
      savingEdit: false,
      playerFallbackAvatar: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="%239ca3af" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>'),
    }
  },
  created() {
    this.teamId = this.$route.params.teamId ?? null
    this.loadAll()
  },
  computed: {
    filteredEntries() {
      const name = this.filters.name.trim().toLowerCase()
      return this.entries.filter(entry => {
        const matchesName = !name
          || (entry.player_name || '').toLowerCase().includes(name)
          || (entry.player_nickname || '').toLowerCase().includes(name)
        const matchesUniform = !this.filters.uniformId
          || Number(entry.uniform_id) === Number(this.filters.uniformId)
        return matchesName && matchesUniform
      })
    },
    isEditValid() {
      const n = Number(this.editForm.number)
      return Number.isInteger(n) && n >= 1 && n <= 999 && !!this.editForm.uniformId
    },
  },
  methods: {
    async loadAll() {
      if (!this.teamId) return
      this.loading = true
      try {
        const [entriesRes, uniformsRes] = await Promise.all([
          api.get(`/team/${this.teamId}/uniform-numbers`),
          api.get(`/team/${this.teamId}/uniforms`),
        ])
        this.entries = entriesRes.data?.data || entriesRes.data || []
        this.uniforms = uniformsRes.data || []
      } catch (err) {
        console.error('Erro ao carregar uniformes dos jogadores:', err)
        await Swal.fire({
          toast: true, position: 'top-end', icon: 'error',
          title: 'Erro ao carregar uniformes', showConfirmButton: false, timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    resetFilters() {
      this.filters = { name: '', uniformId: null }
    },

    uniformNameById(uniformId) {
      const uniform = this.uniforms.find(u => Number(u.id) === Number(uniformId))
      return uniform ? uniform.name : null
    },

    uniformPhotoById(uniformId) {
      const uniform = this.uniforms.find(u => Number(u.id) === Number(uniformId))
      if (!uniform) return null
      return resolveStorageUrl(uniform.photo) || uniform.photo_url || null
    },

    startEdit(entry) {
      this.editing = entry
      this.editForm.number = entry.number
      this.editForm.uniformId = entry.uniform_id
      this.editError = null
    },

    cancelEdit() {
      this.editing = null
      this.editForm = { number: null, uniformId: null }
      this.editError = null
    },

    async saveEdit() {
      if (!this.isEditValid) {
        this.editError = 'Informe um número válido (1 a 999) e um modelo.'
        return
      }

      this.savingEdit = true
      this.editError = null

      try {
        await api.put(`/team/${this.teamId}/uniform-numbers/${this.editing.id}`, {
          number: Number(this.editForm.number),
          uniform_id: this.editForm.uniformId,
        })

        // Reflect the change locally.
        this.editing.number = Number(this.editForm.number)
        this.editing.uniform_id = this.editForm.uniformId
        this.editing.uniform_name = this.uniformNameById(this.editForm.uniformId)

        this.cancelEdit()

        await Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: 'Uniforme atualizado', showConfirmButton: false, timer: 2000,
        })
      } catch (err) {
        console.error(err)
        if (err.response?.status === 422) {
          const data = err.response.data || {}
          this.editError = Object.values(data.errors || {}).flat().join(' ') || data.message || 'Erro de validação.'
        } else {
          this.editError = err.response?.data?.message || 'Erro ao salvar uniforme.'
        }
      } finally {
        this.savingEdit = false
      }
    },
  },
}
</script>
