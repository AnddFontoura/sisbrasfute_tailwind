<template>
  <router-link
    :to="url"
    class="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
  >
    {{ text }}
  </router-link>
</template>

<script setup>
const props = defineProps({
  url: {
    type: Object,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})
</script>
