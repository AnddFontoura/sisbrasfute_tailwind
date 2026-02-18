<template>
  <div class="mt-3 p-2">
    <label
      class="
        block
        text-sm
        font-medium
        text-gray-700
        dark:text-gray-200
      "
      aria-label="
        citySelect
      "
    >
      {{ labelName }}
    </label>

    <Multiselect
      id="teamsSelect"
      v-model="internalValue"
      :options="this.teams"
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
  name: "TeamsManagedByUserComponent",
  components: {
    Multiselect
  },
  props: {
    labelName: {
      type: String,
      default: "Seus times",
    },
    modelValue: [String, Number],
  },
  data() {
    return {
      teams: [],
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
    this.teams = []
    this.internalValue = null

    try {
      const { data } = await api.get("/team/list/my-teams")
      this.teams = data.teams
    } catch (err) {
      console.error("Erro ao carregar times:", err)
    }
  },
}
</script>
