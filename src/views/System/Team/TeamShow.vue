<template>
  <system-layout>
    <main>
        <div class="rounded">
          <img class="h-32 w-full object-cover lg:h-48" :src="team.banner_url" alt="" />
          <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div class="flex">
                <img class="size-24 rounded-full ring-4 ring-white sm:size-32 dark:ring-gray-900 dark:outline dark:-outline-offset-1 dark:outline-white/10" :src="team.logo_url" alt="" />
              </div>
              <div class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
                  <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ team.name }}</h1>
                </div>
                <div class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <button type="button" class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20">
                    <span> Amistoso </span>
                  </button>
                  <button type="button" class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20">
                    <span> Favoritar </span>
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
              <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ team.name }}</h1>
            </div>
          </div>
      </div>

      <div class="relative isolate overflow-hidden dark:bg-gray-900">
        <div class="mx-auto">
          <div class="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            <div class="flex gap-x-4 rounded-xl bg-white/30 p-6 ring-1 ring-gray-900/5 backdrop-blur-sm dark:bg-white/5 dark:inset-ring dark:inset-ring-white/5">
              <component is="MapIcon" class="h-7 w-5 flex-none text-orange-500 dark:text-orange-400" aria-hidden="true" />
              <div class="text-base/7">
                <h3 class="font-semibold text-gray-900 dark:text-white"> Estado </h3>
                <p class="mt-2 text-gray-700 dark:text-gray-300">{{ team.city_info?.state_info?.name ?? 'Desconhecido' }}</p>
              </div>
            </div>

            <div class="flex gap-x-4 rounded-xl bg-white/30 p-6 ring-1 ring-gray-900/5 backdrop-blur-sm dark:bg-white/5 dark:inset-ring dark:inset-ring-white/5">
              <component is="MapPinIcon" class="h-7 w-5 flex-none text-orange-500 dark:text-orange-400" aria-hidden="true" />
              <div class="text-base/7">
                <h3 class="font-semibold text-gray-900 dark:text-white"> Cidade </h3>
                <p class="mt-2 text-gray-700 dark:text-gray-300">{{ team.city_info?.name ?? 'Desconhecido' }}</p>
              </div>
            </div>

            <div class="flex gap-x-4 rounded-xl bg-white/30 p-6 ring-1 ring-gray-900/5 backdrop-blur-sm dark:bg-white/5 dark:inset-ring dark:inset-ring-white/5">
              <component is="CalendarIcon" class="h-7 w-5 flex-none text-orange-500 dark:text-orange-400" aria-hidden="true" />
              <div class="text-base/7">
                <h3 class="font-semibold text-gray-900 dark:text-white">Fundado em</h3>
                <p class="mt-2 text-gray-700 dark:text-gray-300">{{ team.foundation_date_br }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="team.isRecruiting"
        class="
          mt-3
          flex items-center justify-between
          rounded-2xl
          border border-orange-200
          bg-black
          px-6 py-5
          shadow-lg
          transition-all
          duration-300
          hover:border-orange-400
          hover:shadow-2xl
        "
      >
        <div class="flex items-center gap-4">
          <div
            class="
              flex h-14 w-14 items-center justify-center
              rounded-2xl
              bg-orange-500
              text-2xl
              shadow-md
            "
          >
            ⚽
          </div>

          <div>
            <h3 class="text-lg font-bold text-white p-2">
              Esse time está recrutando jogadores!
            </h3>

            <p class="text-sm text-gray-300 p-2">
              <span v-for="(item, index) in team.isRecruiting" :key="index">
                 | {{ item.game_position_info.name }}
              </span>
                |
            </p>
          </div>
        </div>

        <button
          @click="handleInterestClick"
          class="
            rounded-xl
            bg-orange-500
            px-5 py-3
            font-semibold
            text-white
            shadow-md
            transition-all
            duration-200
            hover:bg-orange-400
            hover:shadow-xl
            active:scale-95
          "
        >
          Tenho interesse
        </button>
      </div>

      <div
        v-if="showInterestModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Escolha uma posição
              </h2>

              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Seu perfil será exibido ao dono do time. Você poderá checar o status da sua aplicação
                a qualquer momento no menu "Minhas Aplicações" dentro da área de jogadores.
              </p>
            </div>

            <button
              type="button"
              class="rounded-lg px-2 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="closeInterestModal"
            >
              ×
            </button>
          </div>

          <div class="mt-6">
            <label
              for="recruitGamePositionId"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Posição desejada
            </label>

            <select
              id="recruitGamePositionId"
              v-model="recruitGamePositionId"
              class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option :value="0" disabled>
                Selecione uma posição
              </option>

              <option
                v-for="item in team.isRecruiting"
                :key="item.id"
                :value="item.game_position_info.id"
              >
                {{ item.game_position_info.name }}
              </option>
            </select>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-xl border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              @click="closeInterestModal"
            >
              Cancelar
            </button>

            <button
              type="button"
              class="rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300"
              :disabled="loading || !recruitGamePositionId"
              @click="submitInterest"
            >
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-html="team.description"
        class="
          mt-10
        "
      >
      </div>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import { MapIcon, MapPinIcon, CalendarIcon } from '@heroicons/vue/20/solid'
import Swal from "@/services/swal.js"

export default {
  name: "teamList",
  components: {
    systemLayout,
    MapIcon,
    MapPinIcon,
    CalendarIcon,
  },
  data() {
    return {
      teamId: 0,
      team: {},
      recruitGamePositionId: 0,
      showInterestModal: false,
      loading: false,
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    }
  },
  created() {
    this.teamId = this.$route.params.id
    this.getTeamInformation()
  },
  methods: {
    async getTeamInformation() {
      if (this.teamId !== 0) {
        this.loading = true;

        try {
          let response = await api.get("/team/show/" + this.teamId);
          this.team = response.data

        } catch (err) {
          console.error(err);
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Erro ao puxar lista do time',
            showConfirmButton: false,
            timer: 3000,
          })
        } finally {
          this.loading = false;
        }
      }
    },
    handleInterestClick() {
      this.recruitGamePositionId = 0;
      this.showInterestModal = true;
    },
    closeInterestModal() {
      this.showInterestModal = false;
      this.recruitGamePositionId = 0;
    },
    async submitInterest() {
      if (!this.recruitGamePositionId) {
        await Swal.fire({
          icon: "warning",
          title: "Atenção!",
          text: "Selecione uma posição antes de salvar.",
        });

        return;
      }

      this.loading = true;

      try {
        await api.post(`/team-application/apply/save`, {
          gamePositionId: this.recruitGamePositionId,
          teamId: this.teamId,
        });

        this.closeInterestModal();

        await Swal.fire({
          icon: "success",
          title: "Pedido enviado!",
          text: "Sua aplicação foi enviada com sucesso.",
          confirmButtonText: "Ok",
        });
      } catch (err) {
        let mensagem = "Não foi possível aplicar nesse time.";

        if (err.response?.data?.message) {
          mensagem = err.response.data.message;
        }

        if (err.response?.data?.errors) {
          mensagem = Object.values(err.response.data.errors).flat().join("<br><br>");
        }

        await Swal.fire({
          icon: "error",
          title: "Erro",
          html: mensagem,
          confirmButtonText: "Ok",
        });
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>
