<template>

  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Estado</label>
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
    >
      <option value="" disabled>Selecione...</option>
      <option
        v-for="state in this.states"
        :key="state.id"
        :value="state.id"
      >
        {{ state.name }}
      </option>
    </select>
  </div>
</template>

<script>
import api from "@/services/api"

export default {
  name: "StateSelect",
  props: {
    modelValue: [String, Number],
  },
  data() {
    return {
      states: [],
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
  },
  async mounted() {
    try {
      const { data } = await api.get("/states/list")
      this.states = data.states
    } catch (err) {
      console.error("Erro ao carregar estados:", err)
    }
  },
}
</script>
