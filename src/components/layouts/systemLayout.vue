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
          <a href="/logout">
            <button
              class="
                text-white/90
                hover:text-white
                text-sm
              "
            >
              Sair
            </button>
          </a>
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
        <slot />
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
      fabActions: [
        { title: "Criar Time", to: "/team/form" },
        { title: "Criar Amistoso", to: "/friendly-match/form" },
        { title: "Criar Campeonato", to: "/championship/form" },
        { title: "Meu Perfil", to: "/profile" },
        { title: "Sair", to: "/logout" },
      ],
    };
  },
  computed: {
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
