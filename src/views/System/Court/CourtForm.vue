<template>
  <system-layout>
    <form @submit.prevent="handleSubmit">
      <div class="space-y-6">
        <!-- Page Header -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? "Editar Quadra" : "Cadastrar Nova Quadra" }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ isEditMode ? "Atualize as informações da sua quadra." : "Preencha os dados para cadastrar sua quadra." }}
          </p>
        </div>

        <!-- Section 1: Informações básicas -->
        <div class="relative rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <!-- Loading overlay -->
          <div v-if="loading" class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm dark:bg-gray-900/60">
            <svg class="h-10 w-10 animate-spin text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p class="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Salvando...</p>
          </div>

          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Informações básicas</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome da Quadra</label>
              <input v-model="form.courtName" type="text" placeholder="Ex: Arena Central" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>

            <ModalitiesSelect v-model="selectedModalities" label-name="Modalidade" />

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-3">Tipo de gramado</label>
              <select v-model="form.courtSurfaceType" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10">
                <option value="">Selecione</option>
                <option v-for="opt in surfaceOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>

            <StateSelect v-model="stateId" />
            <CitySelect :state-id="stateId" v-model="form.courtCityId" />

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Endereço</label>
              <input v-model="form.courtAddressLine" type="text" placeholder="Rua, número, bairro" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Descrição</label>
            <QuillEditor v-model:content="form.courtDescription" content-type="html" theme="snow" class="bg-white dark:bg-gray-700 rounded border dark:border-gray-600" />
          </div>
        </div>

        <!-- Section 2: Contatos -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Contatos</h2>
            <button type="button" @click="addContact" class="inline-flex items-center rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600">
              + Adicionar contato
            </button>
          </div>

          <div v-if="contacts.length === 0" class="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-400 dark:text-gray-500">
            Adicione ao menos um contato.
          </div>

          <div v-for="(contact, index) in contacts" :key="'contact-' + index" class="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3 items-end">
            <div class="sm:col-span-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Tipo</label>
              <select v-model="contact.type" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10">
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Telefone</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div class="sm:col-span-5">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Valor</label>
              <input v-model="contact.value" type="text" placeholder="Ex: 11999998888" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Rótulo (opcional)</label>
              <input v-model="contact.label" type="text" placeholder="Ex: Recepção" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div class="sm:col-span-1 flex justify-end">
              <button type="button" @click="removeContact(index)" class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-300 text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10" aria-label="Remover contato">
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Section 3: Fotos -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Fotos</h2>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ totalPhotoCount }}/10</span>
          </div>

          <div class="flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-4 py-6">
            <div class="text-center">
              <label
                for="photos-upload"
                class="cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                :class="{ 'pointer-events-none opacity-50': totalPhotoCount >= 10 }"
              >
                <span>Escolher fotos</span>
                <input id="photos-upload" type="file" class="sr-only" accept="image/*" multiple :disabled="totalPhotoCount >= 10" @change="onPhotosChange" />
              </label>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Entre 1 e 10 fotos. PNG, JPG até 10MB cada.</p>
            </div>
          </div>

          <!-- Existing photos (edit mode) -->
          <div v-if="existingPhotos.length > 0" class="mt-4">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Fotos atuais</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div v-for="photo in existingPhotos" :key="'exist-' + photo.id" class="relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                <img :src="photo.photo_url" alt="" class="h-full w-full object-cover" />
                <button type="button" @click="removeExistingPhoto(photo.id)" class="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white transition hover:bg-red-600" aria-label="Remover foto">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- New photo previews -->
          <div v-if="photoPreviews.length > 0" class="mt-4">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Novas fotos</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div v-for="(preview, index) in photoPreviews" :key="'new-' + index" class="relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                <img :src="preview" alt="" class="h-full w-full object-cover" />
                <button type="button" @click="removeNewPhoto(index)" class="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white transition hover:bg-red-600" aria-label="Remover foto">
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Configuração de horários -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Configuração de horários</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  <th class="px-2 py-2">Dia</th>
                  <th class="px-2 py-2">Ativo</th>
                  <th class="px-2 py-2">Início</th>
                  <th class="px-2 py-2">Fim</th>
                  <th class="px-2 py-2">Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="config in scheduleConfigs" :key="'sched-' + config.weekday" class="border-t border-gray-100 dark:border-white/10">
                  <td class="px-2 py-2 font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{{ weekdayLabel(config.weekday) }}</td>
                  <td class="px-2 py-2">
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="config.isActive"
                      :class="config.isActive ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'"
                      class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                      @click="config.isActive = !config.isActive"
                    >
                      <span :class="config.isActive ? 'translate-x-5' : 'translate-x-0'" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                    </button>
                  </td>
                  <td class="px-2 py-2">
                    <input v-model="config.startTime" type="time" :disabled="!config.isActive" class="rounded-md bg-white px-2 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 disabled:opacity-50 dark:bg-white/5 dark:text-white dark:outline-white/10" />
                  </td>
                  <td class="px-2 py-2">
                    <input v-model="config.endTime" type="time" :disabled="!config.isActive" class="rounded-md bg-white px-2 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 disabled:opacity-50 dark:bg-white/5 dark:text-white dark:outline-white/10" />
                  </td>
                  <td class="px-2 py-2">
                    <select v-model.number="config.reservationDuration" :disabled="!config.isActive" class="rounded-md bg-white px-2 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 disabled:opacity-50 dark:bg-white/5 dark:text-white dark:outline-white/10">
                      <option v-for="opt in durationOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 5: Regras de preço -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Regras de preço</h2>
            <button type="button" @click="addPricingRule" class="inline-flex items-center rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600">
              + Adicionar regra
            </button>
          </div>

          <div v-if="pricingRules.length === 0" class="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-400 dark:text-gray-500">
            Nenhuma regra de preço cadastrada.
          </div>

          <div v-for="(rule, index) in pricingRules" :key="'price-' + index" class="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3 items-end">
            <div class="sm:col-span-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Dia</label>
              <select v-model.number="rule.weekday" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10">
                <option v-for="d in weekdays" :key="d.value" :value="d.value">{{ d.label }}</option>
              </select>
            </div>
            <div class="sm:col-span-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Início</label>
              <input v-model="rule.startTime" type="time" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Fim</label>
              <input v-model="rule.endTime" type="time" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Preço (R$)</label>
              <input v-model="rule.price" type="number" min="0" step="0.01" placeholder="0,00" class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500" />
            </div>
            <div class="sm:col-span-1 flex justify-end">
              <button type="button" @click="removePricingRule(index)" class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-300 text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10" aria-label="Remover regra">
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:bg-orange-400 disabled:opacity-80"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Salvando...
            </span>
            <span v-else>{{ isEditMode ? 'Salvar alterações' : 'Cadastrar quadra' }}</span>
          </button>
        </div>
      </div>
    </form>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue";
