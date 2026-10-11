<template>
  <system-layout>
    <main class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Minhas Quadras</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie as quadras que você cadastrou.</p>
        </div>
        <router-link
          :to="{ name: 'court-form' }"
          class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          + Cadastrar quadra
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="courts.length === 0"
        class="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-12 px-6 text-center"
      >
        <p class="text-sm text-gray-600 dark:text-gray-300">Você ainda não tem quadras. Cadastre a primeira.</p>
        <router-link
          :to="{ name: 'court-form' }"
          class="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          Cadastrar quadra
        </router-link>
      </div>

      <!-- Court cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="court in courts"
          :key="court.id"
          class="group flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-md"
        >
          <!-- Cover photo -->
          <router-link :to="{ name: 'court-show', params: { id: court.id } }" class="block">
            <div class="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                :src="coverPhoto(court) || fallbackImage"
                @error="$event.target.src = fallbackImage"
                alt=""
                class="h-full w-full object-cover transition duration-200 group-hover:scale-105"
              />
              <span
                class="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                :class="statusBadgeClass(court.status)"
              >
                {{ statusLabel(court.status) }}
              </span>
              <span
                v-if="court.my_role && court.my_role !== 'owner'"
                class="absolute left-2 top-2 inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
              >
                {{ roleLabel(court.my_role) }}
              </span>
            </div>
          </router-link>

          <!-- Body -->
          <div class="flex flex-1 flex-col p-4">
            <router-link :to="{ name: 'court-show', params: { id: court.id } }">
              <h2 class="truncate text-base font-bold text-gray-900 dark:text-white hover:text-orange-500 transition">
                {{ court.name }}
              </h2>
            </router-link>
            <p v-if="court.modality_info" class="mt-1 text-xs font-medium text-orange-600 dark:text-orange-400">
              {{ court.modality_info.name }}
            </p>
            <p v-if="court.city_info" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              📍 {{ court.city_info.name }} / {{ court.city_info.state_info?.name }}
            </p>

            <div class="mt-4 flex items-center gap-2">
              <router-link
                :to="{ name: 'court-show', params: { id: court.id } }"
                class="inline-flex items-center rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                Visualizar
              </router-link>
              <router-link
                :to="{ name: 'court-edit', params: { id: court.id } }"
                class="inline-flex items-center rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 dark:border-orange-500/30 dark:bg-transparent dark:text-orange-400 dark:hover:bg-orange-500/10"
              >
                Editar
              </router-link>
              <router-link
                v-if="court.my_role === 'owner' || court.my_role === 'manager'"
                :to="{ name: 'court-admin', params: { courtId: court.id } }"
                class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
              >
                Administrar
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import Swal from "@/services/swal.js";

export default {
  name: "MyCourts",
  components: {
    systemLayout,
  },
  data() {
    return {
      courts: [],
      loading: false,
      fallbackImage:
        "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
    };
  },
  created() {
    this.getMyCourts();
  },
  methods: {
    coverPhoto(court) {
      const photos = court.photos ?? [];
      if (photos.length === 0) return null;
      const cover = photos.find((p) => p.position === 0) ?? photos[0];
      return cover?.photo_url ?? null;
    },

    statusLabel(status) {
      const map = {
        pending: "Pendente",
        approved: "Aprovada",
        rejected: "Rejeitada",
      };
      return map[status] ?? status;
    },

    roleLabel(role) {
      const map = { owner: "Proprietário", manager: "Gerente", employee: "Funcionário" };
      return map[role] ?? role;
    },

    statusBadgeClass(status) {
      const map = {
        pending:
          "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        approved:
          "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
        rejected:
          "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
      };
      return map[status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300";
    },

    async getMyCourts() {
      this.loading = true;
      try {
        const { data } = await api.get("/court/my-courts");
        this.courts = data.courts ?? [];
      } catch (err) {
        console.error(err);
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar quadras",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
