<template>
  <system-layout>
    <!-- Team Banner -->
    <team-banner :team-info-id="teamId"></team-banner>

    <form @submit.prevent="handleSubmit">
      <div class="mx-auto max-w-3xl space-y-6 mt-6">

        <!-- Page Header -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Editar Movimentação' : 'Nova Movimentação Financeira' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Registre uma entrada ou saída financeira do time.
          </p>
        </div>

        <!-- Section 1: Info Principal -->
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
            <p class="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Salvando...</p>
          </div>

          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Dados da Movimentação</h2>

          <div class="space-y-4">
            <!-- Tipo (Crédito/Débito) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo</label>
              <Multiselect
                v-model="form.type"
                :options="typeOptions"
                track-by="id"
                label="name"
                value-prop="id"
                :preselect-first="true"
                class="mt-1"
              />
            </div>

            <!-- Valor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Valor (R$)</label>
              <input
                v-model.number="form.value"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
              />
            </div>

            <!-- Razão (creatable) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Razão da movimentação</label>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Selecione uma razão existente ou digite para criar uma nova.</p>
              <Multiselect
                v-model="form.reasonId"
                :options="reasons"
                track-by="id"
                label="name"
                value-prop="id"
                :searchable="true"
                :create-option="true"
                :on-create="handleReasonCreate"
                placeholder="Selecione ou digite uma nova razão..."
                class="mt-1"
              />
            </div>

            <!-- Descrição -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Descrição (opcional)</label>
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="Observação ou detalhes adicionais..."
                class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Section 2: Vinculação -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Vinculação (opcional)</h2>

          <div class="space-y-4">
            <!-- Partida -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Partida</label>
              <Multiselect
                v-model="form.matchId"
                :options="matches"
                track-by="id"
                label="display_name"
                value-prop="id"
                :searchable="true"
                placeholder="Selecione uma partida..."
                no-options-text="Nenhuma partida encontrada"
                class="mt-1"
              />
            </div>

            <!-- Jogador do time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Jogador</label>
              <Multiselect
                v-model="form.teamPlayerId"
                :options="players"
                track-by="id"
                label="display_name"
                value-prop="id"
                :searchable="true"
                placeholder="Selecione um jogador..."
                no-options-text="Nenhum jogador encontrado"
                class="mt-1"
              />
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
            <span v-else>{{ isEditing ? 'Atualizar' : 'Salvar movimentação' }}</span>
          </button>
        </div>

      </div>
    </form>
  </system-layout>
</template>

<script>
import SystemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import api from "@/services/api.js";
import Multiselect from '@vueform/multiselect';
import Swal from "@/services/swal.js";

export default {
  name: "TeamFinanceForm",
  components: {
    SystemLayout,
    TeamBanner,
    Multiselect,
  },
  data() {
    return {
      form: {
        matchId: null,
        teamPlayerId: null,
        description: null,
        value: null,
        type: 1,
        reasonId: null,
        reasonName: null,
      },
      teamId: null,
      financeId: null,
      isEditing: false,
      loading: false,
      matches: [],
      players: [],
      reasons: [],
      typeOptions: [
        { name: 'Crédito (entrada)', id: 1 },
        { name: 'Débito (saída)', id: 0 },
      ],
    }
  },
  async mounted() {
    this.teamId = this.$route.params.teamId
    this.financeId = this.$route.params.id || null
    this.isEditing = !!this.financeId

    // Pré-seleciona a partida se vier via query param
    if (this.$route.query.matchId) {
      this.form.matchId = Number(this.$route.query.matchId)
    }

    await Promise.all([
      this.loadMatches(),
      this.loadPlayers(),
      this.loadReasons(),
    ])

    if (this.isEditing) {
      await this.loadFinanceData()
    }
  },
  methods: {
    async loadMatches() {
      try {
        const response = await api.get('/matches', { params: { teamId: this.teamId } })
        const matchesData = response.data?.data || response.data || []
        this.matches = matchesData.map(m => ({
          ...m,
          display_name: `#${m.id} - ${m.my_team_name || 'Time'} vs ${m.enemy_team_name || 'Adversário'} (${m.schedule_br || 'Sem data'})`,
        }))
      } catch (err) {
        console.error("Erro ao carregar partidas:", err)
      }
    },

    async loadPlayers() {
      try {
        const response = await api.get(`/team-player/${this.teamId}/list`)
        const playersData = response.data?.data || response.data || []
        this.players = playersData.map(p => ({
          ...p,
          display_name: `${p.nickname || p.name || 'Jogador'} (#${p.number || '-'})`,
        }))
      } catch (err) {
        console.error("Erro ao carregar jogadores:", err)
      }
    },

    async loadReasons() {
      try {
        const response = await api.get(`/team/${this.teamId}/finance-reasons`)
        this.reasons = response.data || []
      } catch (err) {
        console.error("Erro ao carregar razões:", err)
      }
    },

    async loadFinanceData() {
      try {
        const response = await api.get(`/team-finance/${this.teamId}/show/${this.financeId}`)
        const data = response.data

        this.form.matchId = data.match_id ?? null
        this.form.teamPlayerId = data.team_player_id ?? null
        this.form.description = data.description ?? null
        this.form.value = data.value ?? null
        this.form.type = data.type ?? 1
        this.form.reasonId = data.reason_id ?? null
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar dados',
          showConfirmButton: false,
          timer: 3000,
        })
      }
    },

    handleReasonCreate(option) {
      // When user types a new reason that doesn't exist, store it as reasonName
      this.form.reasonName = option.value
      // Add it to the options as a temporary entry
      const newOption = { id: option.value, name: option.value }
      this.reasons.push(newOption)
      return newOption
    },

    async handleSubmit() {
      if (!this.form.value || this.form.value <= 0) {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Informe um valor válido',
          showConfirmButton: false,
          timer: 2500,
        })
        return
      }

      this.loading = true

      // Determine if reason is an existing ID or a new name
      const payload = {
        matchId: this.form.matchId || '',
        teamPlayerId: this.form.teamPlayerId || '',
        description: this.form.description || '',
        value: this.form.value,
        type: this.form.type,
      }

      // If reasonId is a string (new reason typed), send as reasonName
      if (this.form.reasonId && typeof this.form.reasonId === 'string') {
        payload.reasonName = this.form.reasonId
      } else if (this.form.reasonName) {
        payload.reasonName = this.form.reasonName
      } else if (this.form.reasonId) {
        payload.reasonId = this.form.reasonId
      }

      const url = this.isEditing
        ? `/team-finance/${this.teamId}/update/${this.financeId}`
        : `/team-finance/${this.teamId}/save`

      try {
        await api.post(url, payload)

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.isEditing ? 'Movimentação atualizada!' : 'Movimentação registrada!',
          showConfirmButton: false,
          timer: 2000,
        })

        this.$router.push({ name: 'team-finance-list', params: { teamId: this.teamId } })
      } catch (err) {
        console.error(err)
        let mensagens = 'Erro ao salvar movimentação.'

        const data = err.response?.data
        if (data?.errors) {
          mensagens = Object.values(data.errors).flat().join('<br><br>')
        } else if (data?.message) {
          mensagens = data.message
        }

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro!',
          html: mensagens,
          showConfirmButton: true,
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
</style>
