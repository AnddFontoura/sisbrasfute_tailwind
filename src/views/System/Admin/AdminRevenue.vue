<template>
  <system-layout>
    <main class="py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Receita do Sistema</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Acompanhe a receita gerada pelas taxas cobradas nas partidas.
          </p>
        </div>

        <!-- Total Revenue Card -->
        <div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Receita Total</p>
          <p class="text-3xl font-black text-gray-900 dark:text-white">
            {{ formatCurrency(totalRevenue) }}
          </p>
        </div>

        <!-- Date Range Filter -->
        <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Data início</label>
              <input
                v-model="filters.date_start"
                type="date"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Data fim</label>
              <input
                v-model="filters.date_end"
                type="date"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
            </div>
            <div>
              <button
                type="button"
                class="w-full inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                @click="fetchRevenue"
              >
                Filtrar
              </button>
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
        <div v-else-if="entries.length === 0" class="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          Nenhum registro de receita encontrado para o período selecionado.
        </div>

        <!-- Entries Table -->
        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
          <table class="w-full text-sm text-left">
            <thead class="border-b border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Data</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Tipo</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 text-right">Valor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-white/5">
              <tr
                v-for="entry in entries"
                :key="entry.id"
                class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <td class="px-4 py-3 text-gray-900 dark:text-white">{{ formatDate(entry.created_at) }}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ entry.type }}</td>
                <td class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">{{ formatCurrency(entry.amount_cents) }}</td>
              </tr>
            </tbody>
          </table>
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
  name: "AdminRevenue",
  components: {
    systemLayout,
  },
  data() {
    return {
      totalRevenue: 0,
      entries: [],
      filters: {
        date_start: "",
        date_end: "",
      },
      loading: false,
    };
  },
  created() {
    this.fetchRevenue();
  },
  methods: {
    async fetchRevenue() {
      this.loading = true;
      try {
        const params = {};
        if (this.filters.date_start) {
          params.date_start = this.filters.date_start;
        }
        if (this.filters.date_end) {
          params.date_end = this.filters.date_end;
        }

        const response = await api.get("/admin/revenue", { params });
        this.totalRevenue = response.data.total_cents || 0;
        this.entries = response.data.entries || [];
      } catch {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar dados de receita",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
    formatCurrency(cents) {
      const value = (cents || 0) / 100;
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
    formatDate(dateStr) {
      if (!dateStr) return "—";
      const date = new Date(dateStr);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>
