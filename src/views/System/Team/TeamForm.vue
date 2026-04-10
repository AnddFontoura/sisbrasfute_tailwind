<template>
  <system-layout>
    <div class="mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {{ isEditMode ? "Editar Time" : "Cadastrar Novo Time" }}
      </h1>

      <div class="relative">
        <div
          v-if="loading"
          class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-white/70 backdrop-blur-sm dark:bg-gray-900/60"
        >
          <svg
            class="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400"
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

        <form @submit.prevent="handleSubmit" class="space-y-4" :class="{ 'pointer-events-none opacity-70': loading }">
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
          <div class="mt-3">
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

          <div class="mt-3">
            <div class="sm:col-span-4">
              <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Facebook</label>
              <div class="mt-2">
                <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                  <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://facebook.com/</div>
                  <input v-model="form.teamFacebook" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3">
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

          <div class="mt-3">
            <div class="sm:col-span-4">
              <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Instagram</label>
              <div class="mt-2">
                <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                  <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://www.instagram.com/</div>
                  <input v-model="form.teamInstagram" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <div class="sm:col-span-4">
              <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Tiktok</label>
              <div class="mt-2">
                <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                  <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://tiktok.com/</div>
                  <input v-model="form.teamTiktok" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <div class="sm:col-span-4">
              <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Kwai</label>
              <div class="mt-2">
                <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                  <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">https://www.kwai.com/</div>
                  <input v-model="form.teamKwaii" type="text" name="username" id="username" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500" placeholder="janesmith" />
                </div>
              </div>
            </div>
          </div>

          <!-- Botão -->
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
                bg-indigo-600
                px-4
                py-2
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:bg-indigo-400
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

              <span>{{ loading ? "Salvando..." : "Salvar" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue"
import CitySelect from "@/components/form/CitySelectComponent.vue"
import systemLayout from "@/components/layouts/systemLayout.vue";
import {QuillEditor} from "@vueup/vue-quill";
import Swal from "sweetalert2";

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
        teamKwaii: "",
      },
      logoFile: null,
      bannerFile: null,
      loading: false,
      stateId: null,
      teamId: null,
    };
  },

  computed: {
    isEditMode() {
      return !!this.teamId;
    },
    payload() {
      // computed monta o objeto exatamente como a API espera
      return { ...this.form };
    },
  },

  created() {
    const queryId = this.$route.query.id;
    const routeId = this.$route.params.id;

    this.teamId = queryId || routeId || null;

    console.log(this.teamId)

    if (this.teamId) {
      this.getTeamInformation();
    }
  },

  methods: {
    onLogoChange(e) {
      this.logoFile = e.target.files[0]
    },

    onBannerChange(e) {
      this.bannerFile = e.target.files[0]
    },
    async getTeamInformation() {
      this.loading = true;

      try {
        let response = await api.get("/team/show/" + this.teamId);
        let team = response.data;
        let socialProfiles = response.data.social_profiles;


        this.form.teamCityId = team.city_id ?? "";
        this.form.teamName = team.name ?? "";
        this.form.teamGender = team.gender ?? "";
        this.form.teamModalityId = team.modality_id ?? "";
        this.form.teamDescription = team.description ?? "";
        this.form.teamFoundationDate = team.foundation_date ?? "";
        this.form.teamLogo = team.teamLogo ?? "";
        this.form.teamBanner = team.teamBanner ?? "";
        this.form.teamFacebook = socialProfiles.facebook ?? "";
        this.form.teamInstagram = socialProfiles.instagram ?? "";
        this.form.teamX = socialProfiles.x ?? "";
        this.form.teamTiktok = socialProfiles.tiktok ?? "";
        this.form.teamYoutube = socialProfiles.youtube ?? "";
        this.form.teamKwaii = socialProfiles.kwaii ?? "";

        this.stateId = team.stateId ?? null;
      } catch (err) {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro encontrado!",
          text: "Não foi possível carregar os dados do time.",
          showConfirmButton: true,
        });
      } finally {
        this.loading = false;
      }
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
        let url = "/team/save";
        if (this.teamId) {
          url = "/team/update/" + this.teamId;
        }

        await api.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        this.$router.push("/team/list");
      } catch (err) {
        let data = err.response?.data
        let mensagens = ""

        if (data?.errors) {
          mensagens = Object.values(data.errors).flat().join("<br> <br>")
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
        this.loading = false;
      }
    },
  },
};
</script>
