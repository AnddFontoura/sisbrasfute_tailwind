<template>
  <system-layout>
    <form @submit.prevent="handleSubmit">
      <div class="mx-auto max-w-3xl space-y-6">

        <!-- Page Header -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Editar Partida' : 'Nova Partida' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Preencha as informações da partida abaixo.
          </p>
        </div>

        <!-- Section 1: Info Básica -->
        <div class="relative rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <!-- Loading overlay -->
          <div
            v-if="loading"
            class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm dark:bg-gray-900/60"
          >
            <svg class="h-10 w-10 animate-spin text-orange-500 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p class="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Carregando...</p>
          </div>

          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Informações Básicas</h2>

          <div class="space-y-4">
            <div>
              <TeamsManagedByUserComponent v-model="form.teamId" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo de partida</label>
              <Multiselect
                v-model="form.matchType"
                :options="matchTypeOptions"
                track-by="id"
                label="name"
                :search="true"
                value-prop="id"
                :preselect-first="true"
                class="mt-1"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StateSelectComponent v-model="stateId" label-name="Estado do jogo" />
              <city-select-component label-name="Cidade do jogo" :state-id="stateId" v-model="cityId" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Horário do jogo</label>
              <input
                v-model="form.matchSchedule"
                type="datetime-local"
                class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Placar (apenas para partidas que não são entre o time) -->
        <div v-if="!isTeamMatch()" class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Placar</h2>

          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Seu time é</label>
                <Multiselect
                  v-model="form.myTeamIs"
                  :options="homeOrVisitor"
                  track-by="name"
                  label="name"
                  :search="true"
                  value-prop="id"
                  :preselect-first="true"
                  class="mt-1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome do Time Adversário</label>
                <input
                  v-model="form.enemyTeamName"
                  type="text"
                  placeholder="Nome do adversário"
                  class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Placar do seu time</label>
                <input
                  v-model="form.myTeamScore"
                  type="number"
                  placeholder="0"
                  class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Placar Adversário</label>
                <input
                  v-model="form.enemyTeamScore"
                  type="number"
                  placeholder="0"
                  class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Decisão por pênaltis?</label>
              <Multiselect
                v-model="form.hasPenalties"
                :options="penalties"
                track-by="name"
                label="name"
                :search="true"
                value-prop="id"
                :preselect-first="true"
                class="mt-1"
              />
            </div>

            <div v-if="form.hasPenalties" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Pênaltis a favor</label>
                <input
                  v-model="form.myTeamPenaltyScore"
                  type="number"
                  placeholder="0"
                  class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Pênaltis contra</label>
                <input
                  v-model="form.enemyTeamPenaltyScore"
                  type="number"
                  placeholder="0"
                  class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Descrição -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Descrição</h2>
          <QuillEditor
            v-model:content="form.matchLocation"
            content-type="html"
            theme="snow"
            class="bg-white rounded border dark:bg-white/5"
          />
        </div>

        <!-- Section 4: Configuração de Posições -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Configuração de Posições</h2>

          <div class="space-y-4">
            <!-- Tag da partida -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tag da partida (opcional)</label>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Se uma tag for selecionada, apenas jogadores com essa tag poderão se inscrever.</p>
              <Multiselect
                v-model="form.tagId"
                :options="availableTags"
                mode="single"
                track-by="name"
                label="name"
                value-prop="id"
                :searchable="true"
                placeholder="Sem restrição de tag"
                :allow-empty="true"
                class="mt-2"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Indicar posições de jogadores?</label>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Ative essa opção para configurar quais posições estarão disponíveis na partida.</p>
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

            <div v-if="form.indicatePositions" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Quantidade de jogadores</label>
                  <input
                    v-model.number="form.playersCount"
                    type="number"
                    min="1"
                    max="30"
                    class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
                  />
                </div>
                <div v-if="isTeamMatch()">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Quantidade de times</label>
                  <input
                    v-model.number="form.teamsCount"
                    type="number"
                    min="2"
                    class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <!-- Posições list -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Defina as posições e valores para cada jogador na partida.
                  </p>
                  <button
                    type="button"
                    @click="addPosition"
                    class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
                  >
                    Adicionar posição
                  </button>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="(position, index) in form.positions"
                    :key="index"
                    class="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-3 items-end rounded-lg border border-gray-100 dark:border-gray-700 p-3"
                  >
                    <div>
                      <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Posição</label>
                      <Multiselect
                        v-model="position.game_position_id"
                        mode="single"
                        :options="gamePositions"
                        track-by="name"
                        label="name"
                        value-prop="id"
                        :searchable="true"
                        :close-on-select="true"
                        class="mt-1"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Valor (R$)</label>
                      <input
                        v-model.number="position.price"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="0,00"
                        class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        @click="removePosition(index)"
                        class="mt-1 inline-flex h-9 w-full items-center justify-center rounded-md border border-red-300 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:bg-orange-400 disabled:opacity-80"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Salvando...
            </span>
            <span v-else>{{ isEditing ? 'Atualizar partida' : 'Salvar partida' }}</span>
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
        tagId: null,
        positions: [],
      },
      gamePositions: [],
      availableTags: [],
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
    await this.loadAvailableTags()

    if (this.isEditing) {
      await this.getMatchInfo()
    } else if (this.$route.query?.repeatFrom) {
      await this.loadRepeatData(this.$route.query.repeatFrom)
    }
  },
  watch: {
    'form.playersCount'(newValue, oldValue) {
      if (!this.isEditing || this.form.positions.length === 0) {
        this.form.positions = Array.from(
          {length: newValue},
          () => ({
            game_position_id: null,
            price: 0,
          })
        );
      }
    },
    'form.matchType'(newValue) {
      if (newValue === 'team_match') {
        if (this.form.teamsCount < 2) this.form.teamsCount = 2
      } else {
        this.form.teamsCount = 1
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
    async loadAvailableTags() {
      if (!this.form.teamId) return
      try {
        const response = await api.get(`/team/${this.form.teamId}/tags`)
        this.availableTags = response.data ?? []
      } catch (err) {
        console.error("Erro ao carregar tags:", err)
      }
    },
    mapMatchTypeFromBackend(value) {
      // Backend returns integer enum values: 0=team_match, 1=friendly_match, 2=championship_match
      const map = { 0: 'team_match', 1: 'friendly_match', 2: 'championship_match' }
      return map[value] ?? null
    },
    mapMyTeamIsFromBackend(value) {
      // Backend returns integer enum values: 0=home, 1=visitor
      const map = { 0: 'home', 1: 'visitor' }
      return map[value] ?? null
    },
    formatScheduleForInput(schedule) {
      if (!schedule) return null
      // datetime-local expects "YYYY-MM-DDTHH:mm"
      const date = new Date(schedule)
      if (isNaN(date.getTime())) return null
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    },
    async getMatchInfo() {
      if (!this.matchId) return

      this.loading = true
      try {
        const response = await api.get("/matches/show/" + this.matchId)
        const data = response.data

        this.form.teamId = data.created_by_team_id ?? this.form.teamId
        this.form.myTeamIs = this.mapMyTeamIsFromBackend(data.my_team_is)
        this.form.enemyTeamId = data.enemy_team_id ?? null
        this.form.enemyTeamName = data.enemy_team_name ?? null
        this.form.matchLocation = data.location ?? null
        this.form.myTeamScore = data.my_team_score ?? null
        this.form.enemyTeamScore = data.enemy_team_score ?? null
        this.form.hasPenalties = data.has_penalties ?? null
        this.form.enemyTeamPenaltyScore = data.enemy_team_penalty_score ?? null
        this.form.myTeamPenaltyScore = data.my_team_penalty_score ?? null
        this.form.matchSchedule = this.formatScheduleForInput(data.schedule)
        this.form.playersCount = data.players_count ?? 1
        this.form.teamsCount = data.teams_count ?? 1
        this.form.matchType = this.mapMatchTypeFromBackend(data.match_type)
        this.form.tagId = data.tag_id ?? null
        this.stateId = data.city_info?.state_id ?? null
        this.cityId = data.city_id ?? null

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
    async loadRepeatData(sourceMatchId) {
      this.loading = true
      try {
        const response = await api.get("/matches/show/" + sourceMatchId)
        const data = response.data

        // Copy structural data (team, type, location, city)
        this.form.teamId = data.created_by_team_id ?? this.form.teamId
        this.form.myTeamIs = this.mapMyTeamIsFromBackend(data.my_team_is)
        this.form.enemyTeamId = data.enemy_team_id ?? null
        this.form.enemyTeamName = data.enemy_team_name ?? null
        this.form.matchLocation = data.location ?? null
        this.form.matchType = this.mapMatchTypeFromBackend(data.match_type)
        this.form.tagId = data.tag_id ?? null
        this.stateId = data.city_info?.state_id ?? null
        this.cityId = data.city_id ?? null
        this.form.teamsCount = data.teams_count ?? 1

        // Do NOT copy: scores, penalties, schedule (user sets new ones)
        this.form.myTeamScore = null
        this.form.enemyTeamScore = null
        this.form.hasPenalties = null
        this.form.myTeamPenaltyScore = null
        this.form.enemyTeamPenaltyScore = null
        this.form.matchSchedule = null

        // Copy positions structure (without players assigned)
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
        }

        // Reload tags for the team
        await this.loadAvailableTags()

      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar dados para repetição',
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

      if (this.matchId) {
        formData.append("matchId", this.matchId)
      }

      try {
        const url = this.matchId ? `/matches/save/${this.matchId}` : '/matches/save'
        await api.post(url, formData, {
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
