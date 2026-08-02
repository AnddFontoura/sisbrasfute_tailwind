<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      >

      </team-banner>

      <orange-button
        v-if="teamId"
        :url="{ name: 'team-matches-form', params: { teamId: this.teamId } }"
        text="Registrar nova partida"
        class="mt-3"
      >

      </orange-button>

      <!-- FILTROS -->
      <div class="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">
            Filtros
          </h2>

          <button
            @click="resetFilters"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Limpar filtros
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <!-- Nome do time -->
          <div class="lg:col-span-2 mt-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome do
              time</label>
            <input
              v-model="filters.team_name"
              type="text"
              placeholder="Ex: Flamengo"
              class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
               focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
          </div>

          <state-select v-model="filters.state_id"></state-select>

          <city-select :stateId="filters.state_id" v-model="filters.city_id"></city-select>

          <!-- Range -->
          <div class="lg:col-span-2 mt-3">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-200">Período</label>

            <div class="flex items-center gap-2 mt-1">
              <input
                v-model="filters.date_start"
                type="date"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              />

              <span class="text-gray-400 text-sm">até</span>

              <input
                v-model="filters.date_end"
                type="date"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 mt-5">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Limpar
          </button>

          <button
            @click="applyFilters"
            class="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white
             hover:bg-orange-600 shadow-sm"
          >
            Aplicar filtros
          </button>
        </div>
      </div>

      <div
        v-if="matches.data.length === 0"
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

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">

        <div
          v-for="(matchInformation, key) in matches.data"
          class="
              m-3
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
                {{ matchInformation.home_team_name }} <b> VS </b>
                {{ matchInformation.visitor_team_name }}
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
            <orange-button
              :url="{ name: 'matches-show', params: { id: matchInformation.id } }"
              text="Visualizar"
            >
            </orange-button>

            <orange-button
              @v-if="isSameTeam(matchInformation.created_by_team_id)"
              :url="{ name: 'matches-edit', params: { id: matchInformation.id } }"
              text="Editar"
            >
            </orange-button>

            <orange-button
              @v-if="isSameTeam(matchInformation.created_by_team_id)"
              :url="{ name: 'team-matches-manage', params: { teamId: matchInformation.created_by_team_id, matchId: matchInformation.id } }"
              text="Administrar"
            >
            </orange-button>
          </div>
        </div>
      </div>
    </main>

    <pagination-component :pagination="matches" @change="getMatchesList"></pagination-component>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue"
import CitySelect from "@/components/form/CitySelectComponent.vue"
import systemLayout from "@/components/layouts/systemLayout.vue";
import {useAuthStore} from "@/stores/auth.js";
import TeamBanner from "@/components/team/teamBanner.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import OrangeButton from "@/components/button/OrangeButton.vue";
import Swal from "@/services/swal.js";

export default {
  name: "MatchesList",
  components: {
    TeamBanner,
    CitySelect,
    StateSelect,
    systemLayout,
    PaginationComponent,
    OrangeButton,
  },
  data() {
    return {
      filters: {
        team_name: '',
        state_id: null,
        city_id: null,
        date: null,
        date_start: null,
        date_end: null
      },
      matches: {
        data: [],
        current_page: 1,
        last_page: 1
      },
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
    async getMatchesList(page = 1) {
      this.loading = true;

      try {
        const response = await api.get('/matches', {
          params: {
            page,
            team_id: this.teamId,
            // filtros
            team_name: this.filters.team_name,
            state_id: this.filters.state_id,
            city_id: this.filters.city_id,
            date: this.filters.date,
            date_start: this.filters.date_start,
            date_end: this.filters.date_end
          }
        });

        this.matches = response.data;

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
    },

    applyFilters() {
      this.getMatchesList(1)
    },

    resetFilters() {
      this.filters = {
        team_name: '',
        state_id: null,
        city_id: null,
        date: null,
        date_start: null,
        date_end: null
      }

      this.getMatchesList(1)
    },

    isSameTeam(createdByTeamId) {
      return createdByTeamId === this.teamId
    },
  },

};
</script>
