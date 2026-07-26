<template>
  <system-layout>
    <main>
      <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
        <div
          v-for="(team, key) in teams"
          class="
              mt-3
              max-w-xs
              rounded-xl
              shadow-lg
              overflow-hidden
              bg-white
              border
              border-orange-500
            "
        >
          <!-- Título -->
          <div
            class="
                text-white
                bg-orange-500
                text-center
                py-3
              "
          >
            <h2
              class="
                  text-xl
                  font-bold
                "
            >
              {{ team.name }}
            </h2>
          </div>

          <!-- Banner com grama -->
          <div
            class="
                h-20
                bg-cover
                bg-center
              "
            :style="{
                backgroundImage: `url(${team?.banner_url || fallbackImage})`
              }"
          >

          </div>

          <!-- Logo -->
          <div
            class="
                flex
                justify-center
                -mt-8
              "
          >
            <div
              class="
                  bg-white
                  p-2
                  rounded-lg
                  shadow-md
                  border
                  border-orange-500
                "
            >
              <img
                :src="team?.logo_url || fallbackImage"
                alt="Logo"
                class="
                    h-20
                    w-20
                    object-contain
                  "
              >
            </div>
          </div>

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
                {{ team.city_name ?? 'Desconhecido'}}
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
                {{ team.state_name ?? 'Desconhecido'}}
              </p>
            </div>
          </div>

          <!-- Botões -->
          <div
            class="px-4 pb-4 grid gap-2"
            :class="team.user_id === user.id ? 'grid-cols-2' : 'grid-cols-1'"
          >
            <orange-button
              v-if="team.user_id === user.id"
              :url="{ name: 'team-show', params: { id: team.id }}"
              text="Visualizar"
            >
            </orange-button>

            <orange-button
              v-if="team.user_id === user.id"
              :url="{ name: 'team-admin', params: { id: team.id }}"
              text="Administrar"
            >
            </orange-button>
          </div>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import {useAuthStore} from "@/stores/auth.js";
import Swal from "@/services/swal.js";
import OrangeButton from "@/components/button/OrangeButton.vue";

export default {
  name: "teamList",
  components: {
    systemLayout,
    OrangeButton,
  },
  data() {
    return {
      teams: [],
      payload: {},
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg'
    }
  },
  created() {
    this.auth = useAuthStore()
    this.getTeamsList()
  },
  computed: {
    user() {
      return this.auth.user
    }
  },
  methods: {
    async getTeamsList() {
      this.loading = true;
      try {
        let response = await api.get("/team", this.payload);
        this.teams = response.data

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
  },
};
</script>
