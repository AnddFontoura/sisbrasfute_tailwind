<template>
  <system-layout>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">

        <div class="col-span-2">
          <TeamsManagedByUserComponent v-model="this.form.teamId">
          </TeamsManagedByUserComponent>
        </div>

        <div class="mt-3 p-2">
          <label
            class="
              block
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-200
            "
            aria-label="statusSelect"
          >
            Seu time é mandante ou visitante?
          </label>

          <Multiselect
            id="statusSelect"
            v-model="form.myTeamIs"
            :options="this.homeOrVisitor"
            track-by="name"
            label="name"
            :search="true"
            value-prop="id"
            :preselect-first="true"
          />
        </div>

        <div class="mt-3 p-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nome do Time Adversário
          </label>
          <input
            v-model="form.enemyTeamName"
            type="text"
            class="
                block
                w-full
                rounded-md
                bg-white
                px-3
                py-1.5
                text-base
                text-gray-900
                outline-1
                -outline-offset-1
                outline-gray-300
                placeholder:text-gray-400
                focus:outline-2
                focus:-outline-offset-2
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
              "
          />
        </div>

        <div class="mt-3 p-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Placar do seu time
          </label>
          <input
            v-model="form.myTeamScore"
            type="number"
            class="
                block
                w-full
                rounded-md
                bg-white
                px-3
                py-1.5
                text-base
                text-gray-900
                outline-1
                -outline-offset-1
                outline-gray-300
                placeholder:text-gray-400
                focus:outline-2
                focus:-outline-offset-2
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
              "
          />
        </div>

        <div class="mt-3 p-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Placar Adversário
          </label>
          <input
            v-model="form.enemyTeamScore"
            type="number"
            class="
                block
                w-full
                rounded-md
                bg-white
                px-3
                py-1.5
                text-base
                text-gray-900
                outline-1
                -outline-offset-1
                outline-gray-300
                placeholder:text-gray-400
                focus:outline-2
                focus:-outline-offset-2
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
              "
          />
        </div>

        <div class="mt-3 p-2 col-span-2">
          <label
            class="
              block
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-200
            "
            aria-label="statusSelect"
          >
            Decisão por pênaltis?
          </label>

          <Multiselect
            id="statusSelect"
            v-model="form.hasPenalties"
            :options="this.penalties"
            track-by="name"
            label="name"
            :search="true"
            value-prop="id"
            :preselect-first="true"
          />
        </div>

        <div class="mt-3 p-2" v-if="form.hasPenalties">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Placares Penalidades a favor
          </label>
          <input
            v-model="form.myTeamPenaltyScore"
            type="number"
            class="
                block
                w-full
                rounded-md
                bg-white
                px-3
                py-1.5
                text-base
                text-gray-900
                outline-1
                -outline-offset-1
                outline-gray-300
                placeholder:text-gray-400
                focus:outline-2
                focus:-outline-offset-2
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
              "
          />
        </div>

        <div class="mt-3 p-2" v-if="form.hasPenalties">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Placar das penalidades contra
          </label>
          <input
            v-model="form.enemyTeamPenaltyScore"
            type="number"
            class="
                block
                w-full
                rounded-md
                bg-white
                px-3
                py-1.5
                text-base
                text-gray-900
                outline-1
                -outline-offset-1
                outline-gray-300
                placeholder:text-gray-400
                focus:outline-2
                focus:-outline-offset-2
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
              "
          />
        </div>

        <StateSelectComponent
          v-model="this.stateId"
          label-name="Estado onde acontecerá o jogo"
        >
        </StateSelectComponent>

        <city-select-component
          label-name="Cidade onde acontecerá o jogo"
          :state-id="this.stateId"
          v-model="this.cityId"
        >
        </city-select-component>

        <div class="mt-3 py-3 col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Horario do jogo
          </label>
          <input
            v-model="form.matchSchedule"
            type="datetime-local"
            class="
                block
                w-full
                rounded-md
                bg-white
                px-3
                py-1.5
                text-base
                text-gray-900
                outline-1
                -outline-offset-1
                outline-gray-300
                placeholder:text-gray-400
                focus:outline-2
                focus:-outline-offset-2
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
              "
          />
        </div>

        <!-- Descrição -->
        <div class="mt-3 col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Descrição</label>

          <QuillEditor
            v-model:content="form.matchLocation"
            content-type="html"
            theme="snow"
            class="bg-white rounded border"
          />
        </div>

        <div class="mt-20 col-span-2">
          <button type="submit" class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700">
            Salvar partida
          </button>
        </div>
      </div>
    </form>
  </system-layout>
