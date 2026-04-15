<template>
  <system-layout>
    <main>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(player, key) in players"
          class="
              mt-3
              max-w-xs
              rounded-xl
              shadow-lg
              overflow-hidden
              bg-white border
            "
        >
          <!-- Título -->
          <div
            class="
                bg-green-200
                text-center
                py-3
              "
          >
            <h2
              class="
                  text-xl
                  font-bold
                  text-gray-800
                "
            >
              {{ player.name }}
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
                backgroundImage: `url(${player?.banner_url || fallbackImage})`
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
                "
            >
              <img
                :src="player?.photo_url || fallbackImage"
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
                CURITIBA
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
                PARANÁ
              </p>
            </div>
          </div>

          <!-- Botões -->
          <div
            class="px-4 pb-4 grid gap-2 grid-cols-1"
          >
            <router-link
              :to="{ name: 'player-profile-show', params: { id: player.id } }"
              class="
                inline-flex
                justify-center
                rounded-md
                bg-blue-500
                hover:bg-blue-700
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
              Visualizar
            </router-link>
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

export default {
  name: "playerProfileList",
  components: {CitySelect, StateSelect, systemLayout},

  data() {
    return {
      players: [],
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
        let response = await api.get("/player-profile", this.payload);
        this.players = response.data.data
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
