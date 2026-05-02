<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      >
      </team-banner>

      <div class="mt-3 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
        <router-link
          :to="{ name: 'team-players-form', params: { teamId: this.teamId } }"
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
          <span> Recrutamento </span>
        </router-link>

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
          <span> Recrutas </span>
        </router-link>
      </div>

      <div class="flex flex-col gap-4 mt-6">
        <div
          v-for="(player, key) in players"
          :key="player.id ?? key"
          class="
            w-full
            rounded-xl
            border
            bg-white
            shadow-sm
            p-4
            flex
            items-center
            gap-4
          "
        >
          <!-- Foto -->
          <div
            class="
              flex-shrink-0
              w-20
              h-20
              rounded-xl
              overflow-hidden
              bg-gray-100
              border
            "
          >
            <img
              :src="player?.photo_url || fallbackImage"
              :alt="player.name"
              class="w-full h-full object-cover"
            >
          </div>

          <!-- Infos -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <h2 class="text-lg md:text-xl font-bold text-gray-900 truncate">
                  {{ player.name }}
                </h2>

                <p class="text-sm text-gray-500 truncate">
                  {{ player.nickname || 'Sem apelido' }}
                </p>

                <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                  <span>
                    <b>Idade:</b> {{ player.age ?? 'N/A' }}
                  </span>

                  <span>
                    <b>Posições:</b> {{ formatPositions(player) }}
                  </span>
                </div>
              </div>

              <div class="flex-shrink-0">
                <router-link
                  :to="{ name: 'player-profile-show', params: { id: player.id } }"
                  class="
                    inline-flex
                    justify-center
                    rounded-md
                    bg-orange-500
                    hover:bg-orange-600
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-black
                    shadow-sm
                    transition-colors
                  "
                >
                  Visualizar
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <pagination-component :pagination="pagination" @change="getTeamPlayerList"></pagination-component>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue"
import CitySelect from "@/components/form/CitySelectComponent.vue";
import systemLayout from "@/components/layouts/systemLayout.vue";
import { useAuthStore } from "@/stores/auth.js";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import TeamBanner from "@/components/team/teamBanner.vue";

export default {
  name: "TeamPlayerList",
  components: {
    TeamBanner,
    CitySelect,
    StateSelect,
    systemLayout,
    PaginationComponent
  },

  data() {
    return {
      players: [],
      payload: {},
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1
      },
      teamId: 0,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg'
    }
  },
  created() {
    this.auth = useAuthStore()
    this.teamId = this.$route.params.teamId ?? null
    this.getTeamPlayerList()
  },
  computed: {
    user() {
      return this.auth.user
    }
  },
  methods: {
    formatPositions(player) {
      if (Array.isArray(player.positions) && player.positions.length) {
        return player.positions.map((position) => position.name || position).join(', ')
      }

      return player.position_name || player.position || 'N/A'
    },

    async getTeamPlayerList(page = 1) {
      this.loading = true;

      if (this.teamId !== 0) {
        try {
          let response = await api.get("/team-player/" + this.teamId + "/list", this.payload);
          this.players = response.data.data
          this.pagination = response.data
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
