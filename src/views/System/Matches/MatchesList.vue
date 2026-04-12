<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      >

      </team-banner>

      <div
        v-if="matches.length === 0"
        class="
            mt-6
            rounded-lg
            border
            border-amber-200
            bg-amber-50
            px-4
            py-3
            text-amber-800
            shadow-sm
          "
      >
        <p class="text-sm font-medium">
          Não há partidas registradas.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div
          v-for="(matchInformation, key) in matches"
          class="
              mt-3
              max-w-xs
              rounded-xl
              shadow-lg
              overflow-hidden
              bg-white border
            "
        >
          <!-- Infos -->
          <div
            class="
                px-4
                py-4
                grid
                grid-cols-2
                text-center
              "
          >

            <div class="col-span-2 mb-3">
              <p
                class="
                    text-sm
                    text-gray-900
                  "
              >
                {{ matchInformation.home_team_name }} <b> VS </b> {{ matchInformation.visitor_team_name}}
              </p>

              <p> {{ matchInformation.schedule_br }}</p>
            </div>

            <div>
              <p
                class="
                    font-semibold
                    text-gray-700
                  "
              >
                Cidade
              </p>
              <p
                class="
                    text-sm
                    text-gray-900
                  "
              >
                {{ matchInformation.city_info?.name ?? 'Desconhecido' }}
              </p>
            </div>
            <div>
              <p
                class="
                    font-semibold
                    text-gray-700
                  "
              >
                Estado
              </p>
              <p
                class="
                    text-sm
                    text-gray-900
                  "
              >

                {{ matchInformation.city_info?.state_info?.name ?? 'Desconhecido' }}
              </p>
            </div>
          </div>

          <!-- Botões -->
          <div
            class="px-4 pb-4 grid gap-2 grid-cols-1"
          >
            <button
              @click="$router.push({ name: 'matches-show', params: { id: matchInformation.id } })"
              class="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg text-sm"
            >
              Visualizar
            </button>
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
import {useAuthStore} from "@/stores/auth.js";
import TeamBanner from "@/components/team/teamBanner.vue";

export default {
  name: "MatchesList",
  components: {
    TeamBanner,
    CitySelect,
    StateSelect,
    systemLayout
  },
  data() {
    return {
      matches: [],
      payload: {},
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      teamId: null,
    }
  },
  created() {
    this.teamId = this.$route.params.teamId ?? null
    this.auth = useAuthStore()
    this.getMatchesList()
  },
  computed: {
    user() {
      return this.auth.user
    }
  },
  methods: {
    async getMatchesList() {
      this.loading = true;

      this.payload.team_id = this.teamId

      try {
        let response = await api.get("/matches", this.payload);
        this.matches = response.data
        console.log(this.matches)
      } catch (err) {
        console.error(err);
        alert("Erro ao puxar lista do time");
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>
