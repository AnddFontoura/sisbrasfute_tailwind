<template>
  <system-layout>
    <main>
      <div class="rounded">
        <img class="h-32 w-full object-cover lg:h-48" :src="playerProfile?.banner_url || fallbackImage" alt="" />
        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div class="flex">
              <img class="size-24 rounded-full ring-4 ring-white sm:size-32 dark:ring-gray-900 dark:outline dark:-outline-offset-1 dark:outline-white/10" :src="playerProfile?.photo_url || fallbackImage" alt="" />
            </div>
            <div class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
                <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ playerProfile.name }}</h1>
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
            <h1 class="truncate text-2xl font-bold text-gray-900 dark:text-white">{{ playerProfile.name }}</h1>
          </div>
        </div>
      </div>

      <div
        class="
          relative
          isolate
          overflow-hidden
          dark:bg-gray-900
        "
      >
          <div class="
            mt-3
            mx-auto
            grid
            max-w-2xl
            grid-cols-1
            gap-6
            lg:mx-0
            lg:max-w-none
            lg:grid-cols-5
            lg:gap-8
          ">
            <div
              class="
                px-4
                py-5
                sm:px-6
            ">
              <ul role="list" class="divide-y divide-gray-200 dark:divide-white/10">
                <li class="px-4 py-4 sm:px-0">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white"> Estado </h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.city_info?.state_info?.name ?? 'Desconhecido' }}</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white"> Cidade </h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.city_info?.name ?? 'Desconhecido' }}</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Idade</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.age }} anos</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0" v-if="playerProfile.uniform_size">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Tamanho do Uniforme</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.uniform_size }}</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0" v-if="playerProfile.glove_size">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Tamanho da Luva</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.glove_size }}</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0" v-if="playerProfile.height">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Altura</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.height }} cm</p>
                  </div>
                </li>

                <li class="px-4 py-4 sm:px-0" v-if="playerProfile.weight">
                  <div class="text-base/7">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Peso</h3>
                    <p class="mt-2 text-gray-700 dark:text-gray-300">{{ playerProfile.weight }} Kg</p>
                  </div>
                </li>
              </ul>
            </div>

            <div
              class="
                px-4
                py-5
                sm:p-6
                border-1px-blue
                col-span-4
              "
            >

          </div>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import Swal from "sweetalert2";

export default {
  name: "PlayerProfileShow",
  components: {
    systemLayout,
  },
  data() {
    return {
      playerProfileId: 0,
      playerProfile: {},
      fallbackImage: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    }
  },
  created() {
    this.playerProfileId = this.$route.params.id
    this.getTeamInformation()
  },
  methods: {
    async getTeamInformation() {
      if (this.playerProfileId !== 0) {
        this.loading = true;

        try {
          let response = await api.get("/player-profile/show/" + this.playerProfileId);
          this.playerProfile = response.data

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
    }
  },
};
</script>
