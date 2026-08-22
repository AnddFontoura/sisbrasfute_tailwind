<template>
  <system-layout>
    <main class="py-4">
      <div class="max-w-6xl mx-auto space-y-8">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">Meus Times</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Times que você administra e dos quais participa.</p>
          </div>
          <router-link
            :to="{ name: 'team-form' }"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 w-full sm:w-auto"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Criar Time
          </router-link>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
        </div>

        <template v-else>
          <!-- Section: Times Administrados -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Times que Administro</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400">Times criados por você.</p>
              </div>
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input
                  v-model="showInactive"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Mostrar inativos</span>
              </label>
            </div>

            <!-- Empty state -->
            <div v-if="filteredAdministered.length === 0" class="rounded-xl border border-gray-200 bg-gray-50 px-5 py-6 text-center dark:border-white/10 dark:bg-gray-800">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ showInactive ? 'Nenhum time administrado encontrado.' : 'Nenhum time ativo administrado.' }}
              </p>
            </div>

            <!-- Grid -->
            <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="team in filteredAdministered"
                :key="team.id"
                class="group overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-md"
                :class="team.status === 0
                  ? 'border-red-200 bg-red-50/50 dark:border-red-500/20 dark:bg-red-900/10'
                  : 'border-gray-200 bg-white hover:border-orange-500/40 dark:border-white/10 dark:bg-gray-800'"
              >
                <!-- Banner -->
                <div
                  class="relative h-20 bg-cover bg-center"
                  :style="{ backgroundImage: `url(${team.banner_url || fallbackImage})` }"
                >
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span
                    v-if="team.status === 0"
                    class="absolute top-2 right-2 inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white"
                  >
                    Inativo
                  </span>
                </div>

                <!-- Info -->
                <div class="px-4 pt-3 pb-4">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow dark:border-gray-700">
                      <img
                        :src="team.logo_url || fallbackImage"
                        :alt="team.name"
                        class="h-full w-full object-cover"
                        @error="$event.target.src = fallbackImage"
                      />
                    </div>
                    <div class="min-w-0">
                      <h3 class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ team.name }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <router-link
                      :to="{ name: 'team-admin', params: { id: team.id } }"
                      class="flex-1 inline-flex items-center justify-center rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
                    >
                      Administrar
                    </router-link>
                    <router-link
                      :to="{ name: 'team-show', params: { id: team.id } }"
                      class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      Ver
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section: Times que Participo -->
          <section>
            <div class="mb-4">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Times que Participo</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">Times dos quais você é jogador.</p>
            </div>

            <!-- Empty state -->
            <div v-if="memberTeams.length === 0" class="rounded-xl border border-gray-200 bg-gray-50 px-5 py-6 text-center dark:border-white/10 dark:bg-gray-800">
              <p class="text-sm text-gray-500 dark:text-gray-400">Você ainda não participa de nenhum time como jogador.</p>
            </div>

            <!-- Grid -->
            <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="team in memberTeams"
                :key="team.id"
                class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-500/40 hover:shadow-md dark:border-white/10 dark:bg-gray-800"
              >
                <!-- Banner -->
                <div
                  class="relative h-20 bg-cover bg-center"
                  :style="{ backgroundImage: `url(${team.banner_url || fallbackImage})` }"
                >
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <!-- Info -->
                <div class="px-4 pt-3 pb-4">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow dark:border-gray-700">
                      <img
                        :src="team.logo_url || fallbackImage"
                        :alt="team.name"
                        class="h-full w-full object-cover"
                        @error="$event.target.src = fallbackImage"
                      />
                    </div>
                    <div class="min-w-0">
                      <h3 class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ team.name }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Jogador</p>
                    </div>
                  </div>

                  <router-link
                    :to="{ name: 'team-show', params: { id: team.id } }"
                    class="w-full inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Visualizar
                  </router-link>
                </div>
              </div>
            </div>
          </section>
        </template>

      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import api from "@/services/api.js";

export default {
  name: "MyTeams",
  components: {
    systemLayout,
  },

  data() {
    return {
      administeredTeams: [],
      memberTeams: [],
      loading: false,
      showInactive: false,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    }
  },

  computed: {
    filteredAdministered() {
      if (this.showInactive) {
        return this.administeredTeams
      }
      return this.administeredTeams.filter(t => t.status !== 0)
    },
  },

  created() {
    this.loadTeams()
  },

  methods: {
    async loadTeams() {
      this.loading = true
      try {
        const response = await api.get('/team/list/my-teams-full')
        this.administeredTeams = response.data.administered || []
        this.memberTeams = response.data.member || []
      } catch (err) {
        console.error('Erro ao carregar meus times:', err)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
