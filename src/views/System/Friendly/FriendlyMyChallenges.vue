<template>
  <system-layout>
    <main>
      <div class="space-y-6">

        <!-- Header -->
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Meus Desafios</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Desafios que seus times enviaram para amistosos.</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
        </div>

        <!-- Empty -->
        <div v-else-if="challenges.length === 0" class="rounded-xl border border-gray-200 bg-gray-50 px-5 py-8 text-center dark:border-white/10 dark:bg-gray-800">
          <p class="text-sm text-gray-500 dark:text-gray-400">Você ainda não enviou nenhum desafio.</p>
          <router-link
            :to="{ name: 'friendly-open' }"
            class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            Ver amistosos disponíveis →
          </router-link>
        </div>

        <!-- Challenges list -->
        <div v-else class="space-y-4">
          <div
            v-for="challenge in challenges"
            :key="challenge.id"
            class="rounded-2xl border bg-white p-5 shadow-sm dark:bg-gray-800"
            :class="statusBorderClass(challenge.status)"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    :class="statusBadgeClass(challenge.status)"
                  >
                    {{ statusLabel(challenge.status) }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(challenge.created_at) }}
                  </span>
                </div>

                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ challenge.challenger_team?.name || 'Meu time' }}
                  <span class="text-gray-400 font-normal mx-1">desafiou</span>
                  {{ challenge.match?.my_team_name || challenge.match?.my_team_info?.name || 'Time' }}
                </p>

                <div class="mt-1 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span v-if="challenge.match?.city_info">
                    📍 {{ challenge.match.city_info.name }} / {{ challenge.match.city_info.state_info?.name }}
                  </span>
                  <span v-if="challenge.match?.schedule_br">
                    📅 {{ challenge.match.schedule_br }}
                  </span>
                </div>

                <p v-if="challenge.message" class="mt-2 text-xs text-gray-600 dark:text-gray-300 italic">
                  "{{ challenge.message }}"
                </p>
              </div>

              <div class="flex gap-2">
                <router-link
                  v-if="challenge.match"
                  :to="{ name: 'matches-show', params: { id: challenge.match.id || challenge.match_id } }"
                  class="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition"
                >
                  Ver partida
                </router-link>

                <button
                  v-if="challenge.status === 1"
                  @click="confirmChallenge(challenge)"
                  class="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition"
                >
                  Confirmar
                </button>

                <button
                  v-if="challenge.status === 0 || challenge.status === 1"
                  @click="cancelChallenge(challenge)"
                  class="inline-flex items-center rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import api from "@/services/api.js";
import Swal from "@/services/swal.js";

export default {
  name: "FriendlyMyChallenges",
  components: {
    systemLayout,
  },

  data() {
    return {
      challenges: [],
      loading: false,
    }
  },

  created() {
    this.loadChallenges()
  },

  methods: {
    async loadChallenges() {
      this.loading = true
      try {
        const response = await api.get('/match-challenges/my-challenges')
        this.challenges = response.data || []
      } catch (err) {
        console.error('Erro ao carregar desafios:', err)
      } finally {
        this.loading = false
      }
    },

    async confirmChallenge(challenge) {
      const matchId = challenge.match_id || challenge.match?.id
      try {
        await api.post(`/match-challenges/${matchId}/${challenge.id}/confirm`)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Desafio confirmado! Partida marcada!',
          showConfirmButton: false,
          timer: 2500,
        })
        await this.loadChallenges()
      } catch (err) {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: err.response?.data?.message || 'Erro ao confirmar desafio.',
          showConfirmButton: false,
          timer: 3000,
        })
      }
    },

    async cancelChallenge(challenge) {
      const result = await Swal.fire({
        title: 'Cancelar desafio?',
        text: 'Tem certeza que deseja cancelar este desafio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Sim, cancelar',
        cancelButtonText: 'Não',
      })

      if (!result.isConfirmed) return

      const matchId = challenge.match_id || challenge.match?.id
      try {
        await api.post(`/match-challenges/${matchId}/${challenge.id}/cancel`)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Desafio cancelado.',
          showConfirmButton: false,
          timer: 2000,
        })
        await this.loadChallenges()
      } catch (err) {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: err.response?.data?.message || 'Erro ao cancelar desafio.',
          showConfirmButton: false,
          timer: 3000,
        })
      }
    },

    statusLabel(status) {
      const labels = {
        0: 'Pendente',
        1: 'Aceito pelo anfitrião',
        2: 'Confirmado',
        3: 'Recusado',
        4: 'Cancelado',
      }
      return labels[status] || 'Desconhecido'
    },

    statusBadgeClass(status) {
      const classes = {
        0: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        2: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        3: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        4: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      }
      return classes[status] || ''
    },

    statusBorderClass(status) {
      const classes = {
        0: 'border-yellow-200 dark:border-yellow-500/20',
        1: 'border-blue-200 dark:border-blue-500/20',
        2: 'border-green-200 dark:border-green-500/20',
        3: 'border-red-200 dark:border-red-500/20',
        4: 'border-gray-200 dark:border-gray-600',
      }
      return classes[status] || 'border-gray-200 dark:border-white/10'
    },

    formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
  },
}
</script>
