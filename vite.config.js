import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      enabled: process.env.NODE_ENV !== 'production',
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ui': ['@headlessui/vue', '@heroicons/vue'],
          'vendor-forms': ['@vueform/multiselect', '@vueup/vue-quill'],
          'vendor-utils': ['axios', 'sweetalert2'],
        }
      }
    }
  }
})
