<template>
  <system-layout>
      <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Cadastrar Novo Time</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Estado -->
        <StateSelect v-model="this.stateId"></StateSelect>

        <!-- Cidade -->
        <CitySelect
          :stateId="this.stateId"
          v-model="this.form.teamCityId"
        ></CitySelect>

        <!-- Nome do time -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome do Time</label>
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

        <!-- Gênero -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Gênero</label>

          <select
            v-model="form.teamGender"
            class="
              col-start-1
              row-start-1
              w-full
              appearance-none
              rounded-md
              bg-white
              py-1.5
              pr-8 pl-3
              text-base
              text-gray-900
              outline-1
              -outline-offset-1
              outline-gray-300
              focus:outline-2
              focus:-outline-offset-2
              focus:outline-indigo-600
              sm:text-sm/6
              dark:bg-white/5
              dark:text-white
              dark:outline-white/10
              dark:*:bg-gray-800
              dark:focus:outline-indigo-500
            "
          >
            <option value="0">Selecione</option>
            <option value="1">Masculino</option>
            <option value="2">Feminino</option>
            <option value="3">Misto</option>
          </select>
        </div>

        <!-- Modalidade -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Modalidade</label>
          <select
            v-model="form.teamModalityId"
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
          >
            <option value="1">Futsal</option>
            <option value="2">Fut7/Fut5</option>
            <option value="3">Suiço</option>
            <option value="4">Campo de 11</option>
          </select>
        </div>

        <!-- Descrição -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Descrição</label>

          <QuillEditor
            v-model:content="form.teamDescription"
            content-type="html"
            theme="snow"
            class="bg-white rounded border"
          />
        </div>

        <!-- Fundação -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Data de Fundação</label>
          <input
            v-model="form.teamFoundationDate"
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

        <!-- Logo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Logo (URL)</label>

          <div class="col-span-full">
            <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Cover photo</label>
            <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25">
              <div class="text-center">
                <div class="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
                  <label for="logo-upload" class="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-300">
                    <span>Upload a file</span>
                    <input
                      id="logo-upload"
                      name="logo-upload"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="onLogoChange"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs/5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Banner -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Banner (URL)</label>

          <div class="col-span-full">
            <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Cover photo</label>
            <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25">
              <div class="text-center">
                <div class="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
                  <label for="banner-upload" class="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-300">
                    <span>Upload a file</span>
                    <input
                      id="banner-upload"
                      name="banner-upload"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="onBannerChange"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs/5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Redes sociais -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Facebook</label>
            <input
              v-model="form.teamFacebook"
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
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Instagram</label>
            <input
              v-model="form.teamInstagram"
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
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">X (Twitter)</label>
            <input
              v-model="form.teamX"
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
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">TikTok</label>
            <input
              v-model="form.teamTiktok"
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
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">YouTube</label>
            <input
              v-model="form.teamYoutube"
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
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Kwai</label>
            <input
              v-model="form.teamKwai"
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
        </div>

        <!-- Botão -->
        <div class="pt-4">
          <button type="submit" class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700">Salvar</button>
        </div>
      </form>
    </div>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue"
import CitySelect from "@/components/form/CitySelectComponent.vue"
import systemLayout from "@/components/layouts/systemLayout.vue";
import {QuillEditor} from "@vueup/vue-quill";

export default {
  name: "NewTeam",
  components: {
    CitySelect,
    StateSelect,
    systemLayout,
    QuillEditor,
  },
  data() {
    return {
      form: {
        teamCityId: "",
        teamName: "",
        teamGender: "",
        teamModalityId: "",
        teamDescription: "",
        teamFoundationDate: "",
        teamLogo: "",
        teamBanner: "",
        teamFacebook: "",
        teamInstagram: "",
        teamX: "",
        teamTiktok: "",
        teamYoutube: "",
        teamKwai: "",
      },
      logoFile: null,
      bannerFile: null,
      loading: false,
      stateId: null,
    };
  },

  computed: {

    payload() {
      // computed monta o objeto exatamente como a API espera
      return { ...this.form };
    },
  },

  methods: {
    onLogoChange(e) {
      this.logoFile = e.target.files[0]
    },

    onBannerChange(e) {
      this.bannerFile = e.target.files[0]
    },
    async handleSubmit() {
      this.loading = true;
      const formData = new FormData()

      // 🔹 Campos normais
      Object.entries(this.form).forEach(([key, value]) => {
        formData.append(key, value ?? "")
      })

      if (this.logoFile) {
        formData.append("teamLogo", this.logoFile)
      }

      if (this.bannerFile) {
        formData.append("teamBanner", this.bannerFile)
      }

      try {
        await api.post("/team/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        this.$router.push("/team/list");
      } catch (err) {
        console.error(err);
        alert("Erro ao salvar time!");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
