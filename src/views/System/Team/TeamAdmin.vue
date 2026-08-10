<template>
  <system-layout>
    <main>
      <team-banner :team-data="team" />
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import Swal from "@/services/swal.js";

export default {
  name: "TeamAdmin",
  components: {
    TeamBanner,
    systemLayout,
  },
  data() {
    return {
      teamId: 0,
      team: {},
      loading: false,
    }
  },
  created() {
    this.teamId = this.$route.params.id
    this.getTeamInformation()
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
}
</script>
