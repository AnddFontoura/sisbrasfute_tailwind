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

        <div class="p-2">
          <StateSelectComponent
            v-model="this.stateId"
            label-name="Estado onde acontecerá o jogo"
          >
          </StateSelectComponent>
        </div>

        <div class="p-2">
          <city-select-component
            label-name="Cidade onde acontecerá o jogo"
            :state-id="this.stateId"
            v-model="this.cityId"
          >
          </city-select-component>
        </div>

        <div class="mt-3 col-span-2 p-2">
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
        <div class="mt-3 col-span-2 p-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Descrição</label>

          <QuillEditor
            v-model:content="form.matchLocation"
            content-type="html"
            theme="snow"
            class="bg-white rounded border"
          />
        </div>
        
        <div class="mt-20 p-2 col-span-2 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
          <label class="block text-sm font-semibold text-slate-900 dark:text-white">Indicar posições de jogadores?</label>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Ative essa opção para abrir a configuração detalhada da partida.</p>
          <Multiselect
            v-model="form.indicatePositions"
            :options="positionToggleOptions"
            track-by="id"
            label="name"
            :search="true"
            value-prop="id"
            :preselect-first="true"
            class="mt-2"
          />
        </div>

        <div v-if="form.indicatePositions" class="mt-3 p-2 col-span-2 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Configuração da partida</h3>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Etapa 1: defina a quantidade de jogadores, times e o tipo de partida. Etapa 2: escolha as posições disponíveis e o valor por vaga.</p>
            </div>
          </div>

          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 md:col-span-2">
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white">Etapa 1 — Quantidade de jogadores e times</h4>
              <div class="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Quantidade de jogadores</label>
                  <input
                    v-model.number="form.playersCount"
                    type="number"
                    min="1"
                    class="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Quantidade de times</label>
                  <input
                    v-model.number="form.teamsCount"
                    type="number"
                    min="1"
                    class="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo de partida</label>
                  <Multiselect
                    v-model="form.matchType"
                    :options="matchTypeOptions"
                    track-by="id"
                    label="name"
                    :search="true"
                    value-prop="id"
                    :preselect-first="true"
                    class="mt-2"
                  />
                </div>
              </div>
            </div>

            <div class="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h4 class="text-sm font-semibold text-slate-900 dark:text-white">Etapa 2 — Posições disponíveis e valor por vaga</h4>
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Os campos abaixo usam o seletor de posições do sistema para definir quais funções os jogadores podem ocupar.</p>
                </div>
                <button
                  type="button"
                  @click="addPosition"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Adicionar posição
                </button>
              </div>

              <div class="mt-3 space-y-3">
                <div
                  v-for="(position, index) in form.positions"
                  :key="index"
                  class="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5 md:grid-cols-[1.1fr_180px_auto]"
                >
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Posição</label>
                    <GamePositionSelect
                      v-model="position.selectedPositions"
                      is-multiselect="multiple"
                      :team-id="form.teamId"
                    />
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Selecionadas: {{ position.name || 'Nenhuma' }}</p>
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Valor em R$</label>
                    <input
                      v-model.number="position.price"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Valor em R$"
                      class="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    @click="removePosition(index)"
                    class="inline-flex h-fit items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
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
import GamePositionSelect from "@/components/form/GamePositionSelect.vue";
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
    GamePositionSelect,
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
        indicatePositions: false,
        playersCount: 1,
        teamsCount: 1,
        matchType: null,
        positions: [
          { name: 'Atacante', price: 0, selectedPositions: [] },
          { name: 'Meio', price: 0, selectedPositions: [] },
          { name: 'Zagueiro', price: 0, selectedPositions: [] },
          { name: 'Goleiro', price: 0, selectedPositions: [] },
        ],
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
      ],
      matchTypeOptions: [
        { name: 'Partida entre o time', id: 'team_match' },
        { name: 'Amistoso', id: 'friendly' },
      ],
      positionToggleOptions: [
        { name: 'Sim', id: true },
        { name: 'Não', id: false },
      ]
    }
  },
  mounted () {
    this.matchId = this.$route.params?.id
    this.syncPositionRows()
    this.getMatchInfo()
  },
  watch: {
    'form.playersCount': {
      handler(value) {
        this.form.playersCount = Math.max(1, Number(value) || 1)
        this.syncPositionRows()
      },
      immediate: true,
    },
    'form.positions': {
      deep: true,
      handler() {
        this.form.positions.forEach((position) => {
          if (!Array.isArray(position.selectedPositions)) {
            position.selectedPositions = []
          }

          position.name = (position.selectedPositions || [])
            .map((item) => item?.name || item)
            .filter(Boolean)
            .join(', ')
        })
      },
      immediate: true,
    },
  },
  methods: {
    syncPositionRows() {
      const desiredCount = Math.max(1, Number(this.form.playersCount) || 1)

      while (this.form.positions.length < desiredCount) {
        this.form.positions.push({ name: '', price: 0, selectedPositions: [] })
      }

      while (this.form.positions.length > desiredCount) {
        this.form.positions.pop()
      }
    },
    addPosition() {
      this.form.positions.push({ name: '', price: 0, selectedPositions: [] })
    },
    removePosition(index) {
      if (this.form.positions.length > 1) {
        this.form.positions.splice(index, 1)
      }
    },
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
          this.form.playersCount = data.playersCount ?? 1
          this.form.teamsCount = data.teamsCount ?? 1
          this.form.matchType = this.matchTypeOptions.find((option) => option.id === (data.matchType || data.type))?.id ?? null
          this.form.indicatePositions = Boolean(data.positions?.length || data.matchType || data.type)

          const positions = typeof data.positions === 'string' ? JSON.parse(data.positions) : data.positions
          if (Array.isArray(positions) && positions.length) {
            this.form.positions = positions.map((position) => ({
              name: position.name || position,
              price: Number(position.price ?? 0),
              selectedPositions: Array.isArray(position.selectedPositions)
                ? position.selectedPositions
                : (typeof position.name === 'string' ? [{ name: position.name }] : [])
            }))
          }

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
        if (key === 'positions') {
          formData.append('positions', JSON.stringify(value ?? []))
          return
        }

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
