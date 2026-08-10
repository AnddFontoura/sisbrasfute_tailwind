<template>
  <system-layout>
    <form @submit.prevent="handleSubmit">
      <div class="mx-auto max-w-3xl space-y-6">

        <!-- Page Header -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Atualize suas informações pessoais e preferências de jogador.</p>
        </div>

        <!-- Section 1: Photo -->
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

          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Foto de Perfil</h2>
          <div class="flex flex-col items-center">
            <div class="h-28 w-28 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 ring-4 ring-gray-200 dark:ring-gray-600">
              <img v-if="photoPreviewUrl" :src="photoPreviewUrl" alt="Foto" class="h-full w-full object-cover" @error="photoPreviewUrl = null; existingPhotoUrl = null" />
              <svg v-else class="h-full w-full text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
              </svg>
            </div>
            <p v-if="photoFileName" class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ photoFileName }}</p>
            <div class="mt-3 flex gap-3">
              <label for="photo-upload" class="cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors" :class="{ 'pointer-events-none opacity-50': loading }">
                <span>Escolher foto</span>
                <input id="photo-upload" type="file" class="sr-only" accept="image/png,image/jpeg,image/gif" :disabled="loading" @change="onPhotoChange" />
              </label>
              <button v-if="photoPreviewUrl || existingPhotoUrl" type="button" class="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors" :disabled="loading" @click="onRemovePhoto">
                Remover
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF até 10MB</p>
            <p v-if="photoError" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ photoError }}</p>
          </div>
        </div>

        <!-- Section 2: Personal Info -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Informações Pessoais</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome</label>
              <input v-model="form.playerName" type="text" placeholder="Seu nome completo" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Apelido</label>
              <input v-model="form.playerNickName" type="text" placeholder="Como te chamam em campo" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Data de Nascimento</label>
              <input v-model="form.playerBirthdate" type="date" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Exibir perfil?</label>
              <Multiselect id="statusSelect" v-model="form.playerStatus" :options="this.status" track-by="name" label="name" :search="true" value-prop="id" :preselect-first="true" class="mt-1" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <player-position-select v-model="form.playerPositions" is-multiselect="multiple"></player-position-select>
            </div>
            <div>
              <modalities-select v-model="form.playerModalities" is-multiselect="multiple"></modalities-select>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <StateSelectComponent v-model="this.stateId" label-name="Estado onde mora" />
            <city-select-component label-name="Cidade onde mora" :state-id="this.stateId" v-model="this.cityId" />
          </div>
        </div>

        <!-- Section 3: Physical Data -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Dados Físicos</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Altura (cm)</label>
              <input v-model.number="form.playerHeight" type="number" placeholder="175" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Peso (kg)</label>
              <input v-model.number="form.playerWeight" type="number" placeholder="70" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Uniforme</label>
              <input v-model="form.playerUniformSize" type="text" placeholder="M" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Chuteira</label>
              <input v-model.number="form.playerFootSize" type="number" placeholder="42" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Luva</label>
              <input v-model.number="form.playerGloveSize" type="number" placeholder="9" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
          </div>
        </div>

        <!-- Section 4: Social Links -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Redes Sociais</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Instagram</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">instagram.com/</span>
                <input v-model="form.playerInstagram" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">YouTube</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">youtube.com/</span>
                <input v-model="form.playerYoutube" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="canal" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">TikTok</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">tiktok.com/</span>
                <input v-model="form.playerTiktok" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Facebook</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">facebook.com/</span>
                <input v-model="form.playerFacebook" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">X (Twitter)</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">x.com/</span>
                <input v-model="form.playerX" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Kwai</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">kwai.com/</span>
                <input v-model="form.playerKwaii" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Goleiro de Aluguel</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">goleiro.app/</span>
                <input v-model="form.playerGDA" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="perfil" />
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
            <span v-else>Salvar perfil</span>
          </button>
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

        if (!data) return  // No profile yet — leave form empty

        let socialProfiles = data.social_profiles || {}

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
        this.stateId = data.city_info?.state_id ?? data.city_info?.state_info?.id ?? null
        this.form.playerYoutube = socialProfiles.youtube ?? null
        this.form.playerTiktok = socialProfiles.tiktok ?? null
        this.form.playerInstagram = socialProfiles.instagram ?? null
        this.form.playerX = socialProfiles.x  ?? null
        this.form.playerKwaii = socialProfiles.kwaii ?? null
        this.form.playerFacebook = socialProfiles.facebook ?? null
        this.form.playerGDA = socialProfiles.gda ?? null

        if (data.photo_url) {
          this.existingPhotoUrl = data.photo_url
          this.photoPreviewUrl = data.photo_url
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
        } else if (value === null || value === undefined || value === '') {
          // Não envia campos vazios — evita que o backend receba "" como string em campos numéricos
          return
        } else {
          formData.append(key, value)
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

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Perfil salvo com sucesso!',
          showConfirmButton: false,
          timer: 2500,
        })

        // Reload profile data to reflect changes
        await this.getPlayerProfileInfo()
      } catch (err) {
        console.error(err)
        let data = err.response?.data
        let mensagens = 'Erro ao salvar o perfil.'

        if (data?.errors) {
          const photoErrorMsg = data.errors.playerPhoto?.[0] || data.errors.photo?.[0]
          if (photoErrorMsg) {
            this.photoError = photoErrorMsg
          }
          mensagens = Object.values(data.errors).flat().join('<br><br>')
        } else if (data?.message) {
          mensagens = data.message
        }

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao salvar!',
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
