<script>
import PlayerPositionSelect from "@/components/form/GamePositionSelect.vue";
import systemLayout from "@/components/layouts/systemLayout.vue";
import api from "@/services/api";
import Swal from "sweetalert2";

export default {
  name: "TeamPlayerRecruitamentForm",
  components: {
    PlayerPositionSelect,
    systemLayout,
  },
  data() {
    return {
      teamId: null,
      loading: false,
      form: {
        gamePositionIds: [],
      },
      searchingForPositions: [],
    };
  },
  created() {
    this.teamId = this.$route.params.teamId;
    this.searchingForPositions = this.teamPositionList();
  },
  methods: {
    async teamPositionList() {
        const response = await api.get(`/team-search-position/${this.teamId}/list`);
        this.searchingForPositions = response.data;
    },
    async handleSubmit() {
      this.loading = true;

      try {
        await api.post(`/team-search-position/${this.teamId}/save`, {
          game_position_id: this.form.gamePositionIds,
        });

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Posições salvas com sucesso!",
          showConfirmButton: false,
          timer: 2500,
        });

        this.$router.push({
          name: "team-players-form",
          params: {
            id: this.teamId,
          },
        });
      } catch (err) {
        let mensagens = "Não foi possível salvar as posições.";

        if (err.response?.data?.errors) {
          mensagens = Object.values(err.response.data.errors).flat().join("<br><br>");
        }

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro encontrado!",
          html: mensagens,
          showConfirmButton: true,
        });
      } finally {
        this.loading = false;
      }
    },
    async deletePosition(id)
    {
      this.loading = true;

      try {
        await api.delete(`/team-search-position/${this.teamId}/delete/${id}`);

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Posição deletada com sucesso!",
          showConfirmButton: false,
          timer: 2500,
        });

        await this.teamPositionList()

      } catch (err) {
        let mensagens = "Não foi possível salvar as posições.";

        if (err.response?.data?.errors) {
          mensagens = Object.values(err.response.data.errors).flat().join("<br><br>");
        }

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro encontrado!",
          html: mensagens,
          showConfirmButton: true,
        });
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<template>
  <system-layout>
    <div class="mx-auto">
      <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div class="mb-6">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            Posições para Recrutamento
          </h1>

          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Selecione uma ou mais posições que este time deseja recrutar.
          </p>
        </div>

        <form @submit.prevent="handleSubmit">
          <PlayerPositionSelect
            v-model="form.gamePositionIds"
            is-multiselect="multiple"
            :team-id="teamId"
          />

          <div class="mt-6 flex justify-end gap-3">
            <router-link
              :to="{ name: 'team-admin', params: { id: teamId } }"
              class="
                inline-flex
                items-center
                justify-center
                rounded-md
                border
                border-gray-300
                bg-white
                px-4
                py-2
                text-sm
                font-semibold
                text-gray-700
                shadow-sm
                hover:bg-gray-50
                dark:border-gray-600
                dark:bg-gray-700
                dark:text-gray-100
                dark:hover:bg-gray-600
              "
            >
              Cancelar
            </router-link>

            <button
              type="submit"
              class="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-md
                bg-indigo-600
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:bg-indigo-400
                disabled:opacity-80
              "
              :disabled="loading || form.gamePositionIds.length === 0"
            >
              <svg
                v-if="loading"
                class="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>

              <span>{{ loading ? "Salvando..." : "Salvar posições" }}</span>
            </button>
          </div>
        </form>
      </div>

      <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 mt-3">
          <table class="w-full overflow-hidden rounded-2xl border border-gray-200 shadow-md">
            <thead class="bg-black text-white">
            <tr>
              <th class="px-6 py-4 text-left font-semibold">
                Nome
              </th>

              <th class="px-6 py-4 text-center font-semibold">
                Ícone
              </th>

              <th class="px-6 py-4 text-center font-semibold">
                Ações
              </th>
            </tr>
            </thead>

            <tbody>
            <tr
              v-for="position in searchingForPositions"
              :key="position.id"
              class="border-b border-gray-200 odd:bg-white even:bg-gray-100 hover:bg-orange-50 transition-colors"
            >
              <td class="px-6 py-4">
                {{ position.game_position_info.name }}
              </td>

              <td
                class="px-6 py-4 text-center"
                v-html="position.game_position_info.icon"
              >
              </td>

              <td class="px-6 py-4 text-center">
                <button
                  class="
                    rounded-xl
                    bg-orange-500
                    px-5
                    py-2
                    font-semibold
                    text-white
                    shadow-md
                    transition-all
                    duration-200
                    hover:bg-orange-400
                    hover:shadow-lg
                    active:scale-95
                  "
                @click="deletePosition(position.id)"
              >
                Deletar
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </system-layout>
</template>

<style scoped>

</style>
