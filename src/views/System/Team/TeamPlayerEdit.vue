<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      />

      <div class="mt-6">
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
              <!-- Section: Foto do Jogador no Time -->
              <div class="mb-6">
                <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Foto do Jogador no Time
                </h2>
                <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
                  Esta foto é exclusiva para a apresentação do jogador neste time. Não altera a foto do perfil pessoal.
                </p>

                <div class="flex items-start gap-4">
                  <!-- Preview -->
                  <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
                    <img
                      v-if="photoPreviewUrl"
                      :src="photoPreviewUrl"
                      alt="Foto do jogador no time"
                      class="h-full w-full object-cover"
                      @error="photoPreviewUrl = null"
                    />
                    <svg
                      v-else
                      class="h-full w-full text-gray-300 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                    </svg>
                  </div>

                  <!-- Actions -->
                  <div class="flex flex-col gap-2">
                    <label
                      for="team-player-photo"
                      class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-500/20 dark:text-orange-400"
                      :class="{ 'pointer-events-none opacity-50': saving }"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      Escolher foto
                      <input
                        id="team-player-photo"
                        type="file"
                        class="sr-only"
                        accept="image/png,image/jpeg,image/gif"
                        :disabled="saving"
                        @change="onPhotoChange"
                      />
                    </label>

                    <button
                      v-if="photoPreviewUrl"
                      type="button"
                      class="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
                      :disabled="saving"
                      @click="onRemovePhoto"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Remover foto
                    </button>

                    <p v-if="photoFileName" class="text-xs text-gray-500">{{ photoFileName }}</p>
                    <p v-if="photoError" class="text-xs text-red-600">{{ photoError }}</p>
                    <p class="text-xs text-gray-400">PNG, JPG ou GIF até 10MB</p>
                  </div>
                </div>
              </div>

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
                      v-model.number="form.glove_size"
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
      photoFile: null,
      photoPreviewUrl: null,
      photoFileName: null,
      photoError: null,
      removePhoto: false,
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

        // Carregar foto do jogador no time (se existir)
        const teamPhoto = this.player.team_photo_url || this.player.team_photo
        if (teamPhoto) {
          if (teamPhoto.startsWith('http')) {
            this.photoPreviewUrl = teamPhoto
          } else {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
            const storageBase = baseUrl.replace(/\/api\/?$/, '')
            this.photoPreviewUrl = `${storageBase}/storage/${teamPhoto}`
          }
        }
      } catch (err) {
        console.error(err);
        this.error = "Erro ao carregar dados do jogador.";
      } finally {
        this.loading = false;
      }
    },

    onPhotoChange(event) {
      const file = event.target.files[0]
      if (!file) return

      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']
      const maxSize = 10 * 1024 * 1024

      if (file.size > maxSize) {
        this.photoError = 'O arquivo excede o tamanho máximo de 10MB.'
        event.target.value = ''
        return
      }

      if (!allowedTypes.includes(file.type)) {
        this.photoError = 'Formato não permitido. Use PNG, JPG ou GIF.'
        event.target.value = ''
        return
      }

      // Revoga URL anterior se era blob
      if (this.photoPreviewUrl && this.photoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.photoPreviewUrl)
      }

      this.photoFile = file
      this.photoPreviewUrl = URL.createObjectURL(file)
      this.photoFileName = file.name
      this.photoError = null
      this.removePhoto = false
    },

    onRemovePhoto() {
      if (this.photoPreviewUrl && this.photoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.photoPreviewUrl)
      }
      this.photoPreviewUrl = null
      this.photoFile = null
      this.photoFileName = null
      this.photoError = null
      this.removePhoto = true
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

        const formData = new FormData()

        // Campos do formulário
        if (this.form.name) formData.append('name', this.form.name)
        if (this.form.nickname) formData.append('nickname', this.form.nickname)
        if (this.form.birthdate) formData.append('birthdate', this.form.birthdate)
        if (this.form.number) formData.append('number', this.form.number)
        if (this.form.uniform_size) formData.append('uniform_size', this.form.uniform_size)
        if (this.form.height) formData.append('height', this.form.height)
        if (this.form.weight) formData.append('weight', this.form.weight)
        if (this.form.foot_size) formData.append('foot_size', this.form.foot_size)
        if (this.form.glove_size) formData.append('glove_size', this.form.glove_size)
        if (this.form.game_position_id) formData.append('game_position_id', this.form.game_position_id)

        // Tags
        validTagIds.forEach(id => formData.append('tag_ids[]', id))

        // Foto — armazenada em player_team_profile/
        if (this.removePhoto) {
          formData.append('removeTeamPhoto', '1')
        } else if (this.photoFile) {
          formData.append('teamPlayerPhoto', this.photoFile)
        }

        await api.post(`/team-player/${this.teamId}/update/${this.playerId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
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
          // Verifica erro específico da foto
          const photoErr = err.response.data.errors.teamPlayerPhoto?.[0]
          if (photoErr) {
            this.photoError = photoErr
          }

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
