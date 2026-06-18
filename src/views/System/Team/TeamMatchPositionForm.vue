<template>
  <system-layout>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">        
        <div class="mt-20 p-2 col-span-2 rounded-xl ">
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

        <div v-if="form.indicatePositions" class="mt-3 p-2 col-span-2">
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
                    max="30"
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
                  class="grid items-end gap-3 md:grid-cols-[1.1fr_180px_auto]"
                >
                  <div class="pt-2">
                    <GamePositionSelect
                      v-model="position.selectedPositions"
                      is-multiselect="single"
                      :team-id="form.teamId"
                    />
                  </div>
                  <div class="">
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
        indicatePositions: false,
        playersCount: 1,
        teamsCount: 1,
        matchType: null,
        positions: [
          { name: '', price: 0, selectedPositions: [] },
        ],
      },
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
  },
  methods: {
   async getMatchInfo()
    {
      if (this.matchId) {
        try {
          let response = await api.get("/matches/show/" + this.matchId)
          let data = response.data

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
