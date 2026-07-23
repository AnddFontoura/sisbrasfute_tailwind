<template>
  <system-layout>
    <main>
      <div class="rounded">
        <div class="grid grid-cols-2">
          <div class="">
            {{ matchInfo.home_team_name ?? 'Desconhecido' }}

            {{ matchInfo.home_score ?? '' }}
          </div>

          <div class="">
            {{ matchInfo.visitor_team_name ?? 'Desconhecido' }}

            {{ matchInfo.visitor_score ?? ''}}

          </div>

          <div
            class="col-span-2"
            v-if="matchInfo.has_penalties"
          >
            {{ matchInfo.home_penalty_score }} vs {{ matchInfo.visitor_penalty_score }}
          </div>

          <div
            class=""
          >
            {{ matchInfo.city_info?.name}} / {{ matchInfo.city_info?.state_info?.name}}
          </div>

          <div
            class=""
          >
            {{ matchInfo.schedule_br}}
          </div>

          <div
            class="col-span-2"
            v-html="matchInfo.location"
          >

          </div>

        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import Swal from "sweetalert2";

export default {
  name: "MatchesShow",
  components: {
    systemLayout,
  },
  data() {
    return {
      matchId: 0,
      matchInfo: {},
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    }
  },
  created() {
    this.matchId = this.$route.params.id
    this.getMatchInformation()
  },
  methods: {
    async getMatchInformation() {
      if (this.matchId !== 0) {
        this.loading = true;

        try {
          let response = await api.get("/matches/show/" + this.matchId);
          this.matchInfo = response.data

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
