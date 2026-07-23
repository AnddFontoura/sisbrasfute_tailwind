<template>
  <system-layout>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Atualizar Perfil de Jogador</h1>

        <div class="relative">
          <div
            v-if="loading"
            class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-white/70 backdrop-blur-sm dark:bg-gray-900/60"
          >
            <svg
              class="h-10 w-10 animate-spin text-orange-500 dark:text-orange-400"
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

            <p class="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Salvando time...
            </p>
          </div>

        <player-position-select v-model="form.playerPositions" is-multiselect="multiple"></player-position-select>

        <modalities-select v-model="form.playerModalities" is-multiselect="multiple"></modalities-select>

        <StateSelectComponent
          v-model="this.stateId"
          label-name="Estado onde mora"
        >

        </StateSelectComponent>

        <city-select-component
          label-name="Cidade onde mora"
          :state-id="this.stateId"
          v-model="this.cityId"
        >

        </city-select-component>

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Foto de Apresentação
          </label>
          <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25">
            <div class="text-center">
              <!-- Imagem: preview, foto existente ou placeholder -->
              <div class="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <img
                  v-if="photoPreviewUrl"
                  :src="photoPreviewUrl"
                  alt="Foto do jogador"
                  class="h-full w-full object-cover"
                  @error="photoPreviewUrl = null; existingPhotoUrl = null"
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

              <!-- Nome do arquivo -->
              <p v-if="photoFileName" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {{ photoFileName }}
              </p>

              <!-- Input de upload -->
              <div class="mt-4 flex justify-center text-sm text-gray-600 dark:text-gray-400">
                <label
                  for="photo-upload"
                  class="relative cursor-pointer rounded-md font-semibold text-orange-500 hover:text-orange-500 dark:text-orange-400"
                  :class="{ 'pointer-events-none opacity-50': loading }"
                >
                  <span>Escolher arquivo</span>
                  <input
                    id="photo-upload"
                    type="file"
                    class="sr-only"
                    accept="image/png,image/jpeg,image/gif"
                    :disabled="loading"
                    @change="onPhotoChange"
                  />
                </label>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400">PNG, JPG, GIF até 10MB</p>

              <!-- Botão remover -->
              <button
                v-if="photoPreviewUrl || existingPhotoUrl"
                type="button"
                class="mt-2 text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
                :disabled="loading"
                @click="onRemovePhoto"
              >
                Remover foto
              </button>

              <!-- Erro inline -->
              <p v-if="photoError" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ photoError }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome do Jogador</label>
          <input
            v-model="form.playerName"
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

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Apelido do Jogador</label>
          <input
            v-model="form.playerNickName"
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

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Data de nascimento</label>
          <input
            v-model="form.playerBirthdate"
            type="date"
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

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Altura (Cm)</label>
          <input
            v-model="form.playerHeight"
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

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Peso (Kg)</label>
          <input
            v-model="form.playerWeight"
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

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tamanho da chuteira</label>
          <input
            v-model="form.playerFootSize"
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

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tamanho da luva</label>
          <input
            v-model="form.playerGloveSize"
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

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tamanho do Uniforme</label>
          <input
            v-model="form.playerUniformSize"
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

        <div class="mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Youtube</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-orange-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://youtube.com/</div>
                <input v-model="form.playerYoutube" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Facebook</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-orange-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://facebook.com/</div>
                <input v-model="form.playerFacebook" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">X (Antigo Twitter)</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-orange-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://x.com/</div>
                <input v-model="form.playerX" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Instagram</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-orange-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://www.instagram.com/</div>
                <input v-model="form.playerInstagram" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Tiktok</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-orange-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://tiktok.com/</div>
                <input v-model="form.playerTiktok" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Kwai</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-orange-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://www.kwai.com/</div>
                <input v-model="form.playerKwaii" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Goleiro de Aluguel</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-orange-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://goleiro.app/</div>
                <input v-model="form.playerGDA" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200" aria-label="statusSelect">Exibir na lista de jogadores ativos?</label>
          <Multiselect
            id="statusSelect"
            v-model="form.playerStatus"
            :options="this.status"
            track-by="name"
            label="name"
            :search="true"
            value-prop="id"
            :preselect-first="true"
          />
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-md
                bg-orange-500
                px-4
                py-2
                font-semibold
                text-white
                transition
                hover:bg-orange-600
                disabled:cursor-not-allowed
                disabled:bg-orange-400
                disabled:opacity-80
              "
            :disabled="this.loading"
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

            <span>{{ loading ? "Salvando..." : "Salvar dados do perfil" }}</span>
          </button>
        </div>
      </div>
      </div>
    </form>
  </system-layout>
</template>

