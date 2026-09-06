<template>
  <system-layout>
    <main class="py-8">
      <div class="w-full">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Meu Financeiro</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie seu saldo e acompanhe suas transações.</p>
        </div>

        <!-- Wallet Balance Card -->
        <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Saldo disponível</p>
              <p class="mt-1 text-3xl font-black text-gray-900 dark:text-white">
                {{ formatCurrency(balanceCents) }}
              </p>
            </div>

            <!-- Deposit Section -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">R$</span>
                <input
                  v-model="depositAmount"
                  type="text"
                  inputmode="decimal"
                  placeholder="0,00"
                  class="w-32 rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
              <select
                v-model="depositMethod"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option value="pix">Pix</option>
                <option value="boleto">Boleto</option>
              </select>
              <button
                @click="handleDeposit"
                :disabled="depositing || !depositAmount"
                class="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="depositing" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Depositar
              </button>
            </div>
          </div>
        </div>

        <!-- Transaction History -->
        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
          <!-- Header + Filter -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-200 dark:border-white/10">
            <h2 class="text-sm font-bold text-gray-800 dark:text-white">Histórico de Transações</h2>

            <select
              v-model="typeFilter"
              @change="fetchTransactions(1)"
              class="w-full sm:w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value="">Todos</option>
              <option value="deposit">Depósito</option>
              <option value="match_payment">Pagamento</option>
              <option value="refund">Reembolso</option>
            </select>
          </div>

          <!-- Loading -->
          <div v-if="loadingTransactions" class="flex items-center justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="transactions.data.length === 0"
            class="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            Nenhuma transação encontrada.
          </div>

          <!-- Transaction Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-100 dark:border-white/5">
                  <th class="px-5 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">Tipo</th>
                  <th class="px-5 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">Valor</th>
                  <th class="px-5 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">Taxa</th>
                  <th class="px-5 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">Descrição</th>
                  <th class="px-5 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th class="px-5 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">Data</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="tx in transactions.data"
                  :key="tx.id"
                  class="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <td class="px-5 py-3">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      :class="typeBadgeClass(tx.type)"
                    >
                      {{ typeLabel(tx.type) }}
                    </span>
                  </td>
                  <td class="px-5 py-3 font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(tx.amount_cents) }}
                  </td>
                  <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
                    {{ tx.fee_cents > 0 ? formatCurrency(tx.fee_cents) : '—' }}
                  </td>
                  <td class="px-5 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                    {{ tx.description || '—' }}
                  </td>
                  <td class="px-5 py-3">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      :class="statusBadgeClass(tx.status)"
                    >
                      {{ statusLabel(tx.status) }}
                    </span>
                  </td>
                  <td class="px-5 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {{ formatDate(tx.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-5 pb-4">
            <pagination-component :pagination="transactions" @change="fetchTransactions"></pagination-component>
          </div>
        </div>
      </div>

      <!-- Pix Payment Modal -->
      <div
        v-if="pixModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closePixModal"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ pixModal.method === 'boleto' ? 'Pague com Boleto' : 'Pague com Pix' }}
            </h3>
            <button
              @click="closePixModal"
              class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Pix -->
          <template v-if="pixModal.method !== 'boleto'">
            <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Escaneie o QR Code no app do seu banco ou copie o código Pix abaixo. O saldo é
              creditado automaticamente após a confirmação do pagamento.
            </p>

            <div
              v-if="pixModal.qrCodeBase64"
              class="mb-4 flex justify-center"
            >
              <img
                :src="pixQrCodeSrc"
                alt="QR Code Pix"
                class="h-52 w-52 rounded-lg border border-gray-200 dark:border-white/10"
              />
            </div>

            <div v-if="pixModal.copiaECola" class="space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Pix copia e cola
              </label>
              <textarea
                readonly
                :value="pixModal.copiaECola"
                rows="3"
                class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
              ></textarea>
              <button
                @click="copyPixCode"
                class="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {{ pixModal.copied ? 'Copiado!' : 'Copiar código Pix' }}
              </button>
            </div>
          </template>

          <!-- Boleto -->
          <template v-else>
            <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Copie a linha digitável abaixo e pague no app do seu banco. O saldo é creditado
              automaticamente após a compensação do boleto.
            </p>

            <p v-if="pixModal.boletoDueDate" class="mb-2 text-xs text-gray-500 dark:text-gray-400">
              Vencimento: {{ formatDate(pixModal.boletoDueDate) }}
            </p>

            <div v-if="pixModal.boletoLinhaDigitavel" class="space-y-2">
              <label class="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Linha digitável
              </label>
              <textarea
                readonly
                :value="pixModal.boletoLinhaDigitavel"
                rows="2"
                class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
              ></textarea>
              <button
                @click="copyBoletoCode"
                class="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {{ pixModal.copied ? 'Copiado!' : 'Copiar linha digitável' }}
              </button>
            </div>

            <a
              v-if="pixModal.boletoPdfUrl"
              :href="pixModal.boletoPdfUrl"
              target="_blank"
              rel="noopener"
              class="mt-2 block w-full rounded-lg border border-orange-500 px-4 py-2 text-center text-sm font-semibold text-orange-600 transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
            >
              Baixar boleto (PDF)
            </a>
          </template>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import api from "@/services/api.js";
