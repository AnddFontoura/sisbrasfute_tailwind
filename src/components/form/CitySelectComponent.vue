<template>
  <div>
  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200" aria-label="citySelect">Cidade</label>

    <Multiselect
      id="citySelect"
      v-model="internalValue"
      :options="this.cities"
      track-by="name"
      label="name"
      :searchable="true"
      value-prop="id"
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
    modelValue: [String, Number],
    stateId: [String, Number], // vem do pai
  },
  data() {
    return {
      cities: [],
      internalValue: this.modelValue,
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
      this.cities = []
      this.internalValue = null
      if (newVal) {
        try {
          const { data } = await api.get("/cities/list", {
            params: { stateId: newVal },
          })
          this.cities = data.cities
        } catch (err) {
          console.error("Erro ao carregar cidades:", err)
        }
      }
    },
  },
}
</script>
