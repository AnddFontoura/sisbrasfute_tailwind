<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true
    }
  },

  computed: {
    pages() {
      const pages = []
      for (let i = 1; i <= this.pagination.last_page; i++) {
        pages.push(i)
      }
      return pages
    }
  },

  methods: {
    changePage(page) {
      if (page === this.pagination.current_page) return

      this.$emit('change', page)
    }
  }
}
</script>

<template>
  <div class="flex gap-2 mt-4 flex-wrap">
    <!-- Previous -->
    <button
      @click="changePage(pagination.current_page - 1)"
      :disabled="pagination.current_page === 1"
      class="px-3 py-1 border rounded"
    >
      ←
    </button>

    <!-- Pages -->
    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      class="px-3 py-1 border rounded"
      :class="{
        'bg-orange-500 text-white': page === pagination.current_page
      }"
    >
      {{ page }}
    </button>

    <!-- Next -->
    <button
      @click="changePage(pagination.current_page + 1)"
      :disabled="pagination.current_page === pagination.last_page"
      class="px-3 py-1 border rounded"
    >
      →
    </button>
  </div>
</template>
