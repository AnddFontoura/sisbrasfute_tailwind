<template>
  <system-layout>
    <main class="py-8">
      <div class="w-full">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Painel Administrativo</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie usuários, times e partidas do sistema.
          </p>
        </div>

        <!-- Navigation Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <router-link
            v-for="item in navItems"
            :key="item.key"
            :to="{ name: item.routeName }"
            class="block"
          >
            <div
              class="relative overflow-hidden rounded-2xl border p-5 transition-all duration-200"
              :class="isActive(item.routeName)
                ? 'border-orange-500 bg-orange-50 shadow-md dark:border-orange-500 dark:bg-orange-500/10'
                : 'border-gray-200 bg-white shadow-sm hover:border-orange-500/40 hover:shadow-md hover:-translate-y-1 cursor-pointer dark:border-white/10 dark:bg-gray-800 dark:hover:border-orange-500/40'"
            >
              <!-- Icon -->
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl mb-3"
                :class="isActive(item.routeName) ? 'bg-orange-500/20' : 'bg-orange-500/10'"
              >
                <span
                  v-html="item.icon"
                  class="w-6 h-6 text-orange-500"
                ></span>
              </div>

              <!-- Label -->
              <p class="text-sm font-bold text-gray-900 dark:text-white">
                {{ item.label }}
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ item.description }}
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";

export default {
  name: "AdminDashboard",
  components: {
    systemLayout,
  },
  data() {
    return {
      icons: {
        users: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-1.997m0 0A8.96 8.96 0 0112 15a8.96 8.96 0 01-1.213-.082M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>',
        teams: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>',
        matches: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>',
      },
    }
  },
  computed: {
    navItems() {
      return [
        {
          key: 'users',
          label: 'Usuários',
          description: 'Gerenciar usuários cadastrados',
          icon: this.icons.users,
          routeName: 'admin-users',
        },
        {
          key: 'teams',
          label: 'Times',
          description: 'Gerenciar times e imagens',
          icon: this.icons.teams,
          routeName: 'admin-teams',
        },
        {
          key: 'matches',
          label: 'Partidas',
          description: 'Visualizar partidas cadastradas',
          icon: this.icons.matches,
          routeName: 'admin-matches',
        },
      ]
    },
  },
  methods: {
    isActive(routeName) {
      return this.$route.name === routeName
    },
  },
}
</script>
