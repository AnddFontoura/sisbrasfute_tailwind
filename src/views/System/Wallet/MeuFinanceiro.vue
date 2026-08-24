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
            <div class="flex items-center gap-3">
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
      depositing: false,
      loadingTransactions: false,
      typeFilter: '',
      transactions: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
    }
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

      this.depositing = true
      try {
        const { data } = await api.post('/wallet/deposit', {
          amount_cents: amountCents,
        })

        if (data.payment_url) {
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