<script>
import PlayerPositionSelect from "@/components/form/GamePositionSelect.vue";
import ModalitiesSelect from "@/components/form/ModalitiesSelect.vue";
import SystemLayout from "@/components/layouts/systemLayout.vue";
import CitySelectComponent from "@/components/form/CitySelectComponent.vue";
import StateSelectComponent from "@/components/form/StateSelectComponent.vue";
import api from "@/services/api.js";
import Multiselect from '@vueform/multiselect'
import Swal from "@/services/swal.js";

export default {
  name: "PlayerProfileForm",
  components: {
    SystemLayout,
    PlayerPositionSelect,
    ModalitiesSelect,
    CitySelectComponent,
    StateSelectComponent,
    Multiselect,
  },
  data() {
    return {
      form: {
        playerName: '',
        playerNickName: '',
        playerPositions: [],
        playerModalities: [],
        playerBirthdate: null,
        playerHeight: null,
        playerWeight: null,
        playerFootSize: null,
        playerGloveSize: null,
        playerUniformSize: null,
        photoFile: null,
        playerYoutube: null,
        playerTiktok: null,
        playerInstagram: null,
        playerX: null,
        playerKwaii: null,
        playerFacebook: null,
        playerGDA: null,
        playerStatus: null,
      },
      isGoalkeeper: null,
      stateId: null,
      cityId: null,
      status: [
        { name: 'Sim', id: 1 },
        { name: 'Não', id: 0}
      ],
      loading: false,
      photoPreviewUrl: null,
      photoFileName: null,
      photoError: null,
      removePhoto: false,
      existingPhotoUrl: null,
    }
  },
  mounted () {
    this.getPlayerProfileInfo()
  },
  methods: {
   async getPlayerProfileInfo()
    {
      try {
        let response = await api.get("/player-profile/show")
        let data = response.data
        let socialProfiles = data.social_profiles

        this.form.playerName = data.name ?? null
        this.form.playerNickName = data.nickname ?? null
        this.form.playerPositions = data.gamePositions ?? null
        this.form.playerModalities = data.modalities ?? null
        this.form.playerBirthdate = data.birthdate ?? null
        this.form.playerHeight = data.height ?? null
        this.form.playerWeight = data.weight ?? null
        this.form.playerFootSize = data.foot_size ?? null
        this.form.playerGloveSize = data.glove_size ?? null
        this.form.playerUniformSize = data.uniform_size ?? null
        this.form.playerStatus = data.status ?? null
        this.cityId = data.city_id ?? null
        this.form.playerYoutube = socialProfiles.youtube ?? null
        this.form.playerTiktok = socialProfiles.tiktok ?? null
        this.form.playerInstagram = socialProfiles.instagram ?? null
        this.form.playerX = socialProfiles.x  ?? null
        this.form.playerKwaii = socialProfiles.kwaii ?? null
        this.form.playerFacebook = socialProfiles.facebook ?? null
        this.form.playerGDA = socialProfiles.gda ?? null

        if (data.photo) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL
          this.existingPhotoUrl = `${baseUrl}/${data.photo}`
          this.photoPreviewUrl = this.existingPhotoUrl
        }

      } finally {
        this.loading = false;
      }
    },
    onPhotoChange(event) {
      const file = event.target.files[0]
      if (!file) return

      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']
      const maxSize = 10 * 1024 * 1024 // 10MB

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

      this.revokePreviewUrl()
      this.form.photoFile = file
      this.photoPreviewUrl = URL.createObjectURL(file)
      this.photoFileName = file.name
      this.photoError = null
      this.removePhoto = false
    },
    onRemovePhoto() {
      this.revokePreviewUrl()
      this.photoPreviewUrl = null
      this.form.photoFile = null
      this.photoFileName = null
      this.photoError = null
      this.removePhoto = true
    },
    revokePreviewUrl() {
      if (this.photoPreviewUrl && this.photoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.photoPreviewUrl)
      }
    },
    async handleSubmit() {
      this.loading = true

      const formData = new FormData()

      Object.entries(this.form).forEach(([key, value]) => {
        if (key === 'photoFile') return // Exclui do loop genérico

        if (Array.isArray(value)) {
          value.forEach(item => {
            formData.append(`${key}[]`, item)
          })
        } else {
          formData.append(key, value ?? '')
        }
      })

      formData.append('playerCityId', this.cityId ?? '')

      // Adição condicional da foto
      if (this.removePhoto) {
        formData.append('removePhoto', '1')
      } else if (this.form.photoFile) {
        formData.append('playerPhoto', this.form.photoFile)
      }

      try {
        await api.post('/player-profile/save', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.$router.push('/player-profile/form')
      } catch (err) {
        let data = err.response?.data
        let mensagens = ''

        if (data?.errors) {
          // Extrai erro específico da foto
          const photoErrorMsg = data.errors.playerPhoto?.[0] || data.errors.photo?.[0]
          if (photoErrorMsg) {
            this.photoError = photoErrorMsg
          }

          mensagens = Object.values(data.errors).flat().join('<br> <br>')
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
    }
  },
}
</script>

<style scoped>

</style>
