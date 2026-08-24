<template>
  <system-layout>
    <main class="space-y-6">
      <!-- Loading -->
      <div v-if="loading && !team.name" class="flex items-center justify-center py-20">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
      </div>

      <!-- Header Card -->
      <div v-else class="rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <!-- Banner -->
        <img class="h-40 w-full object-cover lg:h-56" :src="team.banner_url || fallbackImage" @error="$event.target.src = fallbackImage" alt="" />

        <!-- Profile area -->
        <div class="px-4 sm:px-6 lg:px-8 pb-6">
          <div class="-mt-14 sm:-mt-18 sm:flex sm:items-end sm:space-x-5">
            <div class="flex">
              <img class="size-28 rounded-full ring-4 ring-white sm:size-36 dark:ring-gray-800 object-cover cursor-pointer hover:scale-105 hover:ring-orange-300 transition-all duration-200 shadow-lg"
                   :src="team.logo_url || fallbackImage"
                   @error="$event.target.src = fallbackImage"
                   alt=""
                   @click="openLightbox()" />
            </div>
            <div class="mt-4 sm:mt-0 sm:flex sm:min-w-0 sm:flex-1 sm:items-end sm:justify-between sm:pb-2">
              <div class="min-w-0 flex-1">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white truncate">{{ team.name }}</h1>
                <p v-if="team.city_info" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  📍 {{ team.city_info?.name }} / {{ team.city_info?.state_info?.name }}
                </p>
              </div>
              <div class="mt-4 sm:mt-0 flex gap-2">
                <button type="button" class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors">
                  Amistoso
                </button>
                <button type="button" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors">
                  Favoritar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <component is="MapIcon" class="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Estado</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ team.city_info?.state_info?.name ?? 'Desconhecido' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <component is="MapPinIcon" class="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cidade</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ team.city_info?.name ?? 'Desconhecido' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <component is="CalendarIcon" class="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fundação</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ team.foundation_date_br ?? 'Não informado' }}</p>
          </div>
        </div>
      </div>

      <!-- Recruiting Section -->
      <div
        v-if="team.isRecruiting && team.isRecruiting.length > 0"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 px-6 py-5 shadow-lg border border-gray-700"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-xl shadow-md">
            ⚽
          </div>
          <div>
            <h3 class="text-base font-bold text-white">
              Recrutando jogadores!
            </h3>
            <div class="mt-1 flex flex-wrap gap-1">
              <span v-for="(item, index) in team.isRecruiting" :key="index"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {{ item.game_position_info.name }}
              </span>
            </div>
          </div>
        </div>

        <button
          @click="handleInterestClick"
          class="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-orange-400 hover:shadow-lg active:scale-95 whitespace-nowrap"
        >
          Tenho interesse
        </button>
      </div>

      <!-- Description Section -->
      <div v-if="team.description" class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">Sobre o time</h2>
        <div v-html="team.description" class="prose dark:prose-invert prose-sm max-w-none text-gray-700 dark:text-gray-300"></div>
      </div>

      <!-- Performance Stats -->
      <div v-if="performance.length" class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Desempenho</h2>

        <div class="space-y-6">
          <div v-for="stats in performance" :key="stats.year">
            <h3 class="text-lg font-black text-gray-900 dark:text-white mb-3">{{ stats.year }}</h3>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
                <p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.matches }}</p>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Partidas</p>
              </div>
              <div class="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-center">
                <p class="text-2xl font-black text-green-600 dark:text-green-400">{{ stats.wins }}</p>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Vitórias</p>
              </div>
              <div class="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3 text-center">
                <p class="text-2xl font-black text-yellow-600 dark:text-yellow-400">{{ stats.draws }}</p>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Empates</p>
              </div>
              <div class="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-center">
                <p class="text-2xl font-black text-red-600 dark:text-red-400">{{ stats.losses }}</p>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Derrotas</p>
              </div>
              <div class="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-center">
                <p class="text-2xl font-black text-blue-600 dark:text-blue-400">{{ stats.goals_scored }}</p>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Gols feitos</p>
              </div>
              <div class="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3 text-center">
                <p class="text-2xl font-black text-orange-600 dark:text-orange-400">{{ stats.goals_conceded }}</p>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Gols sofridos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interest Modal -->
      <div
        v-if="showInterestModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Escolha uma posição
              </h2>

              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Seu perfil será exibido ao dono do time. Você poderá checar o status da sua aplicação
                a qualquer momento no menu "Minhas Aplicações" dentro da área de jogadores.
              </p>
            </div>

            <button
              type="button"
              class="rounded-lg px-2 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="closeInterestModal"
            >
              ×
            </button>
          </div>

          <div class="mt-6">
            <label
              for="recruitGamePositionId"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Posição desejada
            </label>

            <select
              id="recruitGamePositionId"
              v-model="recruitGamePositionId"
              class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option :value="0" disabled>
                Selecione uma posição
              </option>

              <option
                v-for="item in team.isRecruiting"
                :key="item.id"
                :value="item.game_position_info.id"
              >
                {{ item.game_position_info.name }}
              </option>
            </select>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-xl border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              @click="closeInterestModal"
            >
              Cancelar
            </button>

            <button
              type="button"
              class="rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300"
              :disabled="loading || !recruitGamePositionId"
              @click="submitInterest"
            >
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="isLightboxOpen"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer"
           @click.self="closeLightbox">
        <img :src="team.logo_url"
             class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg cursor-pointer"
             @click="closeLightbox" />
      </div>
    </Transition>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import { MapIcon, MapPinIcon, CalendarIcon } from '@heroicons/vue/20/solid'
