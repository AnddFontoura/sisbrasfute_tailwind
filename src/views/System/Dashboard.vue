<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
    <!-- Top bar -->
    <header class="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="
              w-10
              h-10
              rounded-md
              bg-white/10
              flex
              items-center
              justify-center
            "
          >
            <!-- logo placeholder -->
            <svg
              class="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M3 12h18M12 3v18"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h1
            class="
              font-semibold
              text-lg
            "
          >
            SISBRASFUTE
          </h1>
        </div>

        <nav
          class="
            hidden
            sm:flex
            gap-4
          "
        >
          <button
            class="
              text-white/90
              hover:text-white
              text-sm
            "
          >
            Olá, Usuário
          </button>
          <button
            class="
              text-white/90
              hover:text-white
              text-sm
            "
          >
            Sair
          </button>
        </nav>
      </div>
    </header>

    <!-- Content -->
    <main
      class="
        flex-1
        flex
        items-center
        justify-center
        py-12
        px-4
      "
    >
      <div
        class="
          w-full
          max-w-5xl
        "
      >
        <h2
          class="
            text-2xl
            font-bold
            text-slate-800
            dark:text-slate-100
            mb-6
            text-center
          "
        >
          Acessos Rápidos
        </h2>

        <!-- Grid de botões (centralizado) -->
        <div
          class="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            gap-4
            justify-items-center
          "
        >
          <div
            v-for="item in this.items"
            :key="item.key"
            class="
              w-full
              max-w-[160px]
            "
          >
            <!-- usa router-link se router existir, senão botão -->
            <component
              @click="go(item.to)"
              class="block"
            >
              <div
                class="
                  aspect-square
                  w-full
                  rounded-xl
                  shadow-sm
                  bg-white
                  dark:bg-slate-800
                  border
                  border-transparent
                  hover:shadow-md
                  transform
                  hover:-translate-y-1
                  transition
                  p-4
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                "
                :class="item.color"
                role="button"
                :aria-label="item.label"
              >
                <div
                  class="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    bg-white/20
                    rounded-md
                  "
                >
                  <span
                    v-html="item.icon"
                    class="
                      w-6
                      h-6
                      text-white
                    "
                  >

                  </span>
                </div>
                <div
                  class="
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-slate-100
                    text-center
                  "
                >
                  {{ item.label }}
                </div>
              </div>
            </component>
          </div>
        </div>
      </div>
    </main>

    <!-- Botão flutuante -->
    <div class="fixed bottom-6 right-6">
      <button
        @click="fabOpen = !fabOpen"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
      >
        +
      </button>

      <!-- Menu do FAB -->
      <div
        v-if="fabOpen"
        class="absolute bottom-16 right-0 mb-2 w-48 rounded-lg bg-white shadow-lg"
      >
        <ul class="py-2">
          <li
            v-for="action in fabActions"
            :key="action.title"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click="go(action.to)"
          >
            {{ action.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue"
import { useRouter } from "vue-router"
export default {
  data() {
    return {
      isSidebarOpen: false,
      fabOpen: false,
      menuItems: [
        { title: "Time", to: "/team/list" },
        { title: "Jogadores", to: "/player/list" },
        { title: "Amistosos", to: "/friendly-match/list" },
        { title: "Campeonato", to: "/championship/list" },
        { title: "Configurações", to: "/configuration" },
      ],
      fabActions: [
        { title: "Criar Time", to: "/team/form" },
        { title: "Criar Amistoso", to: "/friendly-match/form" },
        { title: "Criar Campeonato", to: "/championship/form" },
        { title: "Meu Perfil", to: "/profile" },
        { title: "Sair", to: "/logout" },
      ],
      icons: {
        team: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M17 20v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>`,
        players: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A3.001 3.001 0 018 16h8a3 3 0 012.879 1.804M12 12a4 4 0 100-8 4 4 0 000 8z"/></svg>`,
        match: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M9 17v2a1 1 0 001 1h4a1 1 0 001-1v-2M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7"/></svg>`,
        trophy: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M8 7V4h8v3M6 7a6 6 0 006 6 6 6 0 006-6M8 21h8"/></svg>`,
        settings: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09c.7 0 1.28-.45 1.51-1a1.65 1.65 0 00-.33-1.82L3.31 6.1a2 2 0 012.83-2.83l.06.06c.5.38 1.12.5 1.75.33.47-.12.98-.12 1.45 0C9 4 9.6 4 10 3.7"/></svg>`,
        plus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/></svg>`
      },
    };
  },
  computed: {
    items() {
      return [
        { key: 'team', label: 'Times', icon: this.icons.team, to: '/team/list', color: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' },
        { key: 'players', label: 'Jogadores', icon: this.icons.players, to: '/player/list', color: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white' },
        { key: 'match', label: 'Amistosos', icon: this.icons.match, to: '/friendly-matches/list', color: 'bg-gradient-to-br from-teal-400 to-teal-500 text-white' },
        { key: 'trophy', label: 'Campeonatos', icon: this.icons.trophy, to: '/championships/list', color: 'bg-gradient-to-br from-rose-500 to-rose-600 text-white' },
        { key: 'settings', label: 'Configurações', icon: this.icons.settings, to: '/configuration', color: 'bg-gradient-to-br from-slate-500 to-slate-600 text-white' },
      ]
    },
  },
  methods: {
    go(route) {
      this.fabOpen = false;
      this.$router.push(route);
    },
  },
};
</script>

<style scoped>
/* garante que as células fiquem visualmente quadradas e consistentes */
.aspect-square {
  /* a classe tailwind aspect-square já aplica a razão 1:1 */
}

/* para um leve efeito quando o tema escuro/clear */
[v-cloak] { display: none; }
</style>