import Swal from "@/services/swal.js";

export default {
  name: "MeuFinanceiro",
  components: {
    systemLayout,
    PaginationComponent,
  },
  data() {
    return {
      balanceCents: 0,
      depositAmount: '',
      depositMethod: 'pix',
      depositing: false,
      loadingTransactions: false,
      typeFilter: '',
      transactions: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      pixModal: {
        open: false,
        method: 'pix',
        copiaECola: '',
        qrCodeBase64: '',
        boletoLinhaDigitavel: '',
        boletoPdfUrl: '',
        boletoDueDate: '',
        copied: false,
      },
    }
  },
  computed: {
    pixQrCodeSrc() {
      if (!this.pixModal.qrCodeBase64) return ''
      // Backend may return the raw base64 or a full data URI.
      return this.pixModal.qrCodeBase64.startsWith('data:')
        ? this.pixModal.qrCodeBase64
        : `data:image/png;base64,${this.pixModal.qrCodeBase64}`
    },
  },
  async mounted() {
    this.handleGatewayReturn()
    await Promise.all([
      this.fetchBalance(),
      this.fetchTransactions(),
    ])
  },
  methods: {
    async fetchBalance() {
      try {
        const { data } = await api.get('/wallet/balance')
        this.balanceCents = data.balance_cents ?? 0
      } catch (err) {
        console.error('Erro ao carregar saldo:', err)
      }
    },

    async fetchTransactions(page = 1) {
      this.loadingTransactions = true
      try {
        const params = { page }
        if (this.typeFilter) {
          params.type = this.typeFilter
        }
        const { data } = await api.get('/wallet/transactions', { params })
        this.transactions = data

        // Update balance from transactions endpoint if available
        if (data.balance_cents !== undefined) {
          this.balanceCents = data.balance_cents
        }
      } catch (err) {
        console.error('Erro ao carregar transações:', err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar transações',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loadingTransactions = false
      }
    },

    async handleDeposit() {
      const amountCents = this.parseBrlToCents(this.depositAmount)

      if (!amountCents || amountCents <= 0) {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Informe um valor válido para depósito',
          showConfirmButton: false,
          timer: 3000,
        })
        return
      }

      const payload = { amount_cents: amountCents, payment_method: this.depositMethod }

      // Boleto requires payer identification.
      if (this.depositMethod === 'boleto') {
        const payer = await this.promptPayerData()
        if (!payer) return
        Object.assign(payload, payer)
      }

      this.depositing = true
      try {
        const { data } = await api.post('/wallet/deposit', payload)

        if (
          data.pix_copia_e_cola ||
          data.pix_qrcode_base64 ||
          data.boleto_linha_digitavel
        ) {
          // Inter gateway: show Pix QR / copia e cola or boleto digitable line.
          this.pixModal = {
            open: true,
            method: data.payment_method || this.depositMethod,
            copiaECola: data.pix_copia_e_cola || '',
            qrCodeBase64: data.pix_qrcode_base64 || '',
            boletoLinhaDigitavel: data.boleto_linha_digitavel || '',
            boletoPdfUrl: data.boleto_pdf_url || '',
            boletoDueDate: data.boleto_due_date || '',
            copied: false,
          }
          this.depositAmount = ''
        } else if (data.payment_url) {
          window.location.href = data.payment_url
        } else {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Depósito iniciado com sucesso',
            showConfirmButton: false,
            timer: 3000,
          })
          this.depositAmount = ''
          await this.fetchBalance()
          await this.fetchTransactions()
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao processar depósito'
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.depositing = false
      }
    },

    async promptPayerData() {
      const { value: formValues } = await Swal.fire({
        title: 'Dados para o boleto',
        html: `
          <input id="swal-payer-name" class="swal2-input" placeholder="Nome completo">
          <input id="swal-payer-document" class="swal2-input" placeholder="CPF ou CNPJ">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Gerar boleto',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f97316',
        preConfirm: () => {
          const name = document.getElementById('swal-payer-name').value.trim()
          const doc = document.getElementById('swal-payer-document').value.replace(/\D/g, '')
          if (!name || !doc) {
            Swal.showValidationMessage('Informe nome e CPF/CNPJ')
            return false
          }
          return { payer_name: name, payer_document: doc }
        },
      })

      return formValues || null
    },

    async copyPixCode() {
      await this.copyToClipboard(this.pixModal.copiaECola)
    },

    async copyBoletoCode() {
      await this.copyToClipboard(this.pixModal.boletoLinhaDigitavel)
    },

    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        this.pixModal.copied = true
        setTimeout(() => {
          this.pixModal.copied = false
        }, 2000)
      } catch {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Não foi possível copiar o código',
          showConfirmButton: false,
          timer: 3000,
        })
      }
    },

    closePixModal() {
      this.pixModal.open = false
      // Refresh so a completed payment (via webhook) reflects in the balance.
      this.fetchBalance()
      this.fetchTransactions()
    },

    handleGatewayReturn() {
      const status = this.$route.query.status
      if (!status) return

      if (status === 'success') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Depósito realizado com sucesso!',
          showConfirmButton: false,
          timer: 4000,
        })
      } else if (status === 'failed' || status === 'error') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Falha no depósito. Tente novamente.',
          showConfirmButton: false,
          timer: 4000,
        })
      }
    },

    parseBrlToCents(value) {
      if (!value) return 0
      // Handle both "10,50" and "10.50" formats
      const cleaned = value.replace(/\s/g, '').replace(',', '.')
      const parsed = parseFloat(cleaned)
      if (isNaN(parsed)) return 0
      return Math.round(parsed * 100)
    },

    formatCurrency(cents) {
      if (cents === null || cents === undefined) return 'R$ 0,00'
      const reais = cents / 100
      return reais.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      const date = new Date(dateStr)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    typeLabel(type) {
      const labels = {
        deposit: 'Depósito',
        match_payment: 'Pagamento',
        refund: 'Reembolso',
        fee: 'Taxa',
      }
      return labels[type] || type
    },

    typeBadgeClass(type) {
      const classes = {
        deposit: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
        match_payment: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
        refund: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
        fee: 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300',
      }
      return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300'
    },

    statusLabel(status) {
      const labels = {
        pending: 'Pendente',
        completed: 'Concluído',
        failed: 'Falhou',
        refunded: 'Estornado',
      }
      return labels[status] || status
    },

    statusBadgeClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
        completed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
        failed: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
        refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
      }
      return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300'
    },
  },
}
</script>
