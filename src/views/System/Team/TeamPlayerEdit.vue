<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      />

      <div class="mt-6 mx-auto max-w-2xl">
        <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <!-- Loading state -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <svg
              class="h-8 w-8 animate-spin text-orange-500"
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
            <span class="ml-3 text-gray-600 dark:text-gray-300">Carregando...</span>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="py-12 text-center">
            <p class="text-red-500">{{ error }}</p>
            <button
              @click="loadData"
              class="mt-4 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Tentar novamente
            </button>
          </div>

          <!-- Form -->
          <div v-else>
            <div class="mb-6">
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                Editar Jogador
              </h1>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Gerencie as tags atribuídas a este jogador.
              </p>
            </div>

            <!-- Player info (read-only) -->
            <div class="mb-6 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Nome</label>
                  <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {{ player.name || '—' }}
                  </p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Apelido</label>
                  <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {{ player.nickname || 'Sem apelido' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Tags multiselect -->
            <form @submit.prevent="handleSubmit">
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Tags
                </label>
                <Multiselect
                  v-model="selectedTagIds"
                  :options="availableTags"
                  mode="tags"
                  :searchable="true"
                  track-by="name"
                  label="name"
                  value-prop="id"
                  placeholder="Selecione as tags do jogador"
                  :close-on-select="false"
                  class="mt-2"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Selecione uma ou mais tags para categorizar este jogador.
                </p>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3">
                <router-link
                  :to="{ name: 'team-players-list', params: { teamId: teamId } }"
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
                    bg-orange-500
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-orange-600
                    disabled:cursor-not-allowed
                    disabled:bg-orange-400
                    disabled:opacity-80
                  "
                  :disabled="saving"
                >
                  <svg
                    v-if="saving"
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
                  <span>{{ saving ? 'Salvando...' : 'Salvar' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import Multiselect from "@vueform/multiselect";
import api from "@/services/api.js";
import Swal from "@/services/swal.js";

export default {
  name: "TeamPlayerEdit",
  components: {
    systemLayout,
    TeamBanner,
    Multiselect,
  },
  data() {
    return {
      teamId: null,
      playerId: null,
      loading: false,
      saving: false,
      error: null,
      player: {},
      availableTags: [],
      selectedTagIds: [],
    };
  },
  created() {
    this.teamId = this.$route.params.teamId;
    this.playerId = this.$route.params.playerId;
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      this.error = null;

      try {
        const [playerResponse, tagsResponse] = await Promise.all([
          api.get(`/team-player/${this.teamId}/show/${this.playerId}`),
          api.get(`/team/${this.teamId}/tags`),
        ]);

        this.player = playerResponse.data;
        this.availableTags = tagsResponse.data;

        // Pre-select tags already assigned to the player
        if (this.player.tags && Array.isArray(this.player.tags)) {
          this.selectedTagIds = this.player.tags.map(tag => tag.id);
        }
      } catch (err) {
        console.error(err);
        this.error = "Erro ao carregar dados do jogador.";
      } finally {
        this.loading = false;
      }
    },

    async handleSubmit() {
      this.saving = true;

      try {
        await api.post(`/team-player/${this.teamId}/update/${this.playerId}`, {
          tag_ids: this.selectedTagIds,
        });

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Tags atualizadas com sucesso!",
          showConfirmButton: false,
          timer: 2500,
        });

        this.$router.push({
          name: "team-players-list",
          params: { teamId: this.teamId },
        });
      } catch (err) {
        console.error(err);

        let mensagem = "Não foi possível salvar as tags.";

        if (err.response?.data?.errors) {
          mensagem = Object.values(err.response.data.errors).flat().join("<br><br>");
        } else if (err.response?.data?.message) {
          mensagem = err.response.data.message;
        }

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao salvar!",
          html: mensagem,
          showConfirmButton: true,
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