</template>

<script>
import PlayerPositionSelect from "@/components/form/GamePositionSelect.vue";
import ModalitiesSelect from "@/components/form/ModalitiesSelect.vue";
import SystemLayout from "@/components/layouts/systemLayout.vue";
import CitySelectComponent from "@/components/form/CitySelectComponent.vue";
import StateSelectComponent from "@/components/form/StateSelectComponent.vue";
import TeamsManagedByUserComponent from "@/components/form/TeamsManagedByUserComponent.vue";
import api from "@/services/api.js";
import Multiselect from '@vueform/multiselect'
import {QuillEditor} from "@vueup/vue-quill";

export default {
  name: "MatchesForm",
  components: {
    SystemLayout,
    PlayerPositionSelect,
    ModalitiesSelect,
    CitySelectComponent,
    StateSelectComponent,
    TeamsManagedByUserComponent,
    Multiselect,
    QuillEditor,
  },
  data() {
    return {
      form: {
        teamId: null,
        myTeamIs: null,
        enemyTeamId: null,
        enemyTeamName: null,
        matchLocation: null,
        myTeamScore: null,
        enemyTeamScore: null,
        hasPenalties: null,
        enemyTeamPenaltyScore: null,
        myTeamPenaltyScore: null,
        matchSchedule: null,
      },
      stateId: null,
      cityId: null,
      matchId: null,
      isHomeTeam: null,
      homeOrVisitor: [
        { name: 'Mandante', id: 'home' },
        { name: 'Visitante', id: 'visitor' }
      ],
      penalties: [
        { name: 'Sim', id: 1 },
        { name: 'Não', id: 0 }
      ]
    }
  },
  mounted () {
    this.matchId = this.$route.params?.id
    this.getMatchInfo()
  },
  methods: {
   async getMatchInfo()
    {
      if (this.matchId) {
        try {
          let response = await api.get("/matches/show/" + this.matchId)
          let data = response.data

          this.form.myTeamIs = data.name ?? null
          this.form.enemyTeamId = data.nickname ?? null
          this.form.enemyTeamName = data.gamePositions ?? null
          this.form.matchLocation = data.modalities ?? null
          this.form.myTeamScore = data.birthdate ?? null
          this.form.enemyTeamScore = data.height ?? null
          this.form.hasPenalties = data.weight ?? null
          this.form.enemyTeamPenaltyScore = data.foot_size ?? null
          this.form.myTeamPenaltyScore = data.glove_size ?? null
          this.form.matchSchedule = data.uniform_size ?? null

        } catch (err) {
          console.error(err);
          alert("Erro ao puxar dados do jogador!");
        } finally {
          this.loading = false;
        }
      }
    },
    async handleSubmit() {
      this.loading = true

      const formData = new FormData()

      Object.entries(this.form).forEach(([key, value]) => {
          formData.append(key, value ?? "")
      })

      formData.append("cityId", this.cityId ?? "")

      try {
        await api.post("/matches/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        this.$router.push("/player-profile/form")
      } catch (err) {
        console.error(err)
        alert("Erro ao salvar jogador!")
      } finally {
        this.loading = false
      }
    }
    },
}
</script>

<style scoped>

</style>
