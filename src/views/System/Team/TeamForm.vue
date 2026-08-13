<template>
  <system-layout>
    <!-- Team Banner (edit mode) -->
    <team-banner v-if="isEditMode" :team-info-id="teamId" />

    <form @submit.prevent="handleSubmit">
      <div class="space-y-6" :class="isEditMode ? 'mt-6' : ''">

        <!-- Page Header -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? "Editar Time" : "Cadastrar Novo Time" }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ isEditMode ? "Atualize as informações do seu time." : "Preencha os dados para criar seu time." }}
          </p>
        </div>

        <!-- Section 1: Images (Logo + Banner) -->
        <div class="relative rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <!-- Loading overlay -->
          <div v-if="loading" class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm dark:bg-gray-900/60">
            <svg class="h-10 w-10 animate-spin text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p class="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Salvando...</p>
          </div>

          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Imagens</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Logo upload -->
            <div class="text-center">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Logo / Escudo</p>
              <div class="flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-4 py-6">
                <div class="text-center">
                  <label for="logo-upload" class="cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
                    <span>Escolher logo</span>
                    <input id="logo-upload" type="file" class="sr-only" accept="image/*" @change="onLogoChange" />
                  </label>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF até 10MB</p>
                  <p v-if="logoFile" class="mt-1 text-xs text-green-600 dark:text-green-400">{{ logoFile.name }}</p>
                </div>
              </div>
            </div>
            <!-- Banner upload -->
            <div class="text-center">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Banner</p>
              <div class="flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-4 py-6">
                <div class="text-center">
                  <label for="banner-upload" class="cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
                    <span>Escolher banner</span>
                    <input id="banner-upload" type="file" class="sr-only" accept="image/*" @change="onBannerChange" />
                  </label>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF até 10MB</p>
                  <p v-if="bannerFile" class="mt-1 text-xs text-green-600 dark:text-green-400">{{ bannerFile.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Team Info -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Informações do Time</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome do Time</label>
              <input v-model="form.teamName" type="text" placeholder="Ex: FC Estrela" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Gênero</label>
              <select v-model="form.teamGender" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10">
                <option value="0">Selecione</option>
                <option value="1">Masculino</option>
                <option value="2">Feminino</option>
                <option value="3">Misto</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Modalidade</label>
              <select v-model="form.teamModalityId" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10">
                <option value="1">Futsal</option>
                <option value="2">Fut7/Fut5</option>
                <option value="3">Suiço</option>
                <option value="4">Campo de 11</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Data de Fundação</label>
              <input v-model="form.teamFoundationDate" type="date" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <StateSelect v-model="this.stateId" />
            <CitySelect :stateId="this.stateId" v-model="this.form.teamCityId" />
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Descrição</label>
            <QuillEditor v-model:content="form.teamDescription" content-type="html" theme="snow" class="bg-white dark:bg-gray-700 rounded border dark:border-gray-600" />
          </div>
        </div>

        <!-- Section 3: Social Links -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Redes Sociais</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Instagram</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">instagram.com/</span>
                <input v-model="form.teamInstagram" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">YouTube</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">youtube.com/</span>
                <input v-model="form.teamYoutube" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="canal" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">TikTok</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">tiktok.com/</span>
                <input v-model="form.teamTiktok" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Facebook</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">facebook.com/</span>
                <input v-model="form.teamFacebook" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">X (Twitter)</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">x.com/</span>
                <input v-model="form.teamX" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Kwai</label>
              <div class="mt-1 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-orange-500 dark:bg-white/5 dark:outline-white/10">
                <span class="shrink-0 pl-3 text-xs text-gray-400 dark:text-gray-500">kwai.com/</span>
                <input v-model="form.teamKwaii" type="text" class="block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" placeholder="usuario" />
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
            <span v-else>{{ isEditMode ? 'Salvar alterações' : 'Criar time' }}</span>
          </button>
        </div>

      </div>
    </form>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue"
import CitySelect from "@/components/form/CitySelectComponent.vue"
import systemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import {QuillEditor} from "@vueup/vue-quill";
import Swal from "@/services/swal.js";

export default {
  name: "NewTeam",
  components: {
    CitySelect,
    StateSelect,
    TeamBanner,
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

        this.stateId = team.city_info?.state_id ?? team.city_info?.state_info?.id ?? null;
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

      // 🔹 Campos normais (skip image fields — handled separately as file uploads)
      Object.entries(this.form).forEach(([key, value]) => {
        if (key === 'teamLogo' || key === 'teamBanner') return
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
