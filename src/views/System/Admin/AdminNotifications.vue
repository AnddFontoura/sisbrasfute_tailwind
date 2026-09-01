<template>
  <system-layout>
    <main class="py-8">
      <div>
        <!-- Header -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">Administração - Notificações</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Envie notificações e acompanhe o histórico de envios. Notificações enviadas aqui também vão por e-mail.
            </p>
          </div>
          <button
            type="button"
            @click="openSendModal"
            class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nova Notificação
          </button>
        </div>

        <!-- Filters -->
        <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Título</label>
              <input
                v-model="filters.title"
                type="text"
                placeholder="Filtrar por título..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @input="debouncedFetch"
              >
            </div>
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
          Nenhuma notificação enviada.
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
          <table class="w-full text-sm text-left">
            <thead class="border-b border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Título</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Tipo</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Destinatários</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Enviada em</th>
                <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-white/5">
              <tr
                v-for="item in notifications"
                :key="item.id"
                class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">{{ item.title }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="typeBadgeClass(item.type)"
                  >
                    {{ typeLabel(item.type) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ item.recipients_count ?? '—' }}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ formatDate(item.created_at) }}</td>
                <td class="px-4 py-3">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-md bg-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors"
                    @click="openEditModal(item)"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <pagination-component :pagination="pagination" @change="fetchNotifications"></pagination-component>
      </div>
    </main>

    <!-- Send Modal -->
    <Teleport to="body">
      <div
        v-if="showSendModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showSendModal = false"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nova Notificação</h2>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition dark:hover:bg-gray-700 dark:hover:text-gray-200"
              @click="showSendModal = false"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSend" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Tipo *</label>
                <select
                  v-model="sendForm.type"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="system">Sistema</option>
                  <option value="team">Equipe</option>
                  <option value="game">Jogo</option>
                </select>
                <p v-if="sendErrors.type" class="mt-1 text-xs text-red-600">{{ sendErrors.type[0] }}</p>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Público *</label>
                <select
                  v-model="sendForm.audience"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Todos os usuários</option>
                  <option value="users">Usuários específicos</option>
                  <option value="team">Jogadores de um time</option>
                  <option value="match">Jogadores de uma partida</option>
                </select>
                <p v-if="sendErrors.audience" class="mt-1 text-xs text-red-600">{{ sendErrors.audience[0] }}</p>
              </div>
            </div>

            <!-- Audience: users -->
            <div v-if="sendForm.audience === 'users'">
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Buscar usuários</label>
              <input
                v-model="userSearch"
                type="text"
                placeholder="Digite o nome ou email..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @input="debouncedUserSearch"
              >
              <div v-if="userResults.length" class="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10">
                <button
                  v-for="u in userResults"
                  :key="u.id"
                  type="button"
                  class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                  @click="toggleUser(u)"
                >
                  <span class="text-gray-800 dark:text-gray-200">{{ u.name }} <span class="text-gray-400">({{ u.email }})</span></span>
                  <span v-if="isUserSelected(u.id)" class="text-orange-500 font-bold">✓</span>
                </button>
              </div>
              <div v-if="selectedUsers.length" class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="u in selectedUsers"
                  :key="u.id"
                  class="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-800 dark:bg-orange-500/20 dark:text-orange-300"
                >
                  {{ u.name }}
                  <button type="button" class="font-bold" @click="removeUser(u.id)">×</button>
                </span>
              </div>
              <p v-if="sendErrors.userIds" class="mt-1 text-xs text-red-600">{{ sendErrors.userIds[0] }}</p>
            </div>

            <!-- Audience: team -->
            <div v-if="sendForm.audience === 'team'">
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Buscar time</label>
              <input
                v-model="teamSearch"
                type="text"
                placeholder="Digite o nome do time..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @input="debouncedTeamSearch"
              >
              <div v-if="teamResults.length" class="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10">
                <button
                  v-for="t in teamResults"
                  :key="t.id"
                  type="button"
                  class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                  @click="selectTeam(t)"
                >
                  <span class="text-gray-800 dark:text-gray-200">{{ t.name }}</span>
                  <span v-if="sendForm.teamId === t.id" class="text-orange-500 font-bold">✓</span>
                </button>
              </div>
              <p v-if="selectedTeamName" class="mt-2 text-sm text-gray-600 dark:text-gray-300">Time selecionado: <strong>{{ selectedTeamName }}</strong></p>
              <p v-if="sendErrors.teamId" class="mt-1 text-xs text-red-600">{{ sendErrors.teamId[0] }}</p>
            </div>

            <!-- Audience: match -->
            <div v-if="sendForm.audience === 'match'">
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Buscar partida (nome do time)</label>
              <input
                v-model="matchSearch"
                type="text"
                placeholder="Digite o nome do time da partida..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @input="debouncedMatchSearch"
              >
              <div v-if="matchResults.length" class="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10">
                <button
                  v-for="m in matchResults"
                  :key="m.id"
                  type="button"
                  class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                  @click="selectMatch(m)"
                >
                  <span class="text-gray-800 dark:text-gray-200">
                    #{{ m.id }} — {{ m.my_team_name }} vs {{ m.enemy_team_name || 'A definir' }} <span class="text-gray-400">({{ m.schedule_br || '' }})</span>
                  </span>
                  <span v-if="sendForm.matchId === m.id" class="text-orange-500 font-bold">✓</span>
                </button>
              </div>
              <p v-if="selectedMatchLabel" class="mt-2 text-sm text-gray-600 dark:text-gray-300">Partida selecionada: <strong>{{ selectedMatchLabel }}</strong></p>
              <p v-if="sendErrors.matchId" class="mt-1 text-xs text-red-600">{{ sendErrors.matchId[0] }}</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Título *</label>
              <input
                v-model="sendForm.title"
                type="text"
                maxlength="254"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
              <p v-if="sendErrors.title" class="mt-1 text-xs text-red-600">{{ sendErrors.title[0] }}</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Descrição *</label>
              <textarea
                v-model="sendForm.description"
                rows="4"
                maxlength="10000"
                placeholder="Conteúdo da notificação..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              ></textarea>
              <p v-if="sendErrors.description" class="mt-1 text-xs text-red-600">{{ sendErrors.description[0] }}</p>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="showSendModal = false"
                class="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="sending"
                class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="sending" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                {{ sending ? 'Enviando...' : 'Enviar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showEditModal = false"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Editar Notificação</h2>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition dark:hover:bg-gray-700 dark:hover:text-gray-200"
              @click="showEditModal = false"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p class="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
            A edição atualiza a notificação para todos os destinatários que já a receberam.
          </p>

          <form @submit.prevent="handleUpdate" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Tipo *</label>
              <select
                v-model="editForm.type"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="system">Sistema</option>
                <option value="team">Equipe</option>
                <option value="game">Jogo</option>
              </select>
              <p v-if="editErrors.type" class="mt-1 text-xs text-red-600">{{ editErrors.type[0] }}</p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Título *</label>
              <input
                v-model="editForm.title"
                type="text"
                maxlength="254"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
              <p v-if="editErrors.title" class="mt-1 text-xs text-red-600">{{ editErrors.title[0] }}</p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Descrição *</label>
              <textarea
                v-model="editForm.description"
                rows="4"
                maxlength="10000"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              ></textarea>
              <p v-if="editErrors.description" class="mt-1 text-xs text-red-600">{{ editErrors.description[0] }}</p>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="showEditModal = false"
                class="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ saving ? 'Salvando...' : 'Salvar alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import { notificationsService } from "@/services/notificationsService";
import Swal from "@/services/swal.js";

export default {
  name: "AdminNotifications",
  components: {
    systemLayout,
    PaginationComponent,
  },
  data() {
    return {
      notifications: [],
      pagination: { data: [], current_page: 1, last_page: 1 },
      filters: { title: "", type: "", date_start: "", date_end: "" },
      loading: false,
      debounceTimer: null,

      // Send modal
      showSendModal: false,
      sending: false,
      sendForm: { type: "system", audience: "all", title: "", description: "", teamId: null, matchId: null },
      sendErrors: {},

      // User picker
      userSearch: "",
      userResults: [],
      selectedUsers: [],
      userSearchTimer: null,

      // Team picker
      teamSearch: "",
      teamResults: [],
      selectedTeamName: "",
      teamSearchTimer: null,

      // Match picker
      matchSearch: "",
      matchResults: [],
      selectedMatchLabel: "",
      matchSearchTimer: null,

      // Edit modal
      showEditModal: false,
      saving: false,
      editForm: { id: null, type: "system", title: "", description: "" },
      editErrors: {},
    };
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
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
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    },

    debouncedFetch() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.fetchNotifications(1), 400);
    },

    async fetchNotifications(page = 1) {
      this.loading = true;
      try {
        const params = { page, per_page: 15 };
        if (this.filters.title) params.title = this.filters.title;
        if (this.filters.type) params.type = this.filters.type;
        if (this.filters.date_start) params.date_start = this.filters.date_start;
        if (this.filters.date_end) params.date_end = this.filters.date_end;

        const response = await notificationsService.adminList(params);
        this.notifications = response.data.data;
        this.pagination = response.data;
      } catch {
        this.toastError("Erro ao carregar notificações");
      } finally {
        this.loading = false;
      }
    },

    /* ---- Send ---- */
    openSendModal() {
      this.sendForm = { type: "system", audience: "all", title: "", description: "", teamId: null, matchId: null };
      this.sendErrors = {};
      this.userSearch = "";
      this.userResults = [];
      this.selectedUsers = [];
      this.teamSearch = "";
      this.teamResults = [];
      this.selectedTeamName = "";
      this.matchSearch = "";
      this.matchResults = [];
      this.selectedMatchLabel = "";
      this.showSendModal = true;
    },

    debouncedUserSearch() {
      clearTimeout(this.userSearchTimer);
      this.userSearchTimer = setTimeout(this.searchUsers, 400);
    },
    async searchUsers() {
      if (!this.userSearch.trim()) {
        this.userResults = [];
        return;
      }
      try {
        const { data } = await api.get("/admin/users", { params: { name: this.userSearch, per_page: 10 } });
        this.userResults = data.data || [];
      } catch {
        this.userResults = [];
      }
    },
    isUserSelected(id) {
      return this.selectedUsers.some((u) => u.id === id);
    },
    toggleUser(u) {
      if (this.isUserSelected(u.id)) {
        this.removeUser(u.id);
      } else {
        this.selectedUsers.push({ id: u.id, name: u.name });
      }
    },
    removeUser(id) {
      this.selectedUsers = this.selectedUsers.filter((u) => u.id !== id);
    },

    debouncedTeamSearch() {
      clearTimeout(this.teamSearchTimer);
      this.teamSearchTimer = setTimeout(this.searchTeams, 400);
    },
    async searchTeams() {
      if (!this.teamSearch.trim()) {
        this.teamResults = [];
        return;
      }
      try {
        const { data } = await api.get("/admin/teams", { params: { name: this.teamSearch, per_page: 10 } });
        this.teamResults = data.data || [];
      } catch {
        this.teamResults = [];
      }
    },
    selectTeam(t) {
      this.sendForm.teamId = t.id;
      this.selectedTeamName = t.name;
      this.teamResults = [];
    },

    debouncedMatchSearch() {
      clearTimeout(this.matchSearchTimer);
      this.matchSearchTimer = setTimeout(this.searchMatches, 400);
    },
    async searchMatches() {
      if (!this.matchSearch.trim()) {
        this.matchResults = [];
        return;
      }
      try {
        const { data } = await api.get("/admin/matches", { params: { team_name: this.matchSearch, per_page: 10 } });
        this.matchResults = data.data || [];
      } catch {
        this.matchResults = [];
      }
    },
    selectMatch(m) {
      this.sendForm.matchId = m.id;
      this.selectedMatchLabel = `#${m.id} — ${m.my_team_name} vs ${m.enemy_team_name || "A definir"}`;
      this.matchResults = [];
    },

    async handleSend() {
      this.sendErrors = {};
      this.sending = true;
      try {
        const payload = {
          type: this.sendForm.type,
          audience: this.sendForm.audience,
          title: this.sendForm.title,
          description: this.sendForm.description,
        };
        if (this.sendForm.audience === "users") {
          payload.userIds = this.selectedUsers.map((u) => u.id);
        } else if (this.sendForm.audience === "team") {
          payload.teamId = this.sendForm.teamId;
        } else if (this.sendForm.audience === "match") {
          payload.matchId = this.sendForm.matchId;
        }

        await notificationsService.adminSend(payload);

        this.showSendModal = false;
        await this.fetchNotifications(1);
        this.toastSuccess("Notificação enviada!");
      } catch (err) {
        if (err.response?.status === 422 && err.response.data?.errors) {
          this.sendErrors = err.response.data.errors;
        } else {
          this.toastError(err.response?.data?.message || "Erro ao enviar notificação.");
        }
      } finally {
        this.sending = false;
      }
    },

    /* ---- Edit ---- */
    openEditModal(item) {
      this.editForm = {
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
      };
      this.editErrors = {};
      this.showEditModal = true;
    },
    async handleUpdate() {
      this.editErrors = {};
      this.saving = true;
      try {
        await notificationsService.adminUpdate(this.editForm.id, {
          type: this.editForm.type,
          title: this.editForm.title,
          description: this.editForm.description,
        });
        this.showEditModal = false;
        await this.fetchNotifications(this.pagination.current_page || 1);
        this.toastSuccess("Notificação atualizada!");
      } catch (err) {
        if (err.response?.status === 422 && err.response.data?.errors) {
          this.editErrors = err.response.data.errors;
        } else {
          this.toastError(err.response?.data?.message || "Erro ao atualizar notificação.");
        }
      } finally {
        this.saving = false;
      }
    },

    toastSuccess(title) {
      Swal.fire({ toast: true, position: "top-end", icon: "success", title, showConfirmButton: false, timer: 2000 });
    },
    toastError(title) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title, showConfirmButton: false, timer: 3000 });
    },
  },
};
</script>
