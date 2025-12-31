<template>

  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200" aria-label="stateSelect">Estado</label>
    <Multiselect
      id="stateSelect"
      v-model="internalValue"
      :options="this.states"
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
  name: "StateSelect",
  components: {
    Multiselect
  },
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
