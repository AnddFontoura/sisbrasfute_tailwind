<template>
  <div>
  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Cidade</label>
  <select
    v-model="internalValue"
    class="
      col-start-1
      row-start-1
      w-full
      appearance-none
      rounded-md
      bg-white
      py-1.5
      pr-8 pl-3
      text-base
      text-gray-900
      outline-1
      -outline-offset-1
      outline-gray-300
      focus:outline-2
      focus:-outline-offset-2
      focus:outline-indigo-600
      sm:text-sm/6
      dark:bg-white/5
      dark:text-white
      dark:outline-white/10
      dark:*:bg-gray-800
      dark:focus:outline-indigo-500
    "
    :disabled="!stateId"
  >
    <option value="" disabled>Selecione...</option>
    <option
      v-for="city in this.cities"
      :key="city.id"
      :value="city.id"
    >
      {{ city.name }}
    </option>
  </select>
  </div>
</template>

<script>
import api from "@/services/api"

export default {
  name: "CitySelect",
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
