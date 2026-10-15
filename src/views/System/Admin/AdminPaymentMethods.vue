<template>
  <system-layout>
    <main class="py-8">
      <div class="mx-auto max-w-3xl">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Meios de Pagamento</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Escolha o gateway ativo, habilite os meios de pagamento disponíveis e defina o ambiente de operação.
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

        <div v-else class="space-y-6">
          <!-- Gateway ativo -->
          <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800">
            <h2 class="text-lg font-black text-gray-900 dark:text-white">Gateway ativo</h2>
            <p class="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
              Provedor usado para processar as cobranças da plataforma.
            </p>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div class="flex-1">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Gateway
                </label>
                <select
                  v-model="activeGateway"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option v-for="g in availableGateways" :key="g" :value="g">
                    {{ gatewayLabel(g) }}
                  </option>
                </select>
              </div>

              <button
                type="button"
                :disabled="savingGateway"
                @click="saveGateway"
                class="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50"
              >
                <svg v-if="savingGateway" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ savingGateway ? 'Salvando...' : 'Salvar gateway' }}
              </button>
            </div>
          </section>

          <!-- Meios habilitados por gateway -->
          <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800">
            <h2 class="text-lg font-black text-gray-900 dark:text-white">Meios de pagamento habilitados</h2>
            <p class="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
              Para cada gateway, marque os meios que ficarão disponíveis. Ao menos um deve permanecer ativo.
            </p>

            <div class="space-y-5">
              <div
                v-for="gw in configurableGateways"
                :key="gw"
                class="rounded-lg border border-gray-200 p-4 dark:border-white/10"
              >
                <div class="mb-3 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="font-black text-gray-900 dark:text-white">{{ gatewayLabel(gw) }}</span>
                    <span
                      v-if="gw === activeGatewayFromServer"
                      class="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-500"
                    >
                      Ativo
                    </span>
                  </div>

                  <button
                    type="button"
                    :disabled="savingMethods[gw]"
                    @click="saveMethods(gw)"
                    class="inline-flex items-center rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-gray-700 disabled:opacity-50 dark:bg-white/10 dark:hover:bg-white/20"
                  >
                    {{ savingMethods[gw] ? 'Salvando...' : 'Salvar' }}
                  </button>
                </div>

                <div class="flex flex-wrap gap-4">
                  <label
                    v-for="method in gateways[gw].supported"
                    :key="method"
                    class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    <input
                      type="checkbox"
                      :value="method"
                      v-model="enabledMethods[gw]"
                      class="size-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700"
                    >
                    {{ methodLabel(method) }}
                  </label>

                  <span
                    v-if="gateways[gw].supported.length === 0"
                    class="text-sm text-gray-400"
                  >
                    Nenhum meio suportado por este gateway.
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Ambiente por gateway -->
          <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800">
            <h2 class="text-lg font-black text-gray-900 dark:text-white">Ambiente</h2>
            <p class="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
              Defina se cada gateway opera em sandbox (testes) ou produção.
            </p>

            <div class="space-y-4">
              <div
                v-for="gw in configurableGateways"
                :key="gw"
                class="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-white/10 sm:flex-row sm:items-end"
              >
                <div class="flex-1">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    {{ gatewayLabel(gw) }}
                  </label>
                  <select
                    v-model="environments[gw]"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option v-for="env in availableEnvironments" :key="env" :value="env">
                      {{ environmentLabel(env) }}
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  :disabled="savingEnvironment[gw]"
                  @click="saveEnvironment(gw)"
                  class="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-700 disabled:opacity-50 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  {{ savingEnvironment[gw] ? 'Salvando...' : 'Salvar' }}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import Swal from "@/services/swal.js";
import {
  fetchPaymentGateway,
  updatePaymentGateway,
  fetchPaymentMethods,
  updatePaymentMethods,
  fetchPaymentEnvironment,
  updatePaymentEnvironment,
  methodLabel,
  gatewayLabel,
  environmentLabel,
} from "@/services/paymentConfigService.js";

export default {
  name: "AdminPaymentMethods",
  components: {
    systemLayout,
  },
  data() {
    return {
      loading: false,
      savingGateway: false,
      savingMethods: {},
      savingEnvironment: {},

      availableGateways: [],
      activeGateway: "",
      activeGatewayFromServer: "",

      gateways: {},
      enabledMethods: {},

      availableEnvironments: [],
      environments: {},
    };
  },
  created() {
    this.loadAll();
  },
  computed: {
    // Gateways que o admin pode configurar métodos/ambiente (exclui "null").
    configurableGateways() {
      return Object.keys(this.gateways).filter((gw) => gw !== "null");
    },
  },
  methods: {
    methodLabel,
    gatewayLabel,
    environmentLabel,

    async loadAll() {
      this.loading = true;
      try {
        const [gatewayData, methodsData, envData] = await Promise.all([
          fetchPaymentGateway(),
          fetchPaymentMethods(),
          fetchPaymentEnvironment(),
        ]);

        // Gateway ativo
        this.availableGateways = gatewayData.available || [];
        this.activeGateway = gatewayData.payment_gateway || "";

        // Métodos por gateway
        this.gateways = methodsData.gateways || {};
        this.activeGatewayFromServer = methodsData.active_gateway || "";
        const enabled = {};
        for (const gw of Object.keys(this.gateways)) {
          enabled[gw] = [...(this.gateways[gw].enabled || [])];
        }
        this.enabledMethods = enabled;

        // Ambiente por gateway
        this.availableEnvironments = envData.available || [];
        this.environments = { ...(envData.environments || {}) };
      } catch (err) {
        this.toast("error", err.response?.data?.message || "Erro ao carregar configurações de pagamento");
      } finally {
        this.loading = false;
      }
    },

    async saveGateway() {
      this.savingGateway = true;
      try {
        await updatePaymentGateway(this.activeGateway);
        this.activeGatewayFromServer = this.activeGateway;
        this.toast("success", "Gateway atualizado com sucesso!");
      } catch (err) {
        this.toast("error", err.response?.data?.message || "Erro ao salvar o gateway");
      } finally {
        this.savingGateway = false;
      }
    },

    async saveMethods(gateway) {
      const methods = this.enabledMethods[gateway] || [];
      if (methods.length === 0) {
        this.toast("warning", "Selecione ao menos um meio de pagamento.");
        return;
      }

      this.savingMethods = { ...this.savingMethods, [gateway]: true };
      try {
        const data = await updatePaymentMethods(gateway, methods);
        // Reflete a normalização feita pelo backend.
        this.enabledMethods = { ...this.enabledMethods, [gateway]: [...(data.enabled || methods)] };
        this.toast("success", `Meios de pagamento do ${gatewayLabel(gateway)} salvos!`);
      } catch (err) {
        this.toast("error", err.response?.data?.message || "Erro ao salvar os meios de pagamento");
      } finally {
        this.savingMethods = { ...this.savingMethods, [gateway]: false };
      }
    },

    async saveEnvironment(gateway) {
      this.savingEnvironment = { ...this.savingEnvironment, [gateway]: true };
      try {
        await updatePaymentEnvironment(gateway, this.environments[gateway]);
        this.toast("success", `Ambiente do ${gatewayLabel(gateway)} atualizado!`);
      } catch (err) {
        this.toast("error", err.response?.data?.message || "Erro ao salvar o ambiente");
      } finally {
        this.savingEnvironment = { ...this.savingEnvironment, [gateway]: false };
      }
    },

    toast(icon, title) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon,
        title,
        showConfirmButton: false,
        timer: icon === "success" ? 2500 : 3000,
      });
    },
  },
};
</script>
