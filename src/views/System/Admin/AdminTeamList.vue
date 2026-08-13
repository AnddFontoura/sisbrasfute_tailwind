<template>
  <system-layout>
    <main>
      <!-- Title -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Administração - Times</h1>
      </div>

      <!-- Filtros -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-gray-800 dark:text-white">Filtros</h2>
          <button @click="resetFilters" class="text-xs font-medium text-gray-500 hover:text-orange-500 transition">
            Limpar
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Nome -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome</label>
            <input
              v-model="filters.name"
              type="text"
              placeholder="Buscar por nome..."
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              @input="debounceSearch"
            />
          </div>

          <!-- Estado -->
          <state-select-component
            v-model="filters.state_id"
            label-name="Estado"
            @update:modelValue="onStateChange"
          />

          <!-- Cidade -->
          <city-select-component
            v-model="filters.city_id"
            label-name="Cidade"
            :state-id="filters.state_id"
            @update:modelValue="applyFilters"
          />

          <!-- Modalidade -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Modalidade</label>
            <select
              v-model="filters.modality_id"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              @change="applyFilters"
            >
              <option :value="null">Todas as modalidades</option>
              <option v-for="modality in modalities" :key="modality.id" :value="modality.id">
                {{ modality.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="teams.length === 0" class="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        Nenhum time encontrado.
      </div>

      <!-- Tabela de times -->
      <div v-else class="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-white/10">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Cidade</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Modalidade</th>
              <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Logo</th>
              <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Banner</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-white/10">
            <tr v-for="team in teams" :key="team.id" class="hover:bg-gray-50 dark:hover:bg-white/5 transition">
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{{ team.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{{ team.city_name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{{ team.state_name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{{ team.modality_name }}</td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span
                  v-if="team.has_logo"
                  class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-400"
                >✓</span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                >—</span>
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span
                  v-if="team.has_banner"
                  class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-400"
                >✓</span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                >—</span>
              </td>
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="{ name: 'team-show', params: { id: team.id } }"
                    class="inline-flex items-center rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
                  >
                    Visualizar
                  </router-link>
                  <button
                    v-if="team.has_logo"
                    @click="removeLogo(team)"
                    class="inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    Remover Logo
                  </button>
                  <button
                    v-if="team.has_banner"
                    @click="removeBanner(team)"
                    class="inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    Remover Banner
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <pagination-component :pagination="pagination" @change="getTeamList"></pagination-component>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import StateSelectComponent from "@/components/form/StateSelectComponent.vue";
import CitySelectComponent from "@/components/form/CitySelectComponent.vue";
import Swal from "@/services/swal.js";

export default {
  name: "AdminTeamList",
  components: {
    systemLayout,
    PaginationComponent,
    StateSelectComponent,
    CitySelectComponent,
  },

  data() {
    return {
      teams: [],
      modalities: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      filters: {
        name: '',
        state_id: null,
        city_id: null,
        modality_id: null,
      },
      loading: false,
      searchTimeout: null,
    };
  },

  created() {
    this.loadModalities();
    this.getTeamList();
  },

  methods: {
    async loadModalities() {
      try {
        const { data } = await api.get("/modalities/list");
        this.modalities = data.modalities ?? [];
      } catch (err) {
        console.error("Erro ao carregar modalidades:", err);
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.applyFilters();
      }, 400);
    },

    applyFilters() {
      this.getTeamList(1);
    },

    onStateChange() {
      this.filters.city_id = null;
      this.applyFilters();
    },

    resetFilters() {
      this.filters = { name: '', state_id: null, city_id: null, modality_id: null };
      this.getTeamList(1);
    },

    async getTeamList(page = 1) {
      this.loading = true;
      try {
        const response = await api.get("/admin/teams", {
          params: {
            page,
            per_page: 15,
            name: this.filters.name || undefined,
            state_id: this.filters.state_id || undefined,
            city_id: this.filters.city_id || undefined,
            modality_id: this.filters.modality_id || undefined,
          },
        });
        this.teams = response.data.data;
        this.pagination = response.data;
      } catch (err) {
        console.error(err);
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar times",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    async removeLogo(team) {
      const result = await Swal.fire({
        title: "Remover Logo",
        text: `Deseja realmente remover o logo do time "${team.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, remover",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      try {
        await api.delete(`/admin/teams/${team.id}/logo`);
        team.has_logo = false;
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Logo removido com sucesso!",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        const message = err.response?.data?.error || "Erro ao remover logo.";
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },

    async removeBanner(team) {
      const result = await Swal.fire({
        title: "Remover Banner",
        text: `Deseja realmente remover o banner do time "${team.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, remover",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      try {
        await api.delete(`/admin/teams/${team.id}/banner`);
        team.has_banner = false;
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Banner removido com sucesso!",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        const message = err.response?.data?.error || "Erro ao remover banner.";
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
  },
};
</script>