import CitySelect from "@/components/form/CitySelectComponent.vue";
import ModalitiesSelect from "@/components/form/ModalitiesSelect.vue";
import systemLayout from "@/components/layouts/systemLayout.vue";
import { QuillEditor } from "@vueup/vue-quill";
import Swal from "@/services/swal.js";

export default {
  name: "CourtForm",
  components: {
    StateSelect,
    CitySelect,
    ModalitiesSelect,
    systemLayout,
    QuillEditor,
  },
  data() {
    return {
      form: {
        courtName: "",
        courtDescription: "",
        courtCityId: "",
        courtAddressLine: "",
        courtSurfaceType: "",
      },
      selectedModalities: [],
      stateId: null,
      courtId: null,
      contacts: [],
      pricingRules: [],
      scheduleConfigs: [],
      existingPhotos: [],
      removedPhotoIds: [],
      photoFiles: [],
      photoPreviews: [],
      loading: false,
      surfaceOptions: [
        { value: "natural", label: "Natural" },
        { value: "sintetico", label: "Sintético" },
        { value: "emborrachado", label: "Emborrachado" },
        { value: "piso", label: "Piso" },
      ],
      durationOptions: [
        { value: 60, label: "1h" },
        { value: 90, label: "1h30" },
        { value: 120, label: "2h" },
      ],
      weekdays: [
        { value: 0, label: "Dom" },
        { value: 1, label: "Seg" },
        { value: 2, label: "Ter" },
        { value: 3, label: "Qua" },
        { value: 4, label: "Qui" },
        { value: 5, label: "Sex" },
        { value: 6, label: "Sáb" },
      ],
    };
  },
  computed: {
    isEditMode() {
      return !!this.courtId;
    },
    totalPhotoCount() {
      return this.existingPhotos.length + this.photoFiles.length;
    },
  },
  created() {
    this.scheduleConfigs = this.weekdays.map((d) => ({
      weekday: d.value,
      isActive: false,
      startTime: "",
      endTime: "",
      reservationDuration: 60,
    }));

    this.courtId = this.$route.params.id || null;
    if (this.courtId) {
      this.getCourtInformation();
    }
  },
  methods: {
    weekdayLabel(weekday) {
      return this.weekdays.find((d) => d.value === weekday)?.label ?? "";
    },

    addContact() {
      this.contacts.push({ type: "whatsapp", value: "", label: "" });
    },
    removeContact(index) {
      this.contacts.splice(index, 1);
    },

    addPricingRule() {
      this.pricingRules.push({ weekday: 0, startTime: "", endTime: "", price: "" });
    },
    removePricingRule(index) {
      this.pricingRules.splice(index, 1);
    },

    onPhotosChange(e) {
      const files = Array.from(e.target.files || []);
      for (const file of files) {
        if (this.totalPhotoCount >= 10) break;
        this.photoFiles.push(file);
        this.photoPreviews.push(URL.createObjectURL(file));
      }
      e.target.value = "";
    },
    removeNewPhoto(index) {
      this.photoFiles.splice(index, 1);
      this.photoPreviews.splice(index, 1);
    },
    removeExistingPhoto(id) {
      this.existingPhotos = this.existingPhotos.filter((p) => p.id !== id);
      if (!this.removedPhotoIds.includes(id)) {
        this.removedPhotoIds.push(id);
      }
    },

    priceToCents(price) {
      const value = parseFloat(price);
      if (isNaN(value)) return 0;
      return Math.round(value * 100);
    },
    centsToPrice(cents) {
      if (cents == null) return "";
      return (cents / 100).toFixed(2);
    },

    async getCourtInformation() {
      this.loading = true;
      try {
        const { data } = await api.get("/court/show/" + this.courtId);

        this.form.courtName = data.name ?? "";
        this.form.courtDescription = data.description ?? "";
        this.form.courtCityId = data.city_id ?? "";
        this.form.courtAddressLine = data.address_line ?? "";
        this.form.courtSurfaceType = data.surface_type ?? "";

        this.selectedModalities = data.modality_id ? [data.modality_id] : [];
        this.stateId = data.city_info?.state_id ?? data.city_info?.state_info?.id ?? null;

        this.existingPhotos = data.photos ?? [];

        this.contacts = (data.contacts ?? []).map((c) => ({
          type: c.type,
          value: c.value,
          label: c.label ?? "",
        }));

        this.pricingRules = (data.pricing_rules ?? []).map((r) => ({
          weekday: r.weekday,
          startTime: (r.start_time ?? "").slice(0, 5),
          endTime: (r.end_time ?? "").slice(0, 5),
          price: this.centsToPrice(r.price_cents),
        }));

        const loaded = data.schedule_configs ?? [];
        this.scheduleConfigs = this.weekdays.map((d) => {
          const match = loaded.find((s) => s.weekday === d.value);
          return {
            weekday: d.value,
            isActive: match ? !!match.is_active : false,
            startTime: match ? (match.start_time ?? "").slice(0, 5) : "",
            endTime: match ? (match.end_time ?? "").slice(0, 5) : "",
            reservationDuration: match && match.reservation_duration ? Number(match.reservation_duration) : 60,
          };
        });
      } catch (err) {
        console.error(err);
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro encontrado!",
          text: "Não foi possível carregar os dados da quadra.",
          showConfirmButton: true,
        });
      } finally {
        this.loading = false;
      }
    },

    async handleSubmit() {
      this.loading = true;
      const formData = new FormData();

      formData.append("courtName", this.form.courtName ?? "");
      formData.append("courtDescription", this.form.courtDescription ?? "");
      formData.append("courtModalityId", this.selectedModalities[0] ?? "");
      formData.append("courtCityId", this.form.courtCityId ?? "");
      formData.append("courtAddressLine", this.form.courtAddressLine ?? "");
      formData.append("courtSurfaceType", this.form.courtSurfaceType ?? "");

      // Contacts
      this.contacts.forEach((contact, i) => {
        formData.append(`contacts[${i}][type]`, contact.type ?? "");
        formData.append(`contacts[${i}][value]`, contact.value ?? "");
        formData.append(`contacts[${i}][label]`, contact.label ?? "");
      });

      // Pricing rules
      this.pricingRules.forEach((rule, i) => {
        formData.append(`pricingRules[${i}][weekday]`, rule.weekday);
        formData.append(`pricingRules[${i}][startTime]`, rule.startTime ?? "");
        formData.append(`pricingRules[${i}][endTime]`, rule.endTime ?? "");
        formData.append(`pricingRules[${i}][priceCents]`, this.priceToCents(rule.price));
      });

      // Schedule configs
      this.scheduleConfigs.forEach((config, i) => {
        formData.append(`scheduleConfigs[${i}][weekday]`, config.weekday);
        formData.append(`scheduleConfigs[${i}][startTime]`, config.startTime ?? "");
        formData.append(`scheduleConfigs[${i}][endTime]`, config.endTime ?? "");
        formData.append(`scheduleConfigs[${i}][reservationDuration]`, config.reservationDuration);
        formData.append(`scheduleConfigs[${i}][isActive]`, config.isActive ? 1 : 0);
      });

      // Photos
      this.photoFiles.forEach((file) => {
        formData.append("photos[]", file);
      });

      // Removed photos (edit)
      this.removedPhotoIds.forEach((id, i) => {
        formData.append(`removedPhotoIds[${i}]`, id);
      });

      try {
        const url = this.courtId ? "/court/update/" + this.courtId : "/court/save";

        await api.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.$router.push({ name: "my-courts" });
      } catch (err) {
        const data = err.response?.data;
        let mensagens = "";
        if (data?.errors) {
          mensagens = Object.values(data.errors).flat().join("<br> <br>");
        } else if (typeof data === "string") {
          mensagens = data;
        }

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erro encontrado!",
          html: mensagens,
          showConfirmButton: true,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
