<template>
  <div class="mt-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200" aria-label="stateSelect">{{ labelName }}</label>
    <Multiselect
      id="stateSelect"
      v-model="internalValue"
      :options="states"
      track-by="name"
      label="name"
      :searchable="true"
      value-prop="id"
      :loading="loading"
      :disabled="loading"
      :placeholder="loading ? 'Carregando estados...' : placeholder"
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
    labelName: {
      type: String,
      default: "Estado",
    },
    placeholder: {
      type: String,
      default: "Selecione o estado",
    },
  },
  data() {
    return {
      states: [],
      internalValue: this.modelValue,
      loading: false,
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
    this.loading = true
    try {
      const { data } = await api.get("/states/list")
      this.states = data.states
    } catch (err) {
      console.error("Erro ao carregar estados:", err)
    } finally {
      this.loading = false
    }
  },
}
</script>
