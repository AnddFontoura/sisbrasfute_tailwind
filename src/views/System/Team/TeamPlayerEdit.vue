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
                Editar Jogador no Time
              </h1>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Edite as informações do jogador registradas neste time.
              </p>
            </div>

            <form @submit.prevent="handleSubmit">
              <!-- Section: Informações Pessoais -->
              <div class="mb-6">
                <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Informações Pessoais
                </h2>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome</label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="
                        mt-1
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
                      placeholder="Nome do jogador"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Apelido</label>
                    <input
                      v-model="form.nickname"
                      type="text"
                      class="
                        mt-1
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
                      placeholder="Apelido do jogador"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Data de Nascimento</label>
                    <input
                      v-model="form.birthdate"
                      type="date"
                      class="
                        mt-1
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
              </div>

              <!-- Section: Dados Físicos -->
              <div class="mb-6">
                <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Dados Físicos
                </h2>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Número da Camisa</label>
                    <input
                      v-model="form.number"
                      type="number"
                      class="
                        mt-1
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
                      placeholder="Ex: 10"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tamanho do Uniforme</label>
                    <select
                      v-model="form.uniform_size"
                      class="
                        mt-1
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
                        focus:outline-2
                        focus:-outline-offset-2
                        focus:outline-orange-500
                        sm:text-sm/6
                        dark:bg-white/5
                        dark:text-white
                        dark:outline-white/10
                        dark:focus:outline-orange-500
                      "
                    >
                      <option value="">Selecione</option>
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                      <option value="GG">GG</option>
                      <option value="XG">XG</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Altura (cm)</label>
                    <input
                      v-model="form.height"
                      type="number"
                      class="
                        mt-1
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
                      placeholder="Ex: 175"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Peso (kg)</label>
                    <input
                      v-model="form.weight"
                      type="number"
                      class="
                        mt-1
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
                      placeholder="Ex: 70"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tamanho do Pé</label>
                    <input
                      v-model="form.foot_size"
                      type="number"
                      class="
                        mt-1
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
                      placeholder="Ex: 42"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tamanho da Luva</label>
                    <input
                      v-model="form.glove_size"
                      type="text"
                      class="
                        mt-1
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
                      placeholder="Ex: 9"
                    />
                  </div>
                </div>
              </div>

              <!-- Section: Posição e Tags -->
              <div class="mb-6">
                <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Posição e Tags
                </h2>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Posição
                  </label>
                  <Multiselect
                    v-model="form.game_position_id"
                    :options="gamePositions"
                    mode="single"
                    :searchable="true"
                    track-by="name"
                    label="name"
                    value-prop="id"
                    placeholder="Selecione a posição"
                    class="mt-2"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Tags
                  </label>
                  <Multiselect
                    v-model="selectedTagIds"
                    :options="availableTags"
                    mode="tags"
                    :searchable="true"
                    :createOption="true"
                    :appendNewOption="false"
                    track-by="name"
                    label="name"
                    value-prop="id"
                    placeholder="Digite para buscar ou criar uma nova tag"
                    :close-on-select="false"
                    class="mt-2"
                    @tag="handleCreateTag"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Selecione tags existentes ou digite um novo nome para criar uma tag.
                  </p>
                </div>
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
      form: {
        name: null,
        nickname: null,
        birthdate: null,
        number: null,
        uniform_size: '',
        height: null,
        weight: null,
        foot_size: null,
        glove_size: null,
        game_position_id: null,
      },
      gamePositions: [],
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
        const [playerResponse, tagsResponse, positionsResponse] = await Promise.all([
          api.get(`/team-player/${this.teamId}/show/${this.playerId}`),
          api.get(`/team/${this.teamId}/tags`),
          api.get('/game-positions/list'),
        ]);

        this.player = playerResponse.data;
        this.availableTags = tagsResponse.data;
        this.gamePositions = positionsResponse.data?.gamePositions ?? positionsResponse.data ?? [];

        // Pre-populate form fields from player data
        this.form.name = this.player.name ?? null;
        this.form.nickname = this.player.nickname ?? null;
        this.form.birthdate = this.player.birthdate ?? null;
        this.form.number = this.player.number ?? null;
        this.form.uniform_size = this.player.uniform_size ?? '';
        this.form.height = this.player.height ?? null;
        this.form.weight = this.player.weight ?? null;
        this.form.foot_size = this.player.foot_size ?? null;
        this.form.glove_size = this.player.glove_size ?? null;
        this.form.game_position_id = this.player.game_position_id ?? null;

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

    async handleCreateTag(query) {
      const newTagName = typeof query === 'object' ? query.value : query;

      if (!newTagName || !newTagName.trim()) return;

      // Remove any raw string values that Multiselect may have auto-added to the model
      this.selectedTagIds = this.selectedTagIds.filter(id => typeof id === 'number' && Number.isInteger(id));

      try {
        const response = await api.post(`/team/${this.teamId}/tags`, {
          name: newTagName.trim(),
        });

        const newTag = response.data;

        // Add the new tag to the available options (only if not already there)
        if (!this.availableTags.some(t => t.id === newTag.id)) {
          this.availableTags.push(newTag);
        }

        // Select the newly created tag (only if not already selected)
        if (!this.selectedTagIds.includes(newTag.id)) {
          this.selectedTagIds.push(newTag.id);
        }

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Tag "${newTag.name}" criada!`,
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        console.error(err);

        const message = err.response?.data?.message || "Erro ao criar tag";

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },

    async handleSubmit() {
      this.saving = true;

      try {
        // Filter out any non-numeric values (safety measure for tags)
        const validTagIds = this.selectedTagIds.filter(id => Number.isInteger(id) || (typeof id === 'number'));

        await api.post(`/team-player/${this.teamId}/update/${this.playerId}`, {
          name: this.form.name,
          nickname: this.form.nickname,
          birthdate: this.form.birthdate,
          number: this.form.number,
          uniform_size: this.form.uniform_size,
          height: this.form.height,
          weight: this.form.weight,
          foot_size: this.form.foot_size,
          glove_size: this.form.glove_size,
          game_position_id: this.form.game_position_id,
          tag_ids: validTagIds,
        });

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Jogador atualizado com sucesso!",
          showConfirmButton: false,
          timer: 2500,
        });

        this.$router.push({
          name: "team-players-list",
          params: { teamId: this.teamId },
        });
      } catch (err) {
        console.error(err);

        let mensagem = "Não foi possível salvar os dados do jogador.";

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
