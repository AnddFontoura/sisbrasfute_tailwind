<template>
  <system-layout>
    <main>
      <div class="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="text-center py-12">
          <p class="text-sm text-red-600 dark:text-red-400">Erro ao carregar dados da partida.</p>
        </div>

        <!-- Content -->
        <template v-else>
        <!-- SEÇÃO CONFRONTO -->
        <div class="flex items-center justify-center gap-4 sm:gap-8 py-6">
          <!-- Time Mandante -->
          <div class="flex flex-col items-center text-center w-1/3">
            <img :src="homeLogoUrl" @error="$event.target.src = fallbackImage"
                 class="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-gray-200 dark:ring-gray-700 object-cover cursor-pointer hover:scale-105 hover:ring-orange-300 transition-all duration-200"
                 @click="openLightbox(matchInfo.home_team_info?.logo_url)" />
            <p class="mt-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
              {{ homeTeamDisplayName }}
            </p>
          </div>

          <!-- Placar / VS -->
          <div class="flex flex-col items-center">
            <div v-if="hasScore" class="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {{ matchInfo.home_score }} <span class="text-gray-400">x</span> {{ matchInfo.visitor_score }}
            </div>
            <div v-else class="text-xl sm:text-3xl font-bold text-gray-400 dark:text-gray-500">
              vs
            </div>
            <div v-if="showPenalties" class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ({{ matchInfo.home_penalty_score }} x {{ matchInfo.visitor_penalty_score }}) pen.
            </div>
          </div>

          <!-- Time Visitante -->
          <div class="flex flex-col items-center text-center w-1/3">
            <img :src="visitorLogoUrl" @error="$event.target.src = fallbackImage"
                 class="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-gray-200 dark:ring-gray-700 object-cover cursor-pointer hover:scale-105 hover:ring-orange-300 transition-all duration-200"
                 @click="openLightbox(matchInfo.visitor_team_info?.logo_url)" />
            <p class="mt-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
              {{ visitorTeamDisplayName }}
            </p>
          </div>
        </div>

        <!-- SEÇÃO METADADOS -->
        <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Campeonato -->
            <div v-if="matchInfo.championship_name" class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span class="text-lg">🏆</span>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Campeonato</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ matchInfo.championship_name }}</p>
              </div>
            </div>

            <!-- Data/Horário -->
            <div v-if="matchInfo.schedule_br" class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span class="text-lg">📅</span>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Data e Horário</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ matchInfo.schedule_br }}</p>
              </div>
            </div>

            <!-- Cidade/Estado -->
            <div v-if="matchInfo.city_info?.name && matchInfo.city_info?.state_info?.name" class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span class="text-lg">📍</span>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cidade</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ matchInfo.city_info.name }} / {{ matchInfo.city_info.state_info.name }}</p>
              </div>
            </div>

            <!-- Local (HTML) -->
            <div v-if="matchInfo.location" class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 sm:col-span-2">
              <span class="text-lg">🏟️</span>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Local</p>
                <div class="text-sm text-gray-900 dark:text-white prose dark:prose-invert prose-sm max-w-none" v-html="matchInfo.location"></div>
              </div>
            </div>

          </div>
        </div>

        <!-- SEÇÃO BOTÕES -->
        <div class="mt-6 flex flex-wrap gap-3 justify-center">
          <router-link v-if="matchInfo.positions && matchInfo.positions.length > 0"
            :to="{ name: 'matches-positions', params: { id: matchId } }"
            class="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2">
            Gerenciar Posições
          </router-link>
          <router-link v-if="matchInfo.positions && matchInfo.positions.length > 0"
            :to="{ name: 'matches-choose-position', params: { id: matchId } }"
            class="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2">
            Escolher Minha Posição
          </router-link>
        </div>
        </template>
      </div>
    </main>

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="isLightboxOpen"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer"
           @click.self="closeLightbox">
        <img :src="lightboxImageUrl"
             class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg cursor-pointer"
             @click="closeLightbox" />
      </div>
    </Transition>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import Swal from "@/services/swal.js";

export default {
  name: "MatchesShow",
  components: {
    systemLayout,
  },
  data() {
    return {
      matchId: 0,
      matchInfo: {},
      loading: false,
      loadError: false,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      isLightboxOpen: false,
      lightboxImageUrl: null,
    }
  },
  computed: {
    homeLogoUrl() {
      return this.matchInfo.home_team_info?.logo_url || this.fallbackImage;
    },
    visitorLogoUrl() {
      return this.matchInfo.visitor_team_info?.logo_url || this.fallbackImage;
    },
    homeTeamDisplayName() {
      return this.matchInfo.home_team_info?.name || this.matchInfo.home_team_name || 'Desconhecido';
    },
    visitorTeamDisplayName() {
      return this.matchInfo.visitor_team_info?.name || this.matchInfo.visitor_team_name || 'Desconhecido';
    },
    hasScore() {
      return this.matchInfo.home_score !== null && this.matchInfo.home_score !== undefined
          && this.matchInfo.visitor_score !== null && this.matchInfo.visitor_score !== undefined;
    },
    showPenalties() {
      return this.matchInfo.has_penalties === true || this.matchInfo.has_penalties === 1;
    },
  },
  created() {
    this.matchId = this.$route.params.id
    this.getMatchInformation()
  },
  mounted() {
    this._escHandler = (e) => { if (e.key === 'Escape' && this.isLightboxOpen) this.closeLightbox(); };
    document.addEventListener('keydown', this._escHandler);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._escHandler);
  },
  methods: {
    openLightbox(imageUrl) {
      if (!imageUrl || imageUrl === this.fallbackImage) return;
      this.lightboxImageUrl = imageUrl;
      this.isLightboxOpen = true;
      document.body.classList.add('overflow-hidden');
    },
    closeLightbox() {
      this.isLightboxOpen = false;
      this.lightboxImageUrl = null;
      document.body.classList.remove('overflow-hidden');
    },
    async getMatchInformation() {
      if (this.matchId !== 0) {
        this.loading = true;

        try {
          let response = await api.get("/matches/show/" + this.matchId);
          this.matchInfo = response.data

        } catch (err) {
          console.error(err);
          if (err.response?.status === 404) {
            await Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Partida não encontrada',
              showConfirmButton: false,
              timer: 3000,
            });
            this.$router.push('/matches/list');
            return;
          }
          this.loadError = true;
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Erro ao carregar dados da partida',
            showConfirmButton: false,
            timer: 3000,
          });
        } finally {
          this.loading = false;
        }
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
