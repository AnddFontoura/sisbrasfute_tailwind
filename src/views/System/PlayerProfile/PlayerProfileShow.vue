<template>
  <system-layout>
    <main>
      <div class="rounded">
        <img class="h-32 w-full object-cover lg:h-48 rounded-t-xl" :src="playerProfile?.banner_url || fallbackImage" alt="" />
        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div class="flex">
              <img class="size-24 rounded-full ring-4 ring-white sm:size-32 dark:ring-gray-900 cursor-pointer hover:scale-105 hover:ring-orange-300 transition-all duration-200"
                   :src="playerProfile?.photo_url || fallbackImage"
                   alt=""
                   @click="openLightbox()" />
            </div>
            <div class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
                <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ playerProfile.name }}</h1>
              </div>
              <div class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button type="button" class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20">
                  <span> Amistoso </span>
                </button>
                <button type="button" class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20">
                  <span> Favoritar </span>
                </button>
              </div>
            </div>
          </div>
          <div class="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
            <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ playerProfile.name }}</h1>
          </div>
        </div>
      </div>

      <div class="relative isolate dark:bg-gray-900 mt-6">
          <div class="
            mt-3
            mx-auto
            grid
            max-w-2xl
            grid-cols-1
            gap-6
            lg:mx-0
            lg:max-w-none
            lg:grid-cols-5
            lg:gap-8
          ">
            <div class="px-4 py-5 sm:px-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <ul role="list" class="divide-y divide-gray-200 dark:divide-white/10">
                <li class="px-4 py-4 sm:px-0">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white"> Estado </h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.city_info?.state_info?.name ?? 'Desconhecido' }}</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white"> Cidade </h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.city_info?.name ?? 'Desconhecido' }}</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Idade</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.age }} anos</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0" v-if="playerProfile.uniform_size">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Tamanho do Uniforme</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.uniform_size }}</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0" v-if="playerProfile.glove_size">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Tamanho da Luva</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.glove_size }}</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0" v-if="playerProfile.height">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Altura</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.height }} cm</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0" v-if="playerProfile.weight">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Peso</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.weight }} Kg</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="px-4 py-5 sm:p-6 col-span-4 space-y-6">
              <!-- Seção de Times -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Times</h3>

                <!-- Loading -->
                <div v-if="teamsLoading" class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Carregando...</span>
                </div>

                <!-- Error -->
                <p v-else-if="teamsError" class="text-sm text-red-600 dark:text-red-400">Falha ao carregar os times</p>

                <!-- Empty -->
                <p v-else-if="teams.length === 0" class="text-sm text-gray-500 dark:text-gray-400 italic">Este jogador não está cadastrado em nenhum time</p>

                <!-- Teams list -->
                <ul v-else class="divide-y divide-gray-200 dark:divide-white/10">
                  <li v-for="team in teams" :key="team.id" class="flex items-center gap-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md px-2 -mx-2 transition-colors duration-150">
                    <img :src="team.logo_url || fallbackImage" @error="$event.target.src = fallbackImage"
                         class="w-12 h-12 rounded object-cover" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ team.name }}</span>
                  </li>
                </ul>
              </div>

              <!-- Seção de Partidas -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Últimas Partidas</h3>

                <!-- Loading -->
                <div v-if="matchesLoading" class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Carregando...</span>
                </div>

                <!-- Error -->
                <p v-else-if="matchesError" class="text-sm text-red-600 dark:text-red-400">Falha ao carregar o histórico de partidas</p>

                <!-- Empty -->
                <p v-else-if="matches.length === 0" class="text-sm text-gray-500 dark:text-gray-400 italic">Este jogador não possui partidas registradas</p>

                <!-- Matches list -->
                <ul v-else class="divide-y divide-gray-200 dark:divide-white/10">
                  <li v-for="match in matches" :key="match.id" class="py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md px-2 -mx-2 transition-colors duration-150">
                    <div class="flex items-center justify-between">
                      <div class="text-sm text-gray-700 dark:text-gray-300">
                        <span class="font-medium">{{ match.my_team_name }}</span>
                        <span class="mx-1 text-gray-900 dark:text-white font-bold">{{ match.my_team_score }} a {{ match.enemy_team_score }}</span>
                        <span class="font-medium">{{ match.enemy_team_name }}</span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ match.schedule_br }}</span>
                    </div>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="isLightboxOpen"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer transition-opacity duration-300"
           @click.self="closeLightbox">
        <img :src="playerProfile.photo_url"
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
  name: "PlayerProfileShow",
  components: {
    systemLayout,
  },
  data() {
    return {
      playerProfileId: 0,
      playerProfile: {},
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      isLightboxOpen: false,
      teams: [],
      teamsLoading: true,
      teamsError: false,
      matches: [],
      matchesLoading: true,
      matchesError: false,
    }
  },
  created() {
    this.playerProfileId = this.$route.params.id
    this.getTeamInformation()
    this.getPlayerTeams()
    this.getPlayerMatches()
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
      if (!this.playerProfile?.photo_url) return;
      this.isLightboxOpen = true;
      document.body.classList.add('overflow-hidden');
    },
    closeLightbox() {
      this.isLightboxOpen = false;
      document.body.classList.remove('overflow-hidden');
    },
    async getPlayerTeams() {
      this.teamsLoading = true;
      this.teamsError = false;
      try {
        const response = await api.get('/player-profile/' + this.playerProfileId + '/teams');
        this.teams = response.data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (err) {
        console.error(err);
        this.teamsError = true;
      } finally {
        this.teamsLoading = false;
      }
    },
    async getPlayerMatches() {
      this.matchesLoading = true;
      this.matchesError = false;
      try {
        const response = await api.get('/player-profile/' + this.playerProfileId + '/matches?limit=5');
        this.matches = response.data;
      } catch (err) {
        console.error(err);
        this.matchesError = true;
      } finally {
        this.matchesLoading = false;
      }
    },
    async getTeamInformation() {
      if (this.playerProfileId !== 0) {
        this.loading = true;

        try {
          let response = await api.get("/player-profile/show/" + this.playerProfileId);
          this.playerProfile = response.data

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
