<template>
  <div class="relative">
    <!-- Header: navegação de mês -->
    <div class="flex items-center justify-between gap-2 mb-4">
      <button
        type="button"
        @click="prevMonth"
        aria-label="Mês anterior"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
      >
        ←
      </button>

      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-gray-800 dark:text-white">{{ monthLabel }}</span>
        <button
          type="button"
          @click="goToday"
          aria-label="Ir para o mês atual"
          class="rounded-lg border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
        >
          Hoje
        </button>
      </div>

      <button
        type="button"
        @click="nextMonth"
        aria-label="Próximo mês"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
      >
        →
      </button>
    </div>

    <!-- Cabeçalho dos dias da semana -->
    <div class="grid grid-cols-7 gap-1 mb-1">
      <div
        v-for="weekday in weekdays"
        :key="weekday"
        class="py-1 text-center text-xs font-semibold uppercase text-gray-400 dark:text-gray-500"
      >
        {{ weekday }}
      </div>
    </div>

    <!-- Grid de dias -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="cell in cells"
        :key="cell.key"
        class="group relative aspect-square rounded-lg border p-1 text-xs transition"
        :class="[
          cell.inCurrentMonth
            ? 'border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800'
            : 'border-transparent bg-gray-50/60 text-gray-400 dark:bg-gray-900/30 dark:text-gray-600',
          cell.isToday ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20' : '',
          cell.inCurrentMonth ? 'cursor-pointer hover:border-orange-500/40' : ''
        ]"
        @click="openDay(cell)"
      >
        <span
          class="font-medium"
          :class="cell.inCurrentMonth ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'"
        >
          {{ cell.dayNumber }}
        </span>

        <!-- Marcador: ponto neutro + contagem (apenas em dias com reservas) -->
        <div
          v-if="cell.count > 0"
          :title="dayTitle(cell)"
          class="absolute inset-x-0 bottom-1 flex items-center justify-center"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
          <span
            v-if="cell.count > 1"
            class="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white"
          >
            {{ cell.count }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center rounded-lg bg-white/60 dark:bg-gray-800/60"
    >
      <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default {
  name: "ReservationCalendar",
  props: {
    courtId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    const now = new Date()
    return {
      viewDate: new Date(now.getFullYear(), now.getMonth(), 1),
      countsByDay: {},
      loading: false,
      weekdays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    }
  },
  created() {
    this.fetchMonth()
  },
  watch: {
    courtId() {
      this.fetchMonth()
    },
  },
  computed: {
    monthLabel() {
      return `${MONTH_NAMES[this.viewDate.getMonth()]} de ${this.viewDate.getFullYear()}`
    },
    cells() {
      const year = this.viewDate.getFullYear()
      const month = this.viewDate.getMonth()
      const firstWeekday = new Date(year, month, 1).getDay()
      // Start grid on the Sunday on/before the 1st of the month.
      const start = new Date(year, month, 1 - firstWeekday)

      const today = new Date()
      const todayKey = this.localKey(today)

      const result = []
      for (let i = 0; i < 42; i++) {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
        const key = this.localKey(date)
        result.push({
          date,
          key,
          dayNumber: date.getDate(),
          inCurrentMonth: date.getMonth() === month,
          isToday: key === todayKey,
          count: this.countsByDay[key] || 0,
        })
      }
      return result
    },
  },
  methods: {
    pad2(n) {
      return String(n).padStart(2, '0')
    },
    localKey(date) {
      return `${date.getFullYear()}-${this.pad2(date.getMonth() + 1)}-${this.pad2(date.getDate())}`
    },
    monthParam() {
      return `${this.viewDate.getFullYear()}-${this.pad2(this.viewDate.getMonth() + 1)}`
    },
    async fetchMonth() {
      if (!this.courtId) return
      this.loading = true
      try {
        const response = await api.get(`/court-reservation/${this.courtId}/agenda`, {
          params: { month: this.monthParam() },
        })
        this.countsByDay = response.data?.days || {}
      } catch (err) {
        console.error('Erro ao carregar agenda do calendário:', err)
        this.countsByDay = {}
      } finally {
        this.loading = false
      }
    },
    prevMonth() {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1)
      this.fetchMonth()
    },
    nextMonth() {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1)
      this.fetchMonth()
    },
    goToday() {
      const now = new Date()
      this.viewDate = new Date(now.getFullYear(), now.getMonth(), 1)
      this.fetchMonth()
    },
    dayTitle(cell) {
      if (cell.count <= 0) return ''
      return cell.count === 1 ? '1 reserva' : `${cell.count} reservas`
    },
    openDay(cell) {
      if (!cell.inCurrentMonth) return
      this.$emit('select-day', cell.key)
    },
  },
}
</script>
