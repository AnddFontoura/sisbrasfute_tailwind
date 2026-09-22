<template>
  <system-layout>
    <main>
      <div class="mt-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Minhas Camisas</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Informe os números que você possui de cada camisa do time. Assim, ao escolher uma posição na partida, é só selecionar o número.
        </p>
      </div>

      <!-- Team selector -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Time</label>
        <select
          v-model="selectedTeamId"
          @change="loadUniforms"
          class="mt-1 w-full sm:w-80 rounded-lg border border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
        >
          <option :value="null" disabled>Selecione um time</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="mt-6 text-center text-gray-500 dark:text-gray-400">Carregando...</div>

      <!-- No teams -->
      <div
        v-else-if="teams.length === 0"
        class="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 shadow-sm dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-300"
      >
        <p class="text-sm font-medium">Você não faz parte de nenhum time ainda.</p>
      </div>

      <!-- No uniforms for the team -->
      <div
        v-else-if="selectedTeamId && uniforms.length === 0"
        class="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
      >
        <p class="text-sm">Este time ainda não cadastrou camisas.</p>
      </div>

      <!-- Uniforms list -->
      <div v-else-if="selectedTeamId" class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="uniform in uniforms"
          :key="uniform.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4"
        >
          <div class="flex items-center gap-3">
            <img
              v-if="uniformPhoto(uniform)"
              :src="uniformPhoto(uniform)"
              alt=""
              class="h-14 w-14 rounded-lg object-cover border border-gray-200 dark:border-white/10 cursor-pointer transition hover:ring-2 hover:ring-orange-400"
              @click="openLightbox(uniformPhoto(uniform))"
            />
            <div v-else class="h-14 w-14 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-300 dark:text-gray-600">
              <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 4.5 4 6.5V10l2.5-1v9.5h11V9L20 10V6.5L16.5 4.5 14 6a2 2 0 0 1-4 0L7.5 4.5Z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ uniform.name }}</p>
          </div>

          <!-- Number chips -->
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="(num, idx) in uniform._numbers"
              :key="idx"
              class="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 px-2.5 py-1 text-xs font-semibold"
            >
              {{ num }}
              <button type="button" @click="removeNumber(uniform, idx)" class="hover:text-orange-950 dark:hover:text-white">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
            <span v-if="uniform._numbers.length === 0" class="text-xs text-gray-400 dark:text-gray-500 italic self-center">
              Nenhum número informado
            </span>
          </div>

          <!-- Add number + save -->
          <div class="mt-3 flex items-center gap-2">
            <input
              v-model="uniform._newNumber"
              type="number"
              min="1"
              max="999"
              placeholder="Nº"
              class="w-20 rounded-lg border border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white px-2 py-1.5 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              @keyup.enter="addNumber(uniform)"
            />
            <button
              type="button"
              @click="addNumber(uniform)"
              class="rounded-lg border border-gray-300 dark:border-white/10 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10"
            >
              Adicionar
            </button>
            <button
              type="button"
              @click="saveNumbers(uniform)"
              :disabled="uniform._saving"
              class="ml-auto rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {{ uniform._saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Lightbox -->
    <Transition name="fade">
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer"
        @click.self="closeLightbox"
      >
        <img
          :src="lightboxImageUrl"
          class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg cursor-pointer"
          @click="closeLightbox"
        />
      </div>
    </Transition>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import Swal from "@/services/swal.js";
import { resolveStorageUrl } from "@/services/storage.js";

export default {
  name: "MyUniformNumbers",
  components: {
    systemLayout,
  },
  data() {
    return {
      teams: [],
      selectedTeamId: null,
      uniforms: [],
      loading: false,
      isLightboxOpen: false,
      lightboxImageUrl: null,
    }
  },
  created() {
    this.loadTeams()
  },
  mounted() {
    this._escHandler = (e) => { if (e.key === 'Escape' && this.isLightboxOpen) this.closeLightbox() }
    document.addEventListener('keydown', this._escHandler)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._escHandler)
  },
  methods: {
    uniformPhoto(uniform) {
      return resolveStorageUrl(uniform.photo) || uniform.photo_url || null
    },

    openLightbox(imageUrl) {
      if (!imageUrl) return
      this.lightboxImageUrl = imageUrl
      this.isLightboxOpen = true
      document.body.classList.add('overflow-hidden')
    },

    closeLightbox() {
      this.isLightboxOpen = false
      this.lightboxImageUrl = null
      document.body.classList.remove('overflow-hidden')
    },

    async loadTeams() {
      this.loading = true
      try {
        const response = await api.get('/team/list/my-teams-full')
        const administered = response.data.administered || []
        const member = response.data.member || []
        // Merge and dedupe by id (a user could appear in both lists).
        const map = new Map()
        ;[...administered, ...member].forEach(t => map.set(t.id, t))
        this.teams = Array.from(map.values())
      } catch (err) {
        console.error('Erro ao carregar times:', err)
      } finally {
        this.loading = false
      }
    },

    async loadUniforms() {
      if (!this.selectedTeamId) return
      this.loading = true
      try {
        const response = await api.get(`/team/${this.selectedTeamId}/my-uniform-numbers`)
        this.uniforms = (response.data || []).map(u => ({
          ...u,
          _numbers: [...(u.my_numbers || [])],
          _newNumber: '',
          _saving: false,
        }))
      } catch (err) {
        console.error('Erro ao carregar camisas:', err)
        await Swal.fire({
          toast: true, position: 'top-end', icon: 'error',
          title: 'Erro ao carregar camisas', showConfirmButton: false, timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    addNumber(uniform) {
      const n = parseInt(uniform._newNumber, 10)
      if (!Number.isInteger(n) || n < 1 || n > 999) return
      if (uniform._numbers.includes(n)) {
        uniform._newNumber = ''
        return
      }
      uniform._numbers.push(n)
      uniform._numbers.sort((a, b) => a - b)
      uniform._newNumber = ''
    },

    removeNumber(uniform, idx) {
      uniform._numbers.splice(idx, 1)
    },

    async saveNumbers(uniform) {
      uniform._saving = true
      try {
        await api.put(`/team/${this.selectedTeamId}/my-uniform-numbers/${uniform.id}`, {
          numbers: uniform._numbers,
        })
        await Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: 'Números salvos', showConfirmButton: false, timer: 2000,
        })
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true, position: 'top-end', icon: 'error',
          title: 'Erro ao salvar números', showConfirmButton: false, timer: 3000,
        })
      } finally {
        uniform._saving = false
      }
    },
  },
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
