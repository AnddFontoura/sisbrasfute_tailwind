<template>
  <system-layout>
    <main>
      <team-banner/>

      <div class="mt-3 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
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
          @click="$router.push({ name: 'team-finance-list', params: { teamId: team.id } })"
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
            dark:bg-white/10
            dark:text-white
            dark:shadow-none
            dark:inset-ring-white/5
            dark:hover:bg-white/20
          "
        >
          <span> Financeiro </span>
        </button>
        <router-link
          :to="{ name: 'team-edit', params: { id: this.teamId } }"
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
            dark:bg-white/10
            dark:text-white
            dark:shadow-none
            dark:inset-ring-white/5
            dark:hover:bg-white/20
          "
        >
          <span> Editar </span>
        </router-link>
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
import TeamBanner from "@/components/team/teamBanner.vue";

export default {
  name: "teamList",
  components: {
    TeamBanner,
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
