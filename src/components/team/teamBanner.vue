<script>
import api from "@/services/api";
import Swal from "sweetalert2";

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
  },
  created() {
    // Só busca na API se não receber dados via prop
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
    }
  },
};
</script>

<template>
  <div class="rounded">
    <img
      class="h-32 w-full object-cover lg:h-48"
      :src="bannerUrl"
      alt="Banner do time"
      @error="$event.target.src = fallbackImage"
    />
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
        <div class="flex">
          <img
            class="size-24 rounded-full ring-4 ring-white sm:size-32 dark:ring-gray-900 dark:outline dark:-outline-offset-1 dark:outline-white/10"
            :src="logoUrl"
            alt="Logo do time"
            @error="$event.target.src = fallbackImage"
          />
        </div>
        <div class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
          <div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
            <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ teamName }}</h1>
          </div>
        </div>
        <div class="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ teamName }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
