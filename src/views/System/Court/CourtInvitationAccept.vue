<template>
  <system-layout>
    <main class="flex items-center justify-center py-20">
      <div class="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <!-- Processing -->
        <template v-if="processing">
          <svg class="mx-auto h-10 w-10 animate-spin text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Processando convite...</p>
        </template>

        <!-- Error -->
        <template v-else-if="errorMessage">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
            <span class="text-2xl text-red-600 dark:text-red-400">✕</span>
          </div>
          <h1 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">Não foi possível aceitar</h1>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ errorMessage }}</p>
          <router-link
            :to="{ name: 'court-invitation-received' }"
            class="mt-6 inline-flex items-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Ver meus convites
          </router-link>
        </template>
      </div>
    </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import Swal from "@/services/swal.js";

const TOKEN_STORAGE_KEY = "court_invitation_token";

export default {
  name: "CourtInvitationAccept",
  components: {
    systemLayout,
  },
  data() {
    return {
      processing: true,
      errorMessage: "",
    };
  },
  created() {
    this.acceptFromToken();
  },
  methods: {
    resolveToken() {
      const queryToken = this.$route.query.token;
      if (queryToken) {
        // Persist so the token survives a login/register round-trip.
        localStorage.setItem(TOKEN_STORAGE_KEY, queryToken);
        return queryToken;
      }
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    },
    async acceptFromToken() {
      const token = this.resolveToken();

      if (!token) {
        this.processing = false;
        this.errorMessage = "Convite inválido ou token ausente.";
        return;
      }

      try {
        await api.post("/court-invitation/accept", { token });

        localStorage.removeItem(TOKEN_STORAGE_KEY);

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Convite aceito com sucesso!",
          showConfirmButton: false,
          timer: 3000,
        });

        this.$router.push({ name: "my-courts" });
      } catch (err) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        this.processing = false;
        this.errorMessage =
          err.response?.data?.message || "Não foi possível aceitar o convite.";
      }
    },
  },
};
</script>
