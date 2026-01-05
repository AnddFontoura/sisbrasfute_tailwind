<template>
  <div class="mt-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200" aria-label="stateSelect">Modalidades que joga</label>
    <Multiselect
      id="stateSelect"
      v-model="internalValue"
      :options="this.modalities"
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
  name: "ModalitiesSelect",
  components: {
    Multiselect
  },
  props: {
    isMultiselect: [Boolean],
    modelValue: [String, Number],
  },
  data() {
    return {
      modalities: [],
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
      const { data } = await api.get("/modalities/list")
      this.modalities = data.modalities
    } catch (err) {
      console.error("Erro ao carregar estados:", err)
    }
  },
}
</script>
