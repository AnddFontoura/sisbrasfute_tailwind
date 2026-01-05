<template>
  <div class="mt-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200" aria-label="playerPositionSelect">Posição do Jogador</label>
    <Multiselect
      :multiple="isMultiselect"
      id="stateSelect"
      v-model="internalValue"
      :options="this.playerPositions"
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
  name: "GamePositionSelect",
  components: {
    Multiselect
  },
  props: {
    modelValue: [String, Number],
    isMultiselect: [Boolean]
  },
  data() {
    return {
      playerPositions: [],
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
      const { data } = await api.get("/game-positions/list")
      this.playerPositions = data.gamePositions
    } catch (err) {
      console.error("Erro ao carregar estados:", err)
    }
  },
}
</script>
