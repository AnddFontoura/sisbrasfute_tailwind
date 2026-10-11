<template>
  <system-layout>
    <main>
      <!-- Title -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Administração - Quadras</h1>
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
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
            <select
              v-model="filters.status"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              @change="applyFilters"
            >
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovadas</option>
              <option value="rejected">Rejeitadas</option>
            </select>
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
      <div v-else-if="courts.length === 0" class="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        Nenhuma quadra encontrada.
      </div>

      <!-- Tabela -->
      <div v-else class="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-white/10">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Dono</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Modalidade</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Cidade</th>
              <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
              <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Fotos</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-white/10">
            <tr v-for="court in courts" :key="court.id" class="hover:bg-gray-50 dark:hover:bg-white/5 transition">
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{{ court.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{{ court.owner?.name ?? '—' }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{{ court.modality_info?.name ?? '—' }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {{ court.city_info?.name ?? '—' }} / {{ court.city_info?.state_info?.name ?? '' }}
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="statusBadgeClass(court.status)">
                  {{ statusLabel(court.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{{ court.photos_count ?? 0 }}</td>
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="approve(court)"
                    class="inline-flex items-center rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600"
                  >
                    Aprovar
                  </button>
                  <button
                    @click="openRejectModal(court)"
                    class="inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    Rejeitar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <pagination-component :pagination="pagination" @change="getCourtList"></pagination-component>
    </main>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div class="flex items-start justify-between gap-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Rejeitar quadra</h2>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            @click="closeRejectModal"
          >
            ×
          </button>
        </div>

        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Informe (opcional) o motivo da rejeição da quadra "{{ rejectTarget?.name }}".
        </p>

        <div class="mt-4">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">Motivo</label>
          <textarea
            v-model="rejectReason"
            rows="4"
            maxlength="1000"
            placeholder="Opcional"
            class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-xl border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            @click="closeRejectModal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="rejecting"
            @click="confirmReject"
          >
            {{ rejecting ? 'Rejeitando...' : 'Rejeitar' }}
          </button>
        </div>
      </div>
    </div>
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
  name: "AdminCourtList",
  components: {
    systemLayout,
    PaginationComponent,
    StateSelectComponent,
    CitySelectComponent,
  },
  data() {
    return {
      courts: [],
      modalities: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      filters: {
        status: "pending",
        state_id: null,
        city_id: null,
        modality_id: null,
      },
      loading: false,
      showRejectModal: false,
      rejectTarget: null,
      rejectReason: "",
      rejecting: false,
    };
  },
  created() {
    this.loadModalities();
    this.getCourtList();
  },
  methods: {
    statusLabel(status) {
      const map = { pending: "Pendente", approved: "Aprovada", rejected: "Rejeitada" };
      return map[status] ?? status;
    },

    statusBadgeClass(status) {
      const map = {
        pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        approved: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
        rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
      };
      return map[status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300";
    },

    async loadModalities() {
      try {
        const { data } = await api.get("/modalities/list");
        this.modalities = data.modalities ?? [];
      } catch (err) {
        console.error("Erro ao carregar modalidades:", err);
      }
    },

    applyFilters() {
      this.getCourtList(1);
    },

    onStateChange() {
      this.filters.city_id = null;
      this.applyFilters();
    },

    resetFilters() {
      this.filters = { status: "pending", state_id: null, city_id: null, modality_id: null };
      this.getCourtList(1);
    },

    async getCourtList(page = 1) {
      this.loading = true;
      try {
        const response = await api.get("/admin/courts", {
          params: {
            page,
            per_page: 15,
            status: this.filters.status || undefined,
            state_id: this.filters.state_id || undefined,
            city_id: this.filters.city_id || undefined,
            modality_id: this.filters.modality_id || undefined,
          },
        });
        this.courts = response.data.data;
        this.pagination = response.data;
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

    async approve(court) {
      const result = await Swal.fire({
        title: "Aprovar quadra",
        text: `Deseja aprovar a quadra "${court.name}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim, aprovar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      try {
        await api.post(`/admin/courts/${court.id}/approve`);
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Quadra aprovada!",
          showConfirmButton: false,
          timer: 3000,
        });
        this.getCourtList(this.pagination.current_page);
      } catch (err) {
        const message = err.response?.data?.error || "Erro ao aprovar quadra.";
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

    openRejectModal(court) {
      this.rejectTarget = court;
      this.rejectReason = "";
      this.showRejectModal = true;
    },

    closeRejectModal() {
      this.showRejectModal = false;
      this.rejectTarget = null;
      this.rejectReason = "";
    },

    async confirmReject() {
      if (!this.rejectTarget) return;
      this.rejecting = true;
      try {
        await api.post(`/admin/courts/${this.rejectTarget.id}/reject`, {
          reason: this.rejectReason || null,
        });
        this.closeRejectModal();
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Quadra rejeitada!",
          showConfirmButton: false,
          timer: 3000,
        });
        this.getCourtList(this.pagination.current_page);
      } catch (err) {
        const message = err.response?.data?.error || "Erro ao rejeitar quadra.";
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: message,
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.rejecting = false;
      }
    },
  },
};
</script>
