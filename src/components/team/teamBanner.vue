<script>
import api from "@/services/api";
import Swal from "@/services/swal.js";
import { useAuthStore } from "@/stores/auth.js";

export default {
  name: "teamBanner",
  props: {
    teamInfoId: {
      default: null,
      type: [Number, String],
    },
    teamData: {
      default: null,
      type: Object,
    },
    showNav: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      teamId: 0,
      team: {},
      loading: false,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    }
  },
  computed: {
    displayTeam() {
      return this.teamData || this.team
    },
    bannerUrl() {
      return this.displayTeam.banner_url || this.fallbackImage
    },
    logoUrl() {
      return this.displayTeam.logo_url || this.fallbackImage
    },
    teamName() {
      return this.displayTeam.name || ''
    },
    resolvedTeamId() {
      return this.teamId || this.teamInfoId || this.displayTeam.id
    },
    isOwner() {
      const auth = useAuthStore()
      const userId = auth.user?.id
      if (!userId) return false
      return this.displayTeam.user_id === userId
    },
    navItems() {
      const id = this.resolvedTeamId
      if (!id) return []

      return [
        { label: 'Jogadores', to: { name: 'team-players-list', params: { teamId: id } }, icon: 'users' },
        { label: 'Partidas', to: { name: 'team-matches-list', params: { teamId: id } }, icon: 'calendar' },
        { label: 'Financeiro', to: { name: 'team-finance-list', params: { teamId: id } }, icon: 'dollar' },
        { label: 'Editar', to: { name: 'team-edit', params: { id: id } }, icon: 'pencil' },
      ]
    },
  },
  created() {
    if (!this.teamData) {
      this.teamId = this.$route.params.id ?? this.$route.params.teamId ?? this.teamInfoId
      this.getTeamInformation()
    }
  },
  methods: {
    async getTeamInformation() {
      if (!this.teamId) return

      this.loading = true
      try {
        const response = await api.get("/team/show/" + this.teamId)
        this.team = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar dados do time',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },
    isActive(routeName) {
      return this.$route.name === routeName
    },
  },
};
</script>

<template>
  <div class="rounded-xl overflow-hidden">
    <!-- Banner image -->
    <div class="relative h-32 lg:h-48">
      <img
        class="h-full w-full object-cover"
        :src="bannerUrl"
        alt="Banner do time"
        @error="$event.target.src = fallbackImage"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>

    <!-- Info section -->
    <div class="relative bg-white dark:bg-gray-800 px-4 pb-4 sm:px-6 lg:px-8">
      <div class="-mt-12 sm:-mt-14 flex items-end gap-4 sm:gap-5">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <img
            class="h-20 w-20 rounded-xl border-4 border-white shadow-lg sm:h-24 sm:w-24 dark:border-gray-800"
            :src="logoUrl"
            alt="Logo do time"
            @error="$event.target.src = fallbackImage"
          />
        </div>

        <!-- Name -->
        <div class="min-w-0 pt-4 sm:pt-6">
          <h1 class="truncate text-xl font-black text-gray-900 sm:text-2xl dark:text-white">
            {{ teamName }}
          </h1>
        </div>
      </div>

      <!-- Navigation buttons (only for team owner) -->
      <nav v-if="showNav && isOwner && resolvedTeamId" class="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition"
          :class="isActive(item.to.name)
            ? 'bg-orange-500 text-white shadow-sm'
            : 'text-gray-600 hover:bg-orange-500/10 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400'"
        >
          <!-- Icons inline -->
          <svg v-if="item.icon === 'users'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <svg v-if="item.icon === 'calendar'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <svg v-if="item.icon === 'dollar'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-if="item.icon === 'pencil'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          {{ item.label }}
        </router-link>
      </nav>
    </div>
  </div>
</template>

<style scoped>
</style>
