<template>
  <system-layout>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">

        <div class="col-span-2">
          <TeamsManagedByUserComponent v-model="this.form.teamId">
          </TeamsManagedByUserComponent>
        </div>

        <div class="mt-3 p-2 col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo de
            partida</label>
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

        <div
          class="grid col-span-2"
          v-if="!isTeamMatch()"
        >
          <div
            class="mt-3 p-2"
          >
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

          <div
            class="mt-3 p-2"
          >
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
                  focus:outline-orange-500
                  sm:text-sm/6
                  dark:bg-white/5
                  dark:text-white
                  dark:outline-white/10
                  dark:placeholder:text-gray-500
                  dark:focus:outline-orange-500
                "
            />
          </div>

          <div
            class="mt-3 p-2"
          >
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
                  focus:outline-orange-500
                  sm:text-sm/6
                  dark:bg-white/5
                  dark:text-white
                  dark:outline-white/10
                  dark:placeholder:text-gray-500
                  dark:focus:outline-orange-500
                "
            />
          </div>

          <div
            class="mt-3 p-2"
          >
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
                  focus:outline-orange-500
                  sm:text-sm/6
                  dark:bg-white/5
                  dark:text-white
                  dark:outline-white/10
                  dark:placeholder:text-gray-500
                  dark:focus:outline-orange-500
                "
            />
          </div>

          <div
            class="mt-3 p-2 col-span-2"
          >
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

          <div
            class="mt-3 p-2" v-if="form.hasPenalties"
          >
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
                  focus:outline-orange-500
                  sm:text-sm/6
                  dark:bg-white/5
                  dark:text-white
                  dark:outline-white/10
                  dark:placeholder:text-gray-500
                  dark:focus:outline-orange-500
                "
            />
          </div>

          <div
            class="mt-3 p-2"
            v-if="form.hasPenalties"
          >
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
                  focus:outline-orange-500
                  sm:text-sm/6
                  dark:bg-white/5
                  dark:text-white
                  dark:outline-white/10
                  dark:placeholder:text-gray-500
                  dark:focus:outline-orange-500
                "
            />
          </div>
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
                focus:outline-orange-500
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-orange-500
              "
          />
        </div>

        <!-- Descrição -->
        <div class="mt-3 col-span-2 p-2">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Descrição
          </label>

          <QuillEditor
            v-model:content="form.matchLocation"
            content-type="html"
            theme="snow"
            class="bg-white rounded border"
          />
        </div>

        <div class="mt-20 col-span-2 p-2">
          <label class="block text-sm font-semibold text-slate-900 dark:text-white">
            Indicar posições de jogadores?
          </label>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Ative essa opção para abrir a
            configuração detalhada da partida.</p>
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

        <div v-if="form.indicatePositions" class="mt-3 p-2 col-span-2">
          <div class="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Quantidade de jogadores</label>
              <input
                v-model.number="form.playersCount"
                type="number"
                min="1"
                max="30"
                class="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Quantidade de times
              </label>
              <input
                v-model.number="form.teamsCount"
                type="number"
                min="1"
                class="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          <div
            class="mt-3"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  Os campos abaixo usam o seletor de posições do sistema para definir quais
                  funções os jogadores podem ocupar.
                </p>
              </div>

              <button
                type="button"
                @click="addPosition"
                class="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    duration-200
                    bg-orange-500
                    hover:bg-orange-600
                    focus:outline-none
                    focus:ring-2
                    focus:ring-orange-300
                    focus:ring-offset-2
                  "
              >
                Adicionar posição
              </button>
            </div>
          </div>

          <div
            v-for="(position, index) in form.positions"
            :key="index"
            class="grid gap-3 md:grid-cols-[1.1fr_180px_auto] items-end"
          >
            <!-- Posição -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Posição
              </label>

              <div class="pt-2">
                <Multiselect
                  v-model="position.game_position_id"
                  mode="single"
                  :options="gamePositions"
                  track-by="name"
                  label="name"
                  value-prop="id"
                  :searchable="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                />
              </div>
            </div>

            <!-- Valor -->
            <div>
              <label
                class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
              >
                Valor em R$
              </label>

              <input
                v-model.number="position.price"
                type="number"
                min="0"
                step="0.5"
                placeholder="Valor em R$"
                class="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <!-- Botão -->
            <div>
              <button
                type="button"
                @click="removePosition(index)"
                class="
                  inline-flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-red-200
                  bg-red-500
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-red-600
                  dark:border-red-400/30
                  dark:bg-red-500/10
                  dark:text-red-200
                "
              >
                Remover #{{ index + 1 }}
              </button>
            </div>
          </div>
        </div>

        <div class="mt-20 col-span-2">
          <button
            type="submit"
            class="
              w-full
              inline-flex
              items-center
              justify-center
              rounded-xl
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              duration-200
              bg-orange-500
              hover:bg-orange-600
              focus:outline-none
              focus:ring-2
              focus:ring-orange-300
              focus:ring-offset-2
            "
          >
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
import {fetchGamePositions} from "@/services/gamePositionService.js";
import Swal from "@/services/swal.js";

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
        positions: [],
      },
      gamePositions: [],
      stateId: null,
      cityId: null,
      matchId: null,
      loading: false,
      isEditing: false,
      homeOrVisitor: [
        {name: 'Mandante', id: 'home'},
        {name: 'Visitante', id: 'visitor'}
      ],
      penalties: [
        {name: 'Sim', id: 1},
        {name: 'Não', id: 0}
      ],
      matchTypeOptions: [
        {name: 'Partida entre o time', id: 'team_match'},
        {name: 'Amistoso', id: 'friendly_match'},
        {name: 'Campeonato', id: 'championship_match'},
      ],
      positionToggleOptions: [
        {name: 'Sim', id: true},
        {name: 'Não', id: false},
      ],
    }
  },
  async mounted() {
    this.matchId = this.$route.params?.id || null
    this.form.teamId = this.$route.params?.teamId || null
    this.isEditing = !!this.matchId

    await this.loadGamePositions()

    if (this.isEditing) {
      await this.getMatchInfo()
    }
  },
  watch: {
    'form.playersCount'(newValue, oldValue) {
      // Só reseta posições se estiver criando (não editando com dados carregados)
      if (!this.isEditing || this.form.positions.length === 0) {
        this.form.positions = Array.from(
          {length: newValue},
          () => ({
            game_position_id: null,
            price: 0,
          })
        );
      }
    }
  },
  methods: {
    isTeamMatch() {
      return this.form.matchType === 'team_match'
    },
    isFriendlyMatch() {
      return this.form.matchType === 'friendly_match'
    },
    isChampionshipMatch() {
      return this.form.matchType === 'championship_match'
    },
    async loadGamePositions() {
      try {
        this.gamePositions = await fetchGamePositions(this.form.teamId)
      } catch (err) {
        console.error("Erro ao carregar posições:", err)
      }
    },
    async getMatchInfo() {
      if (!this.matchId) return

      this.loading = true
      try {
        const response = await api.get("/matches/show/" + this.matchId)
        const data = response.data

        this.form.teamId = data.team_id ?? data.created_by_team_id ?? this.form.teamId
        this.form.myTeamIs = data.my_team_is ?? data.home_away ?? null
        this.form.enemyTeamId = data.enemy_team_id ?? null
        this.form.enemyTeamName = data.enemy_team_name ?? data.visitor_team_name ?? null
        this.form.matchLocation = data.match_location ?? data.description ?? null
        this.form.myTeamScore = data.my_team_score ?? data.home_team_score ?? null
        this.form.enemyTeamScore = data.enemy_team_score ?? data.visitor_team_score ?? null
        this.form.hasPenalties = data.has_penalties ?? null
        this.form.enemyTeamPenaltyScore = data.enemy_team_penalty_score ?? null
        this.form.myTeamPenaltyScore = data.my_team_penalty_score ?? null
        this.form.matchSchedule = data.match_schedule ?? data.schedule ?? null
        this.form.playersCount = data.players_count ?? data.playersCount ?? 1
        this.form.teamsCount = data.teams_count ?? data.teamsCount ?? 1
        this.form.matchType = this.matchTypeOptions.find(
          (option) => option.id === (data.match_type ?? data.type)
        )?.id ?? null
        this.stateId = data.state_id ?? data.city_info?.state_id ?? null
        this.cityId = data.city_id ?? null

        // Carrega posições corretamente
        const positions = typeof data.positions === 'string'
          ? JSON.parse(data.positions)
          : data.positions

        if (Array.isArray(positions) && positions.length) {
          this.form.indicatePositions = true
          this.form.positions = positions.map((position) => ({
            game_position_id: position.game_position_id ?? position.id ?? null,
            price: Number(position.price ?? 0),
          }))
          this.form.playersCount = this.form.positions.length
        } else {
          this.form.indicatePositions = !!this.form.matchType && this.form.matchType !== 'team_match'
        }

      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar dados da partida',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
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

      // Inclui o ID da partida para o backend diferenciar criação/atualização
      if (this.matchId) {
        formData.append("matchId", this.matchId)
      }

      try {
        await api.post("/matches/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.isEditing ? 'Partida atualizada!' : 'Partida criada!',
          showConfirmButton: false,
          timer: 2000,
        })

        this.$router.push("/matches/list")
      } catch (err) {
        console.error(err)
        let data = err.response?.data
        let mensagens = ""

        if (data?.errors) {
          mensagens = Object.values(data.errors).flat().join("<br> <br>")
        } else if (data?.message) {
          mensagens = data.message
        } else {
          mensagens = "Erro inesperado ao salvar partida."
        }

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro encontrado!',
          html: mensagens,
          showConfirmButton: true,
        })
      } finally {
        this.loading = false
      }
    },
    addPosition() {
      this.form.positions.push({
        game_position_id: null,
        price: 0,
      });
      this.form.playersCount = this.form.positions.length
    },
    removePosition(index) {
      this.form.positions.splice(index, 1);
      this.form.playersCount = this.form.positions.length
    },
  },
}
</script>

<style scoped>

</style>
