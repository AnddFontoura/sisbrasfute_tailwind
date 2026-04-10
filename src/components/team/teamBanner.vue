<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue"
import CitySelect from "@/components/form/CitySelectComponent.vue"
import systemLayout from "@/components/layouts/systemLayout.vue";
import { MapIcon, MapPinIcon, CalendarIcon } from '@heroicons/vue/20/solid'

export default {
  name: "teamBanner",
  components: {
    CitySelect,
    StateSelect,
    systemLayout,
    MapIcon,
    MapPinIcon,
    CalendarIcon,
  },
  props: {
    teamInfoId: {
      default: null,
      type: Number
    }
  },
  data() {
    return {
      teamId: 0,
      team: {},
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    }
  },
  created() {
    this.teamId = this.$route.params.id ?? this.teamInfoId
    this.getTeamInformation()
  },
  methods: {
    async getTeamInformation() {
      if (this.teamId !== 0) {
        this.loading = true;

        try {
          let response = await api.get("/team/show/" + this.teamId);
          this.team = response.data

        } catch (err) {
          console.error(err);
          alert("Erro ao puxar lista do time");
        } finally {
          this.loading = false;
        }
      }
    }
  },
};

</script>

<template>

  <div class="rounded">
    <img class="h-32 w-full object-cover lg:h-48" :src="team.banner_url" alt="" />
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
        <div class="flex">
          <img class="size-24 rounded-full ring-4 ring-white sm:size-32 dark:ring-gray-900 dark:outline dark:-outline-offset-1 dark:outline-white/10" :src="team.logo_url" alt="" />
        </div>
        <div class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
          <div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
            <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ team.name }}</h1>
          </div>
        </div>
        <div class="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ team.name }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
