<template>
  <!-- Card grid: mirrors listing screens that render cards in a responsive grid -->
  <div
    v-if="variant === 'card-grid'"
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    role="status"
    aria-label="Carregando"
  >
    <div
      v-for="n in count"
      :key="n"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800 animate-pulse"
    >
      <div class="h-24 bg-gray-200 dark:bg-gray-700"></div>
      <div class="relative px-4">
        <div class="-mt-8 flex items-end gap-3">
          <div class="h-16 w-16 flex-shrink-0 rounded-full border-4 border-white bg-gray-200 dark:border-gray-800 dark:bg-gray-700"></div>
          <div class="mb-1 h-4 w-28 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
      <div class="px-4 py-3">
        <div class="grid grid-cols-2 gap-2">
          <div class="h-12 rounded-lg bg-gray-100 dark:bg-gray-700/50"></div>
          <div class="h-12 rounded-lg bg-gray-100 dark:bg-gray-700/50"></div>
        </div>
      </div>
      <div class="px-4 pb-4">
        <div class="h-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  </div>

  <!-- List: rows with an avatar and two text lines (players, notifications, ...) -->
  <div v-else-if="variant === 'list'" class="space-y-3" role="status" aria-label="Carregando">
    <div
      v-for="n in count"
      :key="n"
      class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-white/10 dark:bg-gray-700/40 animate-pulse"
    >
      <div class="h-12 w-12 shrink-0 rounded-full bg-gray-200 dark:bg-gray-600"></div>
      <div class="min-w-0 flex-1 space-y-2">
        <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-600"></div>
        <div class="h-3 w-20 rounded bg-gray-200 dark:bg-gray-600"></div>
      </div>
    </div>
  </div>

  <!-- Table: header-less rows for admin tables -->
  <div
    v-else-if="variant === 'table'"
    class="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10"
    role="status"
    aria-label="Carregando"
  >
    <div
      v-for="n in count"
      :key="n"
      class="flex items-center gap-4 border-b border-gray-100 bg-white px-4 py-3 last:border-b-0 dark:border-white/5 dark:bg-gray-800 animate-pulse"
    >
      <div class="h-4 flex-1 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    </div>
  </div>

  <!-- Text: stacked lines, for detail panels / descriptions -->
  <div v-else class="space-y-3" role="status" aria-label="Carregando">
    <div
      v-for="n in count"
      :key="n"
      class="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
      :class="n === count ? 'w-2/3' : 'w-full'"
    ></div>
  </div>
</template>

<script>
export default {
  name: "SkeletonLoader",
  props: {
    // card-grid | list | table | text
    variant: {
      type: String,
      default: "list",
    },
    // How many placeholder items to render.
    count: {
      type: Number,
      default: 6,
    },
  },
}
</script>
