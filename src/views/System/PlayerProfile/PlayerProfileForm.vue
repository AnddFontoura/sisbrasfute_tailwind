<template>
  <system-layout>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Atualizar Perfil de Jogador</h1>
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Foto</label>

          <div class="col-span-full">
            <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Foto de Apresentação</label>
            <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25">
              <div class="text-center">
                <div class="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
                  <label for="logo-upload" class="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-300">
                    <span>Upload a file</span>
                    <input
                      id="photo-upload"
                      name="photo-upload"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="onPhotoChange"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs/5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
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
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
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
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
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
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
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
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
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
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
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
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
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
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
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
                focus:outline-indigo-600
                sm:text-sm/6
                dark:bg-white/5
                dark:text-white
                dark:outline-white/10
                dark:placeholder:text-gray-500
                dark:focus:outline-indigo-500
              "
          />
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Youtube</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://youtube.com/</div>
                <input v-model="form.playerYoutube" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Facebook</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://facebook.com/</div>
                <input v-model="form.playerFacebook" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">X (Antigo Twitter)</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://x.com/</div>
                <input v-model="form.playerX" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Instagram</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://www.instagram.com/</div>
                <input v-model="form.playerInstagram" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Tiktok</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://tiktok.com/</div>
                <input v-model="form.playerTiktok" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Kwai</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://www.kwai.com/</div>
                <input v-model="form.playerKwaii" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 mt-3">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Goleiro de Aluguel</label>
            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
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

        <div class="mt-3">
          <button type="submit" class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700">
            Salvar dados de jogador
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
      ]
    }
  },
  mounted () {
    this.getPlayerProfileInfo()
  },
  methods: {
   async getPlayerProfileInfo()
    {
      console.log('começou')
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

      } catch (err) {
        console.error(err);
        alert("Erro ao puxar dados do jogador!");
      } finally {
        this.loading = false;
      }
    },
    onPhotoChange(e) {
      this.form.photoFile = e.target.files[0]
    },
    async handleSubmit() {
      this.loading = true;
      const formData = new FormData()

      Object.entries(this.form).forEach(([key, value]) => {
        formData.append(key, value ?? "")
      })

      formData.append("playerCityId", this.cityId)

      if (this.logoFile) {
        formData.append("playerPhoto", this.form.photoFile)
      }

      try {
        await api.post("/player-profile/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

          this.$router.push("/player-profile/form");
      } catch (err) {
        console.error(err);
        alert("Erro ao salvar time!");
      } finally {
        this.loading = false;
      }
    },
  }
}
</script>

<style scoped>

</style>
