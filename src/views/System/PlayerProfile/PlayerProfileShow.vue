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

              <!-- Redes Sociais -->
              <div class="px-4 py-4 sm:px-0 border-t border-gray-200 dark:border-white/10">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Redes Sociais</h3>
                <div class="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4">
                  <component
                    v-for="social in socialLinks"
                    :key="social.key"
                    :is="social.url ? 'a' : 'button'"
                    :href="social.url || undefined"
                    :target="social.url ? '_blank' : undefined"
                    :rel="social.url ? 'noopener noreferrer' : undefined"
                    :disabled="!social.url"
                    :title="social.url ? social.label : `${social.label} não informado`"
                    :aria-label="social.label"
                    class="flex h-10 w-full items-center justify-center rounded-lg border transition"
                    :class="social.url
                      ? 'cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10'
                      : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 dark:border-white/5 dark:bg-white/5 dark:text-gray-600'"
                  >
                    <span class="h-5 w-5" v-html="social.icon"></span>
                  </component>
                </div>
              </div>
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

              <!-- Seção de Estatísticas Acumuladas -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-3">📊 Estatísticas Acumuladas</h3>

                <!-- Loading -->
                <div v-if="statsLoading" class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Carregando estatísticas...</span>
                </div>

                <!-- Error -->
                <div v-else-if="statsError" class="text-center py-4">
                  <p class="text-sm text-red-600 dark:text-red-400 mb-3">Falha ao carregar as estatísticas acumuladas</p>
                  <button
                    @click="loadAccumulatedStats"
                    class="inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors duration-150"
                  >
                    Tentar novamente
                  </button>
                </div>

                <!-- Stats Content -->
                <div v-else>
                  <div v-if="accumulatedStats.length === 0" class="text-sm text-gray-500 dark:text-gray-400 italic">
                    Este jogador não possui estatísticas registradas
                  </div>

                  <div v-for="stat in accumulatedStats" :key="stat.teamId" class="mb-4 last:mb-0">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ stat.teamName }}</p>

                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Partidas</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.matches_count }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">⚽ Gols</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.totals.goals_scored }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">🅰️ Assistências</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.totals.assists }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">🟡 C. Amarelos</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.totals.yellow_cards }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">🔴 C. Vermelhos</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.totals.red_cards }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">🧤 Defesas</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.totals.saves }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">😤 Faltas Com.</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.totals.fouls_committed }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">😣 Faltas Sof.</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.totals.fouls_suffered }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400">🥅 Gols Sofridos</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.totals.goals_conceded }}</p>
                      </div>
                    </div>
                  </div>
                </div>
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
import { playerStatisticsService } from "@/services/playerStatisticsService";
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
      accumulatedStats: [],
      statsLoading: false,
      statsError: false,
    }
  },
  computed: {
    socialLinks() {
      const sp = this.playerProfile?.social_profiles || {}

      // Normaliza o handle: remove espaços, @ e barras extras.
      const clean = (value) => {
        if (!value) return ''
        return String(value).trim().replace(/^@+/, '').replace(/^\/+|\/+$/g, '')
      }

      // Monta a URL completa a partir do handle salvo (que é só o usuário).
      const buildUrl = (base, value) => {
        const handle = clean(value)
        if (!handle) return null
        // Se o jogador tiver colado a URL completa, respeita.
        if (/^https?:\/\//i.test(handle)) return handle
        return `${base}${handle}`
      }

      // O backend salva a chave como "kwai"; o form antigo usava "kwaii".
      const kwaiValue = sp.kwai ?? sp.kwaii

      return [
        {
          key: 'instagram',
          label: 'Instagram',
          url: buildUrl('https://instagram.com/', sp.instagram),
          icon: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.22.55.47.94.88 1.35.41.41.8.66 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07Zm0 2.76a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 1.62a3.68 3.68 0 1 0 0 7.36 3.68 3.68 0 0 0 0-7.36Zm5.48-2.9a1.24 1.24 0 1 1 0 2.48 1.24 1.24 0 0 1 0-2.48Z"/></svg>',
        },
        {
          key: 'youtube',
          label: 'YouTube',
          url: buildUrl('https://youtube.com/', sp.youtube),
          icon: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>',
        },
        {
          key: 'tiktok',
          label: 'TikTok',
          url: buildUrl('https://tiktok.com/@', sp.tiktok),
          icon: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3.1v12.4a2.5 2.5 0 1 1-2.5-2.5c.26 0 .5.04.74.11V9.8a5.7 5.7 0 0 0-.74-.05A5.6 5.6 0 1 0 15.6 15.4V9.3a7.3 7.3 0 0 0 4.3 1.4V7.6a4.3 4.3 0 0 1-3.3-1.8Z"/></svg>',
        },
        {
          key: 'facebook',
          label: 'Facebook',
          url: buildUrl('https://facebook.com/', sp.facebook),
          icon: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.52c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3.47h-2.8v8.38A12 12 0 0 0 24 12Z"/></svg>',
        },
        {
          key: 'x',
          label: 'X (Twitter)',
          url: buildUrl('https://x.com/', sp.x),
          icon: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M18.9 2.3h3.4l-7.4 8.5L24 21.7h-6.9l-5.4-7-6.2 7H2.1l7.9-9.1L0 2.3h7l4.9 6.4 6-6.4Zm-1.2 17.4h1.9L6.4 4.3H4.3l13.4 15.4Z"/></svg>',
        },
        {
          key: 'kwai',
          label: 'Kwai',
          url: buildUrl('https://kwai.com/@', kwaiValue),
          icon: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.9 13.6-2.3-2.9-1.3 1.4v1.5H10.2V7.9h2.1v3.3l2.9-3.3h2.5l-3.2 3.5 3.3 4.2h-1.9Z"/></svg>',
        },
        {
          key: 'gda',
          label: 'Goleiro de Aluguel',
          url: buildUrl('https://goleiro.app/', sp.gda),
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 2.46m5.96 11.91a14.9 14.9 0 0 1-5.84 2.58m0 0a6 6 0 0 1-7.38-5.84h4.8m2.58-5.84a14.9 14.9 0 0 0-2.58 5.84m2.58-5.84a14.98 14.98 0 0 0-5.84 2.58m0 0A14.98 14.98 0 0 0 2.46 9.63"/></svg>',
        },
      ]
    },
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
        this.loadAccumulatedStats();
      } catch (err) {
        console.error(err);
        this.teamsError = true;
      } finally {
        this.teamsLoading = false;
      }
    },
    async loadAccumulatedStats() {
      if (this.teams.length === 0) {
        this.accumulatedStats = [];
        return;
      }

      this.statsLoading = true;
      this.statsError = false;

      try {
        const statsPromises = this.teams
          .filter(team => team.team_player_id)
          .map(async (team) => {
            const response = await playerStatisticsService.getPlayerAccumulatedStats(team.id, team.team_player_id);
            return {
              teamId: team.id,
              teamName: team.name,
              matches_count: response.data.matches_count ?? 0,
              totals: {
                goals_scored: response.data.totals?.goals_scored ?? 0,
                goals_conceded: response.data.totals?.goals_conceded ?? 0,
                assists: response.data.totals?.assists ?? 0,
                yellow_cards: response.data.totals?.yellow_cards ?? 0,
                red_cards: response.data.totals?.red_cards ?? 0,
                saves: response.data.totals?.saves ?? 0,
                fouls_committed: response.data.totals?.fouls_committed ?? 0,
                fouls_suffered: response.data.totals?.fouls_suffered ?? 0,
              },
            };
          });

        this.accumulatedStats = await Promise.all(statsPromises);
      } catch (err) {
        console.error(err);
        this.statsError = true;
      } finally {
        this.statsLoading = false;
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
