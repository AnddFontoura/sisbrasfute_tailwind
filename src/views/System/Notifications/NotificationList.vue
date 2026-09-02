<template>
  <system-layout>
    <main class="py-8">
      <div>
        <!-- Header -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">Notificações</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Acompanhe tudo que acontece nos seus times e partidas.
            </p>
          </div>
          <button
            type="button"
            @click="markAllRead"
            :disabled="markingAll"
            class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition disabled:opacity-50"
          >
            Marcar todas como lidas
          </button>
        </div>

        <!-- Filters -->
        <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Tipo</label>
              <select
                v-model="filters.type"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="fetchNotifications(1)"
              >
                <option value="">Todos</option>
                <option value="game">Jogo</option>
                <option value="team">Equipe</option>
                <option value="system">Sistema</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Data inicial</label>
              <input
                v-model="filters.date_start"
                type="date"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="fetchNotifications(1)"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Data final</label>
              <input
                v-model="filters.date_end"
                type="date"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="fetchNotifications(1)"
              >
            </div>
            <div class="flex items-end">
              <label class="text-xs font-semibold text-gray-600 dark:text-gray-300 mr-2">Por página:</label>
              <select
                v-model="perPage"
                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="fetchNotifications(1)"
              >
                <option :value="10">10</option>
                <option :value="15">15</option>
                <option :value="30">30</option>
                <option :value="50">50</option>
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
        <div v-else-if="notifications.length === 0" class="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          Nenhuma notificação encontrada.
        </div>

        <!-- List -->
        <div v-else class="space-y-3">
          <button
            v-for="item in notifications"
            :key="item.id"
            type="button"
            @click="onItemClick(item)"
            class="flex w-full items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow dark:border-white/10 dark:bg-gray-800 dark:hover:border-orange-500/40"
            :class="{ 'ring-1 ring-orange-500/40': !item.read_at }"
          >
            <span
              :class="[
                item.read_at ? 'bg-gray-300 dark:bg-gray-600' : 'bg-orange-500',
                'mt-1.5 size-2.5 shrink-0 rounded-full'
              ]"
            ></span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  :class="typeBadgeClass(notif(item).type)"
                >
                  {{ typeLabel(notif(item).type) }}
                </span>
                <span class="text-xs text-gray-400">{{ formatDate(item.created_at) }}</span>
              </div>
              <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                {{ notif(item).title }}
              </p>
              <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {{ notif(item).description }}
              </p>

              <span
                v-if="targetLink(item)"
                class="mt-2 inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600"
              >
                {{ targetLink(item).label }}
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </button>
        </div>

        <!-- Pagination -->
        <pagination-component :pagination="pagination" @change="fetchNotifications"></pagination-component>
      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import { notificationsService } from "@/services/notificationsService";
import { useNotificationsStore } from "@/stores/notifications.js";
import Swal from "@/services/swal.js";

export default {
  name: "NotificationList",
  components: {
    systemLayout,
    PaginationComponent,
  },
  setup() {
    const notificationsStore = useNotificationsStore();
    return { notificationsStore };
  },
  data() {
    return {
      notifications: [],
      pagination: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      filters: {
        type: "",
        date_start: "",
        date_end: "",
      },
      perPage: 15,
      loading: false,
      markingAll: false,
    };
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    notif(item) {
      return item.notification_info || item.notificationInfo || {};
    },

    targetLink(item) {
      const n = this.notif(item);
      if (n.match_id) {
        return { label: "Ver partida", to: `/matches/show/${n.match_id}` };
      }
      if (n.team_id) {
        return { label: "Ver time", to: `/team/show/${n.team_id}` };
      }
      return null;
    },

    typeLabel(type) {
      return { game: "Jogo", team: "Equipe", system: "Sistema" }[type] || "Sistema";
    },

    typeBadgeClass(type) {
      const map = {
        game: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
        team: "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
        system: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
      };
      return map[type] || map.system;
    },

    formatDate(value) {
      if (!value) return "";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    async fetchNotifications(page = 1) {
      this.loading = true;
      try {
        const params = { page, per_page: this.perPage };
        if (this.filters.type) params.type = this.filters.type;
        if (this.filters.date_start) params.date_start = this.filters.date_start;
        if (this.filters.date_end) params.date_end = this.filters.date_end;

        const response = await notificationsService.list(params);
        this.notifications = response.data.data;
        this.pagination = response.data;
      } catch {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar notificações",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    async onItemClick(item) {
      if (!item.read_at) {
        try {
          await notificationsService.markAsRead(item.id);
          item.read_at = new Date().toISOString();
          this.notificationsStore.fetchUnreadCount();
        } catch {
          // ignore
        }
      }

      const link = this.targetLink(item);
      if (link) {
        this.$router.push(link.to);
      }
    },

    async markAllRead() {
      this.markingAll = true;
      try {
        await this.notificationsStore.markAllAsRead();
        this.notifications.forEach((n) => {
          if (!n.read_at) n.read_at = new Date().toISOString();
        });
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Todas marcadas como lidas!",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao marcar como lidas",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.markingAll = false;
      }
    },
  },
};
</script>
