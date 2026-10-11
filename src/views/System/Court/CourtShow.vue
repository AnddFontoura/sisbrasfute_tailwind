<template>
  <system-layout>
    <main class="space-y-6">
      <!-- Loading -->
      <div v-if="loading && !court.name" class="flex items-center justify-center py-20">
        <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white truncate">{{ court.name }}</h1>
            <p v-if="court.city_info" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              📍 {{ court.city_info?.name }} / {{ court.city_info?.state_info?.name }}
            </p>
          </div>
          <span
            class="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold"
            :class="statusBadgeClass(court.status)"
          >
            {{ statusLabel(court.status) }}
          </span>
        </div>

        <!-- Photo carousel -->
        <div v-if="photos.length > 0" class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="relative">
            <div class="flex items-center gap-3">
              <!-- Prev arrow -->
              <button
                v-if="photos.length > 1"
                type="button"
                @click="prevPhoto"
                class="absolute left-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white dark:bg-gray-900/80 dark:text-gray-100 dark:hover:bg-gray-900"
                aria-label="Foto anterior"
              >
                ←
              </button>

              <!-- Current image -->
              <div class="mx-auto w-full">
                <div class="group relative mx-auto flex aspect-video max-h-96 w-full items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-gray-700/40">
                  <img
                    :src="currentPhoto"
                    alt="Foto da quadra"
                    class="h-full w-full cursor-zoom-in object-contain transition duration-200 group-hover:scale-105"
                    @click="openLightbox(currentPhoto)"
                  />
                  <button
                    type="button"
                    @click="openLightbox(currentPhoto)"
                    class="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-700 shadow transition hover:bg-white dark:bg-gray-900/80 dark:text-gray-100 dark:hover:bg-gray-900"
                    aria-label="Ampliar foto"
                    title="Ampliar"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Next arrow -->
              <button
                v-if="photos.length > 1"
                type="button"
                @click="nextPhoto"
                class="absolute right-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white dark:bg-gray-900/80 dark:text-gray-100 dark:hover:bg-gray-900"
                aria-label="Próxima foto"
              >
                →
              </button>
            </div>

            <!-- Thumbnails -->
            <div v-if="photos.length > 1" class="mt-4 flex flex-wrap justify-center gap-2">
              <button
                v-for="(photo, index) in photos"
                :key="photo.id ?? index"
                type="button"
                @click="currentPhotoIndex = index"
                class="h-12 w-12 overflow-hidden rounded-lg border transition"
                :class="index === currentPhotoIndex
                  ? 'border-orange-500 ring-2 ring-orange-500/30'
                  : 'border-gray-200 opacity-70 hover:opacity-100 dark:border-white/10'"
              >
                <img :src="photo.photo_url" alt="" class="h-full w-full object-cover" />
              </button>
            </div>
          </div>
        </div>

        <!-- Info cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <TrophyIcon class="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Modalidade</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ court.modality_info?.name ?? 'Não informado' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Square3Stack3DIcon class="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Gramado</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ surfaceLabel(court.surface_type) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <MapPinIcon class="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cidade</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ court.city_info?.name ?? 'Desconhecido' }} / {{ court.city_info?.state_info?.name ?? '' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <MapIcon class="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Endereço</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ court.address_line || 'Não informado' }}</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="court.description" class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">Sobre a quadra</h2>
          <div v-html="court.description" class="prose dark:prose-invert prose-sm max-w-none text-gray-700 dark:text-gray-300"></div>
        </div>

        <!-- Contacts -->
        <div v-if="contacts.length > 0" class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Contatos</h2>
          <div class="flex flex-wrap gap-3">
            <template v-for="(contact, index) in contacts" :key="'contact-' + index">
              <a
                v-if="contact.type === 'whatsapp'"
                :href="'https://wa.me/' + onlyDigits(contact.value)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" /></svg>
                {{ contact.label || 'WhatsApp' }}
              </a>
              <a
                v-else-if="contact.type === 'phone'"
                :href="'tel:' + onlyDigits(contact.value)"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-gray-200 dark:hover:bg-white/5"
              >
                📞 {{ contact.label ? contact.label + ': ' : '' }}{{ contact.value }}
              </a>
              <span
                v-else
                class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 dark:border-white/10 dark:bg-transparent dark:text-gray-200"
              >
                {{ contact.label ? contact.label + ': ' : '' }}{{ contact.value }}
              </span>
            </template>
          </div>
        </div>

        <!-- Pricing rules -->
        <div v-if="pricingRules.length > 0" class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Regras de preço</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  <th class="px-3 py-2">Dia</th>
                  <th class="px-3 py-2">Horário</th>
                  <th class="px-3 py-2">Preço</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rule, index) in pricingRules" :key="'price-' + index" class="border-t border-gray-100 dark:border-white/10">
                  <td class="px-3 py-2 text-gray-700 dark:text-gray-200">{{ weekdayLabel(rule.weekday) }}</td>
                  <td class="px-3 py-2 text-gray-700 dark:text-gray-200">{{ timeRange(rule.start_time, rule.end_time) }}</td>
                  <td class="px-3 py-2 font-semibold text-orange-600 dark:text-orange-400">{{ formatPrice(rule.price_cents) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Schedule configs -->
        <div v-if="scheduleConfigs.length > 0" class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Horários disponíveis</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  <th class="px-3 py-2">Dia</th>
                  <th class="px-3 py-2">Janela</th>
                  <th class="px-3 py-2">Duração</th>
                  <th class="px-3 py-2">Ativo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(config, index) in scheduleConfigs" :key="'sched-' + index" class="border-t border-gray-100 dark:border-white/10">
                  <td class="px-3 py-2 text-gray-700 dark:text-gray-200">{{ weekdayLabel(config.weekday) }}</td>
                  <td class="px-3 py-2 text-gray-700 dark:text-gray-200">{{ timeRange(config.start_time, config.end_time) }}</td>
                  <td class="px-3 py-2 text-gray-700 dark:text-gray-200">{{ durationLabel(config.reservation_duration) }}</td>
                  <td class="px-3 py-2">
                    <span
                      v-if="config.is_active"
                      class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    >Sim</span>
                    <span
                      v-else
                      class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-600 dark:text-gray-300"
                    >Não</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </main>

    <!-- Lightbox -->
    <Transition name="fade">
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer"
        @click.self="closeLightbox"
      >
        <img :src="lightboxImageUrl" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg cursor-pointer" @click="closeLightbox" />
      </div>
    </Transition>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import { MapIcon, MapPinIcon, TrophyIcon, Square3Stack3DIcon } from "@heroicons/vue/20/solid";
import Swal from "@/services/swal.js";

export default {
  name: "CourtShow",
  components: {
    systemLayout,
    MapIcon,
    MapPinIcon,
    TrophyIcon,
    Square3Stack3DIcon,
  },
  data() {
    return {
      courtId: 0,
      court: {},
      loading: false,
      currentPhotoIndex: 0,
      isLightboxOpen: false,
      lightboxImageUrl: null,
      surfaceOptions: {
        natural: "Natural",
        sintetico: "Sintético",
        emborrachado: "Emborrachado",
        piso: "Piso",
      },
      weekdays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    };
  },
  computed: {
    photos() {
      return this.court.photos ?? [];
    },
    currentPhoto() {
      return this.photos[this.currentPhotoIndex]?.photo_url ?? null;
    },
    contacts() {
      return this.court.contacts ?? [];
    },
    pricingRules() {
      return this.court.pricing_rules ?? [];
    },
    scheduleConfigs() {
      return this.court.schedule_configs ?? [];
    },
  },
  created() {
    this.courtId = this.$route.params.id;
    this.getCourtInformation();
  },
  mounted() {
    this._escHandler = (e) => {
      if (e.key === "Escape" && this.isLightboxOpen) this.closeLightbox();
    };
    document.addEventListener("keydown", this._escHandler);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this._escHandler);
  },
  methods: {
    onlyDigits(value) {
      return (value ?? "").replace(/\D/g, "");
    },

    surfaceLabel(type) {
      return this.surfaceOptions[type] ?? "Não informado";
    },

    weekdayLabel(weekday) {
      return this.weekdays[weekday] ?? "";
    },

    durationLabel(duration) {
      const map = { 60: "1h", 90: "1h30", 120: "2h" };
      return map[Number(duration)] ?? "—";
    },

    timeRange(start, end) {
      const s = (start ?? "").slice(0, 5);
      const e = (end ?? "").slice(0, 5);
      if (!s && !e) return "—";
      return `${s} - ${e}`;
    },

    formatPrice(cents) {
      if (cents == null) return "—";
      return (cents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },

    statusLabel(status) {
      const map = { pending: "Pendente", approved: "Aprovada", rejected: "Rejeitada" };
      return map[status] ?? status;
    },

    statusBadgeClass(status) {
      const map = {
        pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        approved: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
        rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
      };
      return map[status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300";
    },

    prevPhoto() {
      this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.photos.length) % this.photos.length;
    },
    nextPhoto() {
      this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.photos.length;
    },

    openLightbox(url) {
      this.lightboxImageUrl = url;
      this.isLightboxOpen = true;
    },
    closeLightbox() {
      this.isLightboxOpen = false;
      this.lightboxImageUrl = null;
    },

    async getCourtInformation() {
      this.loading = true;
      try {
        const { data } = await api.get("/court/show/" + this.courtId);
        this.court = data;
      } catch (err) {
        console.error(err);
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro ao carregar quadra",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
