<template>
  <div class="space-y-6">
    <!-- Court select -->
    <div class="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Quadra</label>
      <select
        v-model="selectedCourtId"
        class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 sm:max-w-xs"
      >
        <option v-for="court in manageableCourts" :key="court.id" :value="String(court.id)">
          {{ court.name }}
        </option>
      </select>
    </div>

    <!-- Calendar + day detail -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
      <div class="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <ReservationCalendar
          v-if="selectedCourtId"
          ref="calendar"
          :court-id="selectedCourtId"
          @select-day="onSelectDay"
        />
      </div>

      <!-- Day-detail panel -->
      <div class="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div v-if="!selectedDate" class="flex h-full items-center justify-center py-10 text-center text-sm text-gray-400 dark:text-gray-500">
          Selecione um dia no calendário para ver os horários.
        </div>

        <div v-else>
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white">{{ formatDateLabel(selectedDate) }}</h3>
            <span v-if="loadingDay" class="text-xs text-gray-400 dark:text-gray-500">Carregando...</span>
          </div>

          <div v-if="!loadingDay && daySlots.length === 0" class="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            Nenhum horário disponível para este dia.
          </div>

          <ul v-else class="flex flex-col gap-2">
            <li
              v-for="(slot, index) in daySlots"
              :key="slot.start_time + '-' + index"
              class="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {{ slot.start_time }} – {{ slot.end_time }}
                </span>
                <span
                  v-if="slot.status === 'free'"
                  class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-400"
                >
                  Livre
                </span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
                >
                  Reservado
                </span>
              </div>

              <!-- Free slot -->
              <div v-if="slot.status === 'free'" class="mt-2 flex items-center justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ centsToPriceLabel(slot.default_price_cents) }}</span>
                <button
                  type="button"
                  @click="openReserveModal(slot)"
                  class="inline-flex items-center rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
                >
                  Reservar
                </button>
              </div>

              <!-- Reserved slot -->
              <div v-else class="mt-2">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ slot.reservation?.customer_name }}</p>
                <p v-if="slot.reservation?.description" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {{ slot.reservation.description }}
                </p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ centsToPriceLabel(slot.reservation?.price_cents) }}</span>
                  <button
                    type="button"
                    @click="onCancel(slot.reservation)"
                    class="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Reserve modal -->
    <div
      v-if="reserveModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeReserveModal"
    >
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Nova reserva</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ formatDateLabel(selectedDate) }} · {{ reserveModal.slot?.start_time }} – {{ reserveModal.slot?.end_time }}
        </p>

        <form @submit.prevent="submitReservation" class="mt-4 space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Cliente</label>
            <input
              v-model="reserveModal.customerName"
              type="text"
              required
              placeholder="Nome do cliente"
              class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Descrição (opcional)</label>
            <textarea
              v-model="reserveModal.description"
              rows="2"
              placeholder="Observações, contato, etc."
              class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Preço (R$)</label>
            <input
              v-model="reserveModal.price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              class="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
            />
          </div>

          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              v-model="reserveModal.isMensalista"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 dark:border-white/20 dark:bg-white/5"
            />
            Repetir reserva neste mês (mensalista)
          </label>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="closeReserveModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="savingReservation"
              class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {{ savingReservation ? 'Salvando...' : 'Reservar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";
import ReservationCalendar from "@/components/calendar/ReservationCalendar.vue";
import Swal from "@/services/swal.js";

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default {
  name: "CourtReservations",
  components: {
    ReservationCalendar,
  },
  props: {
    courtId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      manageableCourts: [],
      selectedCourtId: this.courtId != null ? String(this.courtId) : "",
      selectedDate: null,
      daySlots: [],
      loadingDay: false,
      savingReservation: false,
      reserveModal: {
        open: false,
        slot: null,
        customerName: "",
        description: "",
        price: "",
        isMensalista: false,
      },
    };
  },
  created() {
    this.loadManageableCourts();
  },
  watch: {
    selectedCourtId() {
      // Re-fetch in place: clear the day panel so stale slots don't linger.
      this.selectedDate = null;
      this.daySlots = [];
    },
  },
  methods: {
    async loadManageableCourts() {
      try {
        const { data } = await api.get("/court/my-courts");
        const courts = data.courts ?? [];
        this.manageableCourts = courts.filter((c) => c.my_role !== null && c.my_role !== undefined);
        const current = this.manageableCourts.find((c) => String(c.id) === String(this.courtId));
        if (current) {
          this.selectedCourtId = String(current.id);
        } else if (this.manageableCourts.length > 0) {
          this.selectedCourtId = String(this.manageableCourts[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    },
    pad2(n) {
      return String(n).padStart(2, "0");
    },
    formatDateLabel(dateKey) {
      if (!dateKey) return "";
      const [y, m, d] = dateKey.split("-").map(Number);
      return `${this.pad2(d)} de ${MONTH_NAMES[m - 1]} de ${y}`;
    },
    centsToPriceLabel(cents) {
      const value = Number(cents ?? 0) / 100;
      return `R$ ${value.toFixed(2).replace(".", ",")}`;
    },
    centsToPriceInput(cents) {
      return (Number(cents ?? 0) / 100).toFixed(2);
    },
    priceToCents(price) {
      const value = parseFloat(price);
      if (isNaN(value)) return 0;
      return Math.round(value * 100);
    },
    async onSelectDay(dateKey) {
      this.selectedDate = dateKey;
      await this.fetchDay();
    },
    async fetchDay() {
      if (!this.selectedCourtId || !this.selectedDate) return;
      this.loadingDay = true;
      try {
        const { data } = await api.get(`/court-reservation/${this.selectedCourtId}/day`, {
          params: { date: this.selectedDate },
        });
        this.daySlots = data.slots ?? [];
      } catch (err) {
        console.error(err);
        this.daySlots = [];
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: err.response?.data?.message || "Erro ao carregar os horários.",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        this.loadingDay = false;
      }
    },
    refreshMarkers() {
      this.$refs.calendar?.fetchMonth?.();
    },
    openReserveModal(slot) {
      this.reserveModal = {
        open: true,
        slot,
        customerName: "",
        description: "",
        price: this.centsToPriceInput(slot.default_price_cents),
        isMensalista: false,
      };
    },
    closeReserveModal() {
      this.reserveModal.open = false;
      this.reserveModal.slot = null;
    },
    async submitReservation() {
      if (!this.reserveModal.customerName) return;
      this.savingReservation = true;
      const slot = this.reserveModal.slot;
      try {
        const { data } = await api.post(`/court-reservation/${this.selectedCourtId}/reserve`, {
          reservationDate: this.selectedDate,
          startTime: slot.start_time,
          endTime: slot.end_time,
          customerName: this.reserveModal.customerName,
          description: this.reserveModal.description || "",
          priceCents: this.priceToCents(this.reserveModal.price),
          isMensalista: this.reserveModal.isMensalista,
        });

        this.closeReserveModal();
        await this.fetchDay();
        this.refreshMarkers();

        const skipped = data?.skipped_dates ?? [];
        if (skipped.length > 0) {
          await Swal.fire({
            icon: "warning",
            title: "Reserva criada com datas puladas",
            html: `Estas datas já estavam ocupadas e foram puladas:<br><strong>${skipped.join("<br>")}</strong>`,
            confirmButtonText: "Ok",
          });
        } else {
          await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: data?.message || "Reserva criada com sucesso.",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.message || "Não foi possível criar a reserva.";
        if (status === 409) {
          await this.fetchDay();
          this.refreshMarkers();
        }
        await Swal.fire({
          icon: "error",
          title: "Erro",
          text: message,
          confirmButtonText: "Ok",
        });
      } finally {
        this.savingReservation = false;
      }
    },
    async onCancel(reservation) {
      if (!reservation) return;

      let scope = null;
      if (reservation.recurrence_group_id !== null && reservation.recurrence_group_id !== undefined) {
        const result = await Swal.fire({
          title: "Cancelar reserva recorrente",
          text: "Esta reserva faz parte de uma recorrência. O que deseja cancelar?",
          icon: "warning",
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: "Somente esta",
          denyButtonText: "Esta e as futuras",
          cancelButtonText: "Voltar",
        });
        if (result.isConfirmed) {
          scope = "one";
        } else if (result.isDenied) {
          scope = "future";
        } else {
          return;
        }
      } else {
        const result = await Swal.fire({
          title: "Cancelar reserva?",
          text: "Deseja cancelar esta reserva?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sim, cancelar",
          cancelButtonText: "Não",
        });
        if (!result.isConfirmed) return;
        scope = "one";
      }

      try {
        await api.delete(`/court-reservation/${this.selectedCourtId}/reservations/${reservation.id}`, {
          params: { scope },
        });

        await this.fetchDay();
        this.refreshMarkers();

        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Reserva cancelada",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        await Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: err.response?.data?.message || "Não foi possível cancelar a reserva.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
  },
};
</script>
