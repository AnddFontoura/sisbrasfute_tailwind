<template>
  <div class="mt-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200" aria-label="playerPositionSelect">Posição do Jogador</label>
    <Multiselect
      :mode="isMultiselect"
      id="stateSelect"
      v-model="internalValue"
      :options="this.playerPositions"
      track-by="name"
      label="name"
      :searchable="true"
      value-prop="id"
      :close-on-select="false"
      :clear-on-select="false"
    />
  </div>
</template>

<script>
import { fetchGamePositions } from "@/services/gamePositionService"
import Multiselect from '@vueform/multiselect'

export default {
  name: "GamePositionSelect",
  components: {
    Multiselect
  },
  props: {
    modelValue: {
      type: Array,
    },
    isMultiselect: {
      type: String,
      default: 'single'
    },
    teamId: {
      type: Number,
      default: null
    }
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
      if (this.isMultiselect === 'multiple') {
        this.$emit('update:modelValue', val ?? [])
      } else {
        this.$emit(
          'update:modelValue',
          val ? [val] : []
        )
      }
    },
  },
  async mounted() {
    try {
      this.playerPositions = await fetchGamePositions(this.teamId)
    } catch (err) {
      console.error("Erro ao carregar posições:", err)
    }
  },
}
</script>
