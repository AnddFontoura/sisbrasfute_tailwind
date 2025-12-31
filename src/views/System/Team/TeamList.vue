<template>
  <system-layout>
    <main>
      <div
        v-for="(team, key) in teams"
        class="
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
            {{ team.name }}
          </h2>
        </div>

        <!-- Banner com grama -->
        <div
          class="
            h-20
            bg-[url('https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg')]
            bg-cover
            bg-center
          "
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
              src="https://uploaddeimagens.com.br/images/004/849/793/full/logo.png"
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
          class="
            px-4
            pb-4
            flex
            gap-2
          "
        >
          <button
            class="
              flex-1
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-2
              rounded-lg
              text-sm
            "
          >
            Visualizar
          </button>
          <button
            class="
              flex-1
              bg-purple-600
              hover:bg-purple-700
              text-white
              py-2
              rounded-lg
              text-sm
            "
          >
            Administrar
          </button>
          <button
            class="
              flex-1
              bg-green-600
              hover:bg-green-700
              text-white
              py-2
              rounded-lg
              text-sm
            "
          >
            Jogador
          </button>
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

export default {
  name: "teamList",
  components: {CitySelect, StateSelect, systemLayout},

  data() {
    return {
      teams: {},
      payload: {}
    }
  },
  created() {
    this.getTeamsList()
  },
  methods: {
    async getTeamsList() {
      this.loading = true;
      try {
        let response = await api.get("/team", this.payload);
        this.teams = response.data

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
