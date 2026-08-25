<template>
  <system-layout>
    <main class="py-8">
      <div>
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Configuração de Taxa</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure o tipo e valor da taxa cobrada por posição em partidas.
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
        </div>

        <!-- Form -->
        <div v-else class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <form @submit.prevent="saveFeeConfig">
            <!-- Fee Type -->
            <div class="mb-5">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Tipo de taxa
              </label>
              <select
                v-model="form.fee_type"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="fixed">Valor fixo</option>
                <option value="percentage">Percentual</option>
              </select>
            </div>

            <!-- Fee Value -->
            <div class="mb-5">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Valor da taxa
              </label>
              <input
                v-model.number="form.fee_value"
                type="number"
                min="0"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 500"
              >
            </div>

            <!-- Explanation -->
            <div class="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
              <strong>Valor fixo:</strong> valor em centavos (ex: 500 = R$5,00).<br>
              <strong>Percentual:</strong> em pontos base (ex: 500 = 5%).
            </div>

            <!-- Submit -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="saving"
                class="inline-flex items-center rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50"
              >
                <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ saving ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
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
  name: "AdminFeeConfig",
  components: {
    systemLayout,
  },
  data() {
    return {
      form: {
        fee_type: "fixed",
        fee_value: 500,
      },
      loading: false,
      saving: false,
    };
  },
  created() {
    this.loadFeeConfig();
  },
  methods: {
    async loadFeeConfig() {
      this.loading = true;
      try {
        const response = await api.get("/admin/config/fee");
        this.form.fee_type = response.data.fee_type || "fixed";
        this.form.fee_value = Number(response.data.fee_value) || 0;
      } catch {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar configuração de taxa",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
    async saveFeeConfig() {
      this.saving = true;
      try {
        await api.put("/admin/config/fee", {
          fee_type: this.form.fee_type,
          fee_value: this.form.fee_value,
        });
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Configuração salva com sucesso!",
          showConfirmButton: false,
          timer: 2500,
        });
      } catch (err) {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: err.response?.data?.message || "Erro ao salvar configuração",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
