<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true
    }
  },

  computed: {
    visiblePages() {
      const current = this.pagination.current_page
      const last = this.pagination.last_page
      const pages = []

      if (last <= 7) {
        for (let i = 1; i <= last; i++) pages.push(i)
        return pages
      }

      // Sempre mostra primeira página
      pages.push(1)

      if (current > 3) {
        pages.push('...')
      }

      // Páginas ao redor da atual
      const start = Math.max(2, current - 1)
      const end = Math.min(last - 1, current + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (current < last - 2) {
        pages.push('...')
      }

      // Sempre mostra última página
      pages.push(last)

      return pages
    }
  },

  methods: {
    changePage(page) {
      if (page === '...' || page === this.pagination.current_page) return
      if (page < 1 || page > this.pagination.last_page) return

      this.$emit('change', page)
    }
  }
}
</script>

<template>
  <div v-if="pagination.last_page > 1" class="flex gap-2 mt-4 flex-wrap items-center">
    <!-- Previous -->
    <button
      @click="changePage(pagination.current_page - 1)"
      :disabled="pagination.current_page === 1"
      class="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10"
    >
      ←
    </button>

    <!-- Pages -->
    <template v-for="page in visiblePages" :key="page">
      <span
        v-if="page === '...'"
        class="px-2 py-1 text-gray-400"
      >
        …
      </span>
      <button
        v-else
        @click="changePage(page)"
        class="px-3 py-1 border rounded transition-colors dark:border-white/10"
        :class="{
          'bg-orange-500 text-white border-orange-500': page === pagination.current_page,
          'hover:bg-gray-100 dark:hover:bg-white/10': page !== pagination.current_page
        }"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next -->
    <button
      @click="changePage(pagination.current_page + 1)"
      :disabled="pagination.current_page === pagination.last_page"
      class="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10"
    >
      →
    </button>
  </div>
</template>
