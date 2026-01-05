<template>
  <system-layout>
    <div class="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Atualizar Perfil de Jogador</h1>

      <player-position-select :is-multiselect="true"></player-position-select>

      <modalities-select :is-multiselect="true"></modalities-select>

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
          v-model="form.teamName"
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
          v-model="form.teamName"
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
          v-model="form.teamName"
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
          v-model="form.teamName"
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
          v-model="form.teamName"
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
          v-model="form.teamName"
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
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tamanho da luva</label>
        <input
          v-model="form.teamName"
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
          v-model="form.teamName"
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
              <input type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
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
              <input type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
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
              <input type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
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
              <input type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
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
              <input type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
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
              <input type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
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
              <input type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <button type="submit" class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700">
          Salvar dados de jogador
        </button>
      </div>
    </div>
  </system-layout>
</template>

<script>
import PlayerPositionSelect from "@/components/form/GamePositionSelect.vue";
import ModalitiesSelect from "@/components/form/ModalitiesSelect.vue";
import SystemLayout from "@/components/layouts/systemLayout.vue";
import CitySelectComponent from "@/components/form/CitySelectComponent.vue";
import StateSelectComponent from "@/components/form/StateSelectComponent.vue";

export default {
  name: "PlayerProfileForm",
  components: {
    SystemLayout,
    PlayerPositionSelect,
    ModalitiesSelect,
    CitySelectComponent,
    StateSelectComponent,
  },
  data() {
    return {
      form: {
        teamName: '',
        photoFile: null,
      },
      stateId: null,
      cityId: null,
    }
  },
  methods: {
    onPhotoChange(e) {
      this.form.photoFile = e.target.files[0]
    },
  }
}
</script>

<style scoped>

</style>
