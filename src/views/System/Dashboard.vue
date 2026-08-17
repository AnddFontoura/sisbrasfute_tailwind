<template>
  <system-layout>
    <main class="py-8">
      <div class="w-full">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Painel</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Acesse rapidamente as funcionalidades do sistema.</p>
        </div>

        <!-- Email Verification Warning Banner -->
        <div
          v-if="!isEmailVerified"
          class="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-500/30 dark:bg-amber-500/10"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p class="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ Você precisa verificar seu email para criar times, jogadores e partidas. Verifique sua caixa de entrada ou clique no botão abaixo.
            </p>
            <button
              @click="handleResendVerification"
              :disabled="resendingVerification"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="resendingVerification"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Reenviar email de verificação
            </button>
          </div>
        </div>

        <!-- Grid de acessos rápidos -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="item in menuItems"
            :key="item.key"
            class="relative"
          >
            <!-- Card ativo -->
            <component
              :is="item.disabled ? 'div' : 'router-link'"
              :to="item.disabled ? undefined : item.to"
              class="block"
            >
              <div
                class="relative overflow-hidden rounded-2xl border p-5 transition-all duration-200"
                :class="item.disabled
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60 dark:border-gray-700 dark:bg-gray-800/50'
                  : 'border-gray-200 bg-white shadow-sm hover:border-orange-500/40 hover:shadow-md hover:-translate-y-1 cursor-pointer dark:border-white/10 dark:bg-gray-800 dark:hover:border-orange-500/40'"
              >
                <!-- Ícone -->
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl mb-3"
                  :class="item.disabled ? 'bg-gray-200 dark:bg-gray-700' : 'bg-orange-500/10'"
                >
                  <span
                    v-html="item.icon"
                    class="w-6 h-6"
                    :class="item.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-orange-500'"
                  ></span>
                </div>

                <!-- Label -->
                <p
                  class="text-sm font-bold"
                  :class="item.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'"
                >
                  {{ item.label }}
                </p>
                <p
                  v-if="item.description"
                  class="mt-1 text-xs"
                  :class="item.disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'"
                >
                  {{ item.description }}
                </p>

                <!-- Badge "Em breve" or "Verifique seu email" -->
                <div
                  v-if="item.disabled"
                  class="absolute top-3 right-3 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-400 dark:bg-orange-500/20"
                >
                  {{ item.disabledReason === 'verification' ? 'Verifique seu email' : 'Em breve' }}
                </div>
              </div>
            </component>
          </div>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import { useAuthStore } from "@/stores/auth.js";
import api from "@/services/api.js";
import Swal from "@/services/swal.js";

export default {
  name: "Dashboard",
  components: {
    systemLayout,
  },
  data() {
    return {
      resendingVerification: false,
      icons: {
        team: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>',
        players: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>',
        friendly: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>',
        trophy: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.768.451-2.427.862a4.49 4.49 0 00.218 3.897c.394.7.942 1.283 1.592 1.707M18.75 4.236c.996.178 1.768.451 2.427.862a4.49 4.49 0 01-.218 3.897c-.394.7-.942 1.283-1.592 1.707M12 2.25c.966 0 1.89.166 2.75.469M12 2.25a7.5 7.5 0 00-2.75.469"/></svg>',
        field: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/></svg>',
        settings: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
        profile: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
        admin: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>',
        matches: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>',
      },
    }
  },
  computed: {
    isEmailVerified() {
      const authStore = useAuthStore()
      return authStore.isEmailVerified
    },
    isAdmin() {
      const authStore = useAuthStore()
      return authStore.isAdmin
    },
    menuItems() {
      return [
        {
          key: 'team',
          label: 'Times',
          description: 'Gerencie seus times',
          icon: this.icons.team,
          to: '/team/list',
          disabled: !this.isEmailVerified,
          disabledReason: !this.isEmailVerified ? 'verification' : null,
        },
        {
          key: 'players',
          label: 'Jogadores',
          description: 'Lista de jogadores',
          icon: this.icons.players,
          to: '/player-profile/list',
          disabled: false,
          disabledReason: null,
        },
        {
          key: 'matches',
          label: 'Partidas',
          description: 'Veja as partidas',
          icon: this.icons.matches,
          to: '/matches/list',
          disabled: !this.isEmailVerified,
          disabledReason: !this.isEmailVerified ? 'verification' : null,
        },
        {
          key: 'friendly',
          label: 'Amistosos',
          description: 'Partidas amistosas',
          icon: this.icons.friendly,
          to: '/friendly-matches/list',
          disabled: true,
          disabledReason: 'coming_soon',
        },
        {
          key: 'trophy',
          label: 'Campeonatos',
          description: 'Torneios e competições',
          icon: this.icons.trophy,
          to: '/championships/list',
          disabled: true,
          disabledReason: 'coming_soon',
        },
        {
          key: 'field',
          label: 'Campos e Quadras',
          description: 'Aluguel de espaços',
          icon: this.icons.field,
          to: '/fields/list',
          disabled: true,
          disabledReason: 'coming_soon',
        },
        {
          key: 'settings',
          label: 'Configurações',
          description: 'Ajustes do sistema',
          icon: this.icons.settings,
          to: '/configuration',
          disabled: false,
          disabledReason: null,
        },
        {
          key: 'profile',
          label: 'Perfil de Jogador',
          description: 'Seus dados e foto',
          icon: this.icons.profile,
          to: '/player-profile/form',
          disabled: !this.isEmailVerified,
          disabledReason: !this.isEmailVerified ? 'verification' : null,
        },
        ...(this.isAdmin ? [{
          key: 'admin',
          label: 'Painel Admin',
          description: 'Gerenciamento do sistema',
          icon: this.icons.admin,
          to: '/admin',
          disabled: false,
          disabledReason: null,
        }] : []),
      ]
    },
  },
  async mounted() {
    const authStore = useAuthStore()
    try {
      await authStore.refreshUser()
    } catch (err) {
      console.error('Erro ao atualizar dados do usuário:', err)
    }
  },
  methods: {
    async handleResendVerification() {
      this.resendingVerification = true
      try {
        await api.post('/email/resend-verification')
        await Swal.fire({
          icon: 'success',
          toast: true,
          position: 'top-end',
          title: 'Email de verificação reenviado!',
          showConfirmButton: false,
          timer: 3000,
        })
      } catch (err) {
        const message = err.response?.data?.message || 'Erro ao reenviar email de verificação.'
        await Swal.fire({
          icon: 'error',
          toast: true,
          position: 'top-end',
          title: message,
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.resendingVerification = false
      }
    },
  },
}
</script>
