<template>
  <system-layout>
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
                  bg-orange-500
                  dark:bg-orange-500
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
                      text-black
                    "
                  >

                  </span>
                </div>
                <div
                  class="
                    text-sm
                    font-semibold
                    text-black
                    dark:text-black
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
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import { computed } from "vue"
import { useRouter } from "vue-router"

export default {
  components: {
    systemLayout
  },
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
        { key: 'team', label: 'Times', icon: this.icons.team, to: '/team/list', color: 'bg-orange-500 text-black' },
        { key: 'players', label: 'Jogadores', icon: this.icons.players, to: '/player-profile/list', color: 'bg-orange-500 text-black' },
        //{ key: 'match', label: 'Amistosos', icon: this.icons.match, to: '/friendly-matches/list', color: 'bg-orange-500 text-black' },
        //{ key: 'trophy', label: 'Campeonatos', icon: this.icons.trophy, to: '/championships/list', color: 'bg-orange-500 text-black' },
        //{ key: 'settings', label: 'Configurações', icon: this.icons.settings, to: '/configuration', color: 'bg-orange-500 text-black' },
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
