<template>
  <div class="mt-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200" aria-label="citySelect">{{ labelName }}</label>
    <Multiselect
      id="citySelect"
      v-model="internalValue"
      :options="cities"
      track-by="name"
      label="name"
      :searchable="true"
      value-prop="id"
      :loading="loading"
      :disabled="isDisabled"
      :placeholder="currentPlaceholder"
    />
  </div>
</template>

<script>
import api from "@/services/api"
import Multiselect from '@vueform/multiselect'


export default {
  name: "CitySelect",
  components: {
    Multiselect
  },
  props: {
    labelName: {
      type: String,
      default: "Cidade",
    },
    placeholder: {
      type: String,
      default: "Selecione a cidade",
    },
    modelValue: [String, Number],
    stateId: [String, Number], // vem do pai
  },
  data() {
    return {
      cities: [],
      internalValue: this.modelValue,
      loading: false,
    }
  },
  computed: {
    // The city field stays locked until a state is chosen (reduces user error).
    // While the list is loading we keep it enabled so the Multiselect's own
    // spinner shows; the `loading` prop already prevents interaction.
    isDisabled() {
      return !this.stateId
    },
    currentPlaceholder() {
      if (!this.stateId) return "Selecione o estado primeiro"
      if (this.loading) return "Carregando cidades..."
      return this.placeholder
    },
  },
  async mounted() {
    if (this.stateId) {
      await this.fetchCities(this.stateId)
    }
  },
  watch: {
    modelValue(val) {
      this.internalValue = val
    },
    internalValue(val) {
      this.$emit("update:modelValue", val)
    },
    async stateId(newVal) {
      if (newVal) {
        // Changing the state reloads the list and clears a now-invalid city.
        await this.fetchCities(newVal)
      } else {
        this.cities = []
        this.internalValue = null
      }
    },
  },
  methods: {
    async fetchCities(stateId) {
      this.loading = true
      try {
        const { data } = await api.get("/cities/list", {
          params: { stateId },
        })
        this.cities = data.cities

        // Keep the current city only if it belongs to the loaded list; this
        // preserves the value on first load (edit mode) and clears it when the
        // user switches to a state that doesn't have it.
        if (this.internalValue && !this.cities.some(c => c.id === this.internalValue)) {
          this.internalValue = null
        }
      } catch (err) {
        console.error("Erro ao carregar cidades:", err)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
