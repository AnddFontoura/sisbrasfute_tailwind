<template>
  <system-layout>
    <main>
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
              <div class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  class="
                    inline-flex
                    justify-center
                    rounded-md
                    bg-orange-500
                    hover:bg-orange-700
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-xs
                    dark:bg-white/10
                    dark:text-white
                    dark:shadow-none
                    dark:inset-ring-white/5
                    dark:hover:bg-white/20
                  "
                >
                  <span> Jogadores </span>
                </button>
                <button
                  type="button"
                  class="
                    inline-flex
                    justify-center
                    rounded-md
                    bg-purple-500
                    hover:bg-purple-700
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-xs
                    hover:bg-gray-50
                    dark:bg-white/10
                    dark:text-white
                    dark:shadow-none
                    dark:inset-ring-white/5
                    dark:hover:bg-white/20
                  "
                >
                  <span> Partidas </span>
                </button>
                <button
                  type="button"
                  class="
                    inline-flex
                    justify-center
                    rounded-md
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    bg-red-500
                    hover:bg-red-700
                    text-white
                    shadow-xs
                    hover:bg-gray-50
                    dark:bg-white/10
                    dark:text-white
                    dark:shadow-none
                    dark:inset-ring-white/5
                    dark:hover:bg-white/20
                  "
                >
                  <span> Financeiro </span>
                </button>
                <button
                  type="button"
                  class="
                    inline-flex
                    justify-center
                    rounded-md
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    bg-green-500
                    hover:bg-green-700
                    text-white
                    shadow-xs
                    hover:bg-gray-50
                    dark:bg-white/10
                    dark:text-white
                    dark:shadow-none
                    dark:inset-ring-white/5
                    dark:hover:bg-white/20
                  "
                >
                  <span> Editar </span>
                </button>
              </div>
            </div>
          </div>
          <div class="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
            <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ team.name }}</h1>
          </div>
        </div>
      </div>

    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue"
import CitySelect from "@/components/form/CitySelectComponent.vue"
import systemLayout from "@/components/layouts/systemLayout.vue";
import { MapIcon, MapPinIcon, CalendarIcon } from '@heroicons/vue/20/solid'

export default {
  name: "teamList",
  components: {
    CitySelect,
    StateSelect,
    systemLayout,
    MapIcon,
    MapPinIcon,
    CalendarIcon,
  },
  data() {
    return {
      teamId: 0,
      team: {},
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    }
  },
  created() {
    this.teamId = this.$route.params.id
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
