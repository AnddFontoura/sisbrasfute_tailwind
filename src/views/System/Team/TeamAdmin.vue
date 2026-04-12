<template>
  <system-layout>
    <main>
      <team-banner/>

      <div class="mt-3 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
        <router-link
          :to="{ name: 'team-players-list', params: { teamId: this.teamId } }"
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
          "
        >
          <span> Jogadores </span>
        </router-link>

        <router-link
          :to="{ name: 'team-matches-list', params: { teamId: this.teamId } }"
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
          "
        >
          <span> Partidas </span>
        </router-link>

        <router-link
          :to="{ name: 'team-finance-list', params: { teamId: this.teamId } }"
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
          "
        >
          <span> Financeiro </span>
        </router-link>

        <router-link
          :to="{ name: 'team-edit', params: { id: this.teamId } }"
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