import Swal from "@/services/swal.js"

export default {
  name: "teamList",
  components: {
    systemLayout,
    MapIcon,
    MapPinIcon,
    CalendarIcon,
  },
  data() {
    return {
      teamId: 0,
      team: {},
      performance: [],
      recruitGamePositionId: 0,
      showInterestModal: false,
      loading: false,
      isLightboxOpen: false,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    }
  },
  created() {
    this.teamId = this.$route.params.id
    this.getTeamInformation()
  },
  mounted() {
    this._escHandler = (e) => { if (e.key === 'Escape' && this.isLightboxOpen) this.closeLightbox(); };
    document.addEventListener('keydown', this._escHandler);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._escHandler);
  },
  methods: {
    openLightbox() {
      if (!this.team?.logo_url) return;
      this.isLightboxOpen = true;
      document.body.classList.add('overflow-hidden');
    },
    closeLightbox() {
      this.isLightboxOpen = false;
      document.body.classList.remove('overflow-hidden');
    },
    async getTeamInformation() {
      if (this.teamId !== 0) {
        this.loading = true;

        try {
          let response = await api.get("/team/show/" + this.teamId);
          this.team = response.data

          this.loadPerformance()
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
    },
    async loadPerformance() {
      try {
        const response = await api.get(`/team/${this.teamId}/performance`)
        this.performance = response.data || []
      } catch (err) {
        console.error('Erro ao carregar desempenho:', err)
      }
    },
    handleInterestClick() {
      this.recruitGamePositionId = 0;
      this.showInterestModal = true;
    },
    closeInterestModal() {
      this.showInterestModal = false;
      this.recruitGamePositionId = 0;
    },
    async submitInterest() {
      if (!this.recruitGamePositionId) {
        await Swal.fire({
          icon: "warning",
          title: "Atenção!",
          text: "Selecione uma posição antes de salvar.",
        });

        return;
      }

      this.loading = true;

      try {
        await api.post(`/team-application/apply/save`, {
          gamePositionId: this.recruitGamePositionId,
          teamId: this.teamId,
        });

        this.closeInterestModal();

        await Swal.fire({
          icon: "success",
          title: "Pedido enviado!",
          text: "Sua aplicação foi enviada com sucesso.",
          confirmButtonText: "Ok",
        });
      } catch (err) {
        let mensagem = "Não foi possível aplicar nesse time.";

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
    }
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
