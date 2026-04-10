<template>
  <system-layout>
    <team-banner :team-info-id="teamId"></team-banner>
    <main class="p-4">
      <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="border-b border-gray-200 px-4 py-4 dark:border-gray-700">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            Financeiro do Time
          </h1>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Jogo</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Jogador</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Descrição</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Valor</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Tipo</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Origem</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              <tr v-for="finance in finances" :key="finance.id || finance.match_id + '-' + finance.team_player_id">
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <button
                    type="button"
                    class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    @click="$router.push({ name: 'matches-show', params: { id: finance.match_id } })"
                  >
                    Ver jogo #{{ finance.match_id }}
                  </button>
                </td>

                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <button
                    type="button"
                    class="rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
                    :title="finance.player_name || finance.team_player_name || 'Jogador'"
                    @click="$router.push({ name: 'player-profile-show', params: { id: finance.team_player_id } })"
                  >
                    Perfil #{{ finance.team_player_id }}
                  </button>
                </td>

                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span
                    class="inline-block max-w-[320px] truncate rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-700"
                    :title="finance.description || ''"
                  >
                    {{ finance.description || "-" }}
                  </span>
                </td>

                <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(finance.value) }}
                </td>

                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span
                    class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                    :class="Number(finance.type) === 1
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'"
                  >
                    {{ Number(finance.type) === 1 ? "Crédito" : "Débito" }}
                  </span>
                </td>

                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {{ formatOrigin(finance.origin) }}
                </td>
              </tr>

              <tr v-if="!finances.length">
                <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Nenhum lançamento financeiro encontrado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import {useAuthStore} from "@/stores/auth.js";
import TeamBanner from "@/components/team/teamBanner.vue";

export default {
  name: "FinancesList",
  components: {
    TeamBanner,
    systemLayout
  },

  data() {
    return {
      teamId: null,
      finances: [],
      payload: {},
      loading: false,
      auth: null,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg'
    }
  },

  created() {
    this.teamId = this.$route.params.teamId
    this.auth = useAuthStore()
    this.getFinancesList()
  },

  computed: {
    user() {
      return this.auth.user
    }
  },

  methods: {
    formatCurrency(value) {
      const number = Number(value || 0)

      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(number)
    },

    formatOrigin(origin) {
      const map = {
        campo: 'Campo',
        arbitro: 'Árbitro',
        bola: 'Bola',
        mensalidade: 'Mensalidade',
        outros: 'Outros',
      }

      return map[String(origin).toLowerCase()] || origin || '-'
    },

    async getFinancesList() {
      if (this.teamId) {
        this.loading = true
        try {
          let response = await api.get("/team-finance/" + this.teamId, this.payload)
          this.finances = response.data
        } catch (err) {
          alert("Erro ao puxar lista do time")
        } finally {
          this.loading = false
        }
      }
    }
  },
};
</script>
