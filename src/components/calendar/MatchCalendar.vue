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
          cell.matches.length > 0 ? 'cursor-pointer hover:border-orange-500/40' : ''
        ]"
        @click="openDay(cell)"
      >
        <span
          class="font-medium"
          :class="cell.inCurrentMonth ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'"
        >
          {{ cell.dayNumber }}
        </span>

        <!-- Marcador de bola + popover -->
        <div
          v-if="cell.matches.length > 0"
          tabindex="0"
          :title="dayTitle(cell)"
          class="absolute inset-x-0 bottom-1 flex items-center justify-center outline-none"
        >
          <span class="text-base leading-none">⚽</span>
          <span
            v-if="cell.matches.length > 1"
            class="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white"
          >
            {{ cell.matches.length }}
          </span>

          <!-- Popover (hover/focus) -->
          <div
            class="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2 w-56 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3 text-left shadow-lg opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              v-for="(match, index) in cell.matches"
              :key="match.id ?? index"
              class="text-xs"
              :class="index > 0 ? 'mt-2 border-t border-gray-100 pt-2 dark:border-gray-700' : ''"
            >
              <p class="font-semibold text-gray-900 dark:text-white">{{ matchLabel(match) }}</p>
              <p v-if="match.schedule_br" class="mt-0.5 text-gray-500 dark:text-gray-400">{{ match.schedule_br }}</p>
              <p v-if="cityLabel(match)" class="text-gray-500 dark:text-gray-400">{{ cityLabel(match) }}</p>
            </div>
          </div>
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
  name: "MatchCalendar",
  props: {
    teamId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    const now = new Date()
    return {
      viewDate: new Date(now.getFullYear(), now.getMonth(), 1),
      matchesByDay: {},
      loading: false,
      weekdays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    }
  },
  created() {
    this.fetchMonth()
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
          matches: this.matchesByDay[key] || [],
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
    firstDayKey() {
      const d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1)
      return this.localKey(d)
    },
    lastDayKey() {
      const lastDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0).getDate()
      const d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), lastDay)
      return this.localKey(d)
    },
    async fetchMonth() {
      this.loading = true
      const dateStart = this.firstDayKey()
      const dateEnd = this.lastDayKey()
      const collected = []
      try {
        let page = 1
        let lastPage = 1
        do {
          const response = await api.get('/matches', {
            params: {
              page,
              teamId: this.teamId,
              date_start: dateStart,
              date_end: dateEnd,
            }
          })
          const payload = response.data || {}
          const pageData = payload.data || []
          collected.push(...pageData)
          lastPage = payload.last_page || 1
          page = (payload.current_page || page) + 1
        } while (page <= lastPage)

        const grouped = {}
        collected.forEach((match) => {
          if (!match.schedule) return
          const key = this.localKey(new Date(match.schedule))
          if (!grouped[key]) grouped[key] = []
          grouped[key].push(match)
        })
        this.matchesByDay = grouped
      } catch (err) {
        console.error('Erro ao carregar partidas do calendário:', err)
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
    hasScore(match) {
      return match.my_team_score !== null && match.enemy_team_score !== null
    },
    matchLabel(match) {
      const my = match.my_team_name || 'Meu Time'
      const enemy = match.enemy_team_name || 'Adversário'
      if (this.hasScore(match)) {
        const myPen = match.has_penalties ? ` (${match.my_team_penalty_score})` : ''
        const enemyPen = match.has_penalties ? `(${match.enemy_team_penalty_score}) ` : ''
        return `${my} ${match.my_team_score}${myPen} x ${enemyPen}${match.enemy_team_score} ${enemy}`
      }
      return `${my} VS ${enemy}`
    },
    cityLabel(match) {
      const city = match.city_info?.name
      const state = match.city_info?.state_info?.name
      if (city && state) return `${city} / ${state}`
      return city || ''
    },
    dayTitle(cell) {
      return cell.matches.map((match) => {
        const parts = [this.matchLabel(match)]
        if (match.schedule_br) parts.push(match.schedule_br)
        const city = this.cityLabel(match)
        if (city) parts.push(city)
        return parts.join(' — ')
      }).join('\n')
    },
    openDay(cell) {
      if (cell.matches.length === 0) return
      this.$router.push({
        name: 'team-matches-list',
        params: { teamId: this.teamId },
        query: { date_start: cell.key, date_end: cell.key },
      })
    },
  },
}
</script>
