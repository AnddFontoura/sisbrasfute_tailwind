<template>
  <system-layout>
    <main>
      <team-banner v-if="teamId" :teamInfoId="teamId"></team-banner>

      <div class="mt-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Camisas do Time</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Cadastre as camisas do time com foto, nome e preço. Os jogadores poderão informar os números que possuem de cada camisa.
        </p>
      </div>

      <!-- Formulário de criação/edição -->
      <div class="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-5">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {{ editing ? 'Editar Camisa' : 'Nova Camisa' }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome popular</label>
            <input
              v-model="form.name"
              type="text"
              maxlength="100"
              placeholder="Ex: Camisa branca, Uniforme 1"
              class="mt-1 w-full border border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Preço (opcional)</label>
            <div class="relative mt-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">R$</span>
              <input
                v-model="form.price"
                type="text"
                inputmode="decimal"
                placeholder="0,00"
                class="w-full border border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Foto -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Foto da camisa</label>
          <div class="mt-2 flex items-center gap-4">
            <img
              v-if="photoPreviewUrl"
              :src="photoPreviewUrl"
              alt="Prévia da camisa"
              class="h-20 w-20 rounded-lg object-cover border border-gray-200 dark:border-white/10"
            />
            <div class="flex flex-col gap-2">
              <input
                ref="photoInput"
                type="file"
                accept="image/png,image/jpeg,image/gif"
                class="text-sm text-gray-600 dark:text-gray-300"
                @change="onPhotoChange"
              />
              <button
                v-if="photoPreviewUrl"
                type="button"
                class="text-xs text-red-600 hover:underline text-left"
                @click="onRemovePhoto"
              >
                Remover foto
              </button>
            </div>
          </div>
          <p v-if="photoError" class="mt-1 text-sm text-red-600">{{ photoError }}</p>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            @click="saveUniform"
            :disabled="saving"
            class="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow-sm disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editing ? 'Atualizar' : 'Criar') }}
          </button>
          <button
            v-if="editing"
            @click="cancelEdit"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-white/10 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="mt-6 text-center text-gray-500 dark:text-gray-400">
        Carregando camisas...
      </div>

      <!-- Empty -->
      <div
        v-else-if="uniforms.length === 0"
        class="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 shadow-sm dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-300"
      >
        <p class="text-sm font-medium">Nenhuma camisa cadastrada. Crie a primeira acima.</p>
      </div>

      <!-- Lista -->
      <div v-else class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="uniform in uniforms"
          :key="uniform.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4"
        >
          <div class="flex items-center gap-3">
            <img
              v-if="uniformPhoto(uniform)"
              :src="uniformPhoto(uniform)"
              alt=""
              class="h-14 w-14 rounded-lg object-cover border border-gray-200 dark:border-white/10 cursor-pointer transition hover:ring-2 hover:ring-orange-400"
              @click="openLightbox(uniformPhoto(uniform))"
            />
            <div v-else class="h-14 w-14 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-300 dark:text-gray-600">
              <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 4.5 4 6.5V10l2.5-1v9.5h11V9L20 10V6.5L16.5 4.5 14 6a2 2 0 0 1-4 0L7.5 4.5Z" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ uniform.name }}</p>
              <p v-if="uniform.price_cents != null" class="text-xs text-orange-600 dark:text-orange-400">
                {{ formatCurrencyCents(uniform.price_cents) }}
              </p>
              <p v-else class="text-xs text-gray-400 dark:text-gray-500">Sem preço</p>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-end gap-2">
            <button
              @click="startEdit(uniform)"
              class="p-1.5 text-gray-500 hover:text-orange-500 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(uniform)"
              class="p-1.5 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
              title="Excluir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Lightbox -->
    <Transition name="fade">
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer"
        @click.self="closeLightbox"
      >
        <img
          :src="lightboxImageUrl"
          class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg cursor-pointer"
          @click="closeLightbox"
        />
      </div>
    </Transition>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import Swal from "@/services/swal.js";
import { resolveStorageUrl } from "@/services/storage.js";

export default {
  name: "TeamUniforms",
  components: {
    systemLayout,
    TeamBanner,
  },
  data() {
    return {
      teamId: null,
      uniforms: [],
      loading: false,
      saving: false,
      editing: null,
      form: {
        name: '',
        price: '',
      },
      formErrors: {
        name: null,
      },
      photoFile: null,
      photoPreviewUrl: null,
      removePhoto: false,
      photoError: null,
      isLightboxOpen: false,
      lightboxImageUrl: null,
    }
  },
  created() {
    this.teamId = this.$route.params.teamId ?? null
    this.loadUniforms()
  },
  mounted() {
    this._escHandler = (e) => { if (e.key === 'Escape' && this.isLightboxOpen) this.closeLightbox() }
    document.addEventListener('keydown', this._escHandler)
  },
  beforeUnmount() {
    this.revokePreviewUrl()
    document.removeEventListener('keydown', this._escHandler)
  },
  methods: {
    // Prefer building from the raw stored path (app convention); fall back to
    // the backend-provided full URL.
    uniformPhoto(uniform) {
      return resolveStorageUrl(uniform.photo) || uniform.photo_url || null
    },

    openLightbox(imageUrl) {
      if (!imageUrl) return
      this.lightboxImageUrl = imageUrl
      this.isLightboxOpen = true
      document.body.classList.add('overflow-hidden')
    },

    closeLightbox() {
      this.isLightboxOpen = false
      this.lightboxImageUrl = null
      document.body.classList.remove('overflow-hidden')
    },

    async loadUniforms() {
      if (!this.teamId) return
      this.loading = true
      try {
        const response = await api.get(`/team/${this.teamId}/uniforms`)
        this.uniforms = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true, position: 'top-end', icon: 'error',
          title: 'Erro ao carregar camisas', showConfirmButton: false, timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    onPhotoChange(event) {
      const file = event.target.files[0]
      if (!file) return

      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']
      const maxSize = 10 * 1024 * 1024

      if (file.size > maxSize) {
        this.photoError = 'O arquivo excede o tamanho máximo de 10MB.'
        event.target.value = ''
        return
      }
      if (!allowedTypes.includes(file.type)) {
        this.photoError = 'Formato não permitido. Use PNG, JPG ou GIF.'
        event.target.value = ''
        return
      }

      this.revokePreviewUrl()
      this.photoFile = file
      this.photoPreviewUrl = URL.createObjectURL(file)
      this.photoError = null
      this.removePhoto = false
    },

    onRemovePhoto() {
      this.revokePreviewUrl()
      this.photoFile = null
      this.photoPreviewUrl = null
      this.photoError = null
      this.removePhoto = true
      if (this.$refs.photoInput) this.$refs.photoInput.value = ''
    },

    revokePreviewUrl() {
      if (this.photoPreviewUrl && this.photoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.photoPreviewUrl)
      }
    },

    parsePriceToCents(value) {
      if (value === null || value === undefined || value === '') return null
      const normalized = String(value).replace(/\./g, '').replace(',', '.')
      const num = Number(normalized)
      if (Number.isNaN(num) || num < 0) return null
      return Math.round(num * 100)
    },

    formatCurrencyCents(cents) {
      return ((Number(cents) || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },

    async saveUniform() {
      this.formErrors.name = null
      if (!this.form.name || !this.form.name.trim()) {
        this.formErrors.name = 'O nome da camisa é obrigatório.'
        return
      }

      this.saving = true

      const formData = new FormData()
      formData.append('name', this.form.name.trim())
      const priceCents = this.parsePriceToCents(this.form.price)
      if (priceCents !== null) formData.append('price_cents', priceCents)
      if (this.photoFile) formData.append('uniformPhoto', this.photoFile)
      if (this.removePhoto) formData.append('removePhoto', '1')

      try {
        const url = this.editing
          ? `/team/${this.teamId}/uniforms/${this.editing.id}`
          : `/team/${this.teamId}/uniforms`

        await api.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        await Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: this.editing ? 'Camisa atualizada' : 'Camisa criada',
          showConfirmButton: false, timer: 2500,
        })

        this.resetForm()
        await this.loadUniforms()
      } catch (err) {
        console.error(err)
        if (err.response?.status === 422) {
          const data = err.response.data || {}
          const fieldErrors = data.errors || {}
          if (fieldErrors.name?.[0]) this.formErrors.name = fieldErrors.name[0]
          if (fieldErrors.uniformPhoto?.[0]) this.photoError = fieldErrors.uniformPhoto[0]
          if (fieldErrors.price_cents?.[0]) this.formErrors.name = this.formErrors.name || fieldErrors.price_cents[0]
          // Fall back to the top-level message when no specific field error matched.
          if (!this.formErrors.name && !this.photoError) {
            this.formErrors.name = data.message || 'Erro de validação'
          }
        } else if (err.response?.status === 413) {
          this.photoError = 'A imagem é muito grande para o servidor. Escolha um arquivo menor.'
        } else if (err.response?.status === 403) {
          await Swal.fire({
            toast: true, position: 'top-end', icon: 'error',
            title: 'Você não tem permissão para gerenciar camisas',
            showConfirmButton: false, timer: 3000,
          })
        } else {
          await Swal.fire({
            toast: true, position: 'top-end', icon: 'error',
            title: 'Erro ao salvar camisa', showConfirmButton: false, timer: 3000,
          })
        }
      } finally {
        this.saving = false
      }
    },

    startEdit(uniform) {
      this.editing = uniform
      this.form.name = uniform.name
      this.form.price = uniform.price_cents != null ? (uniform.price_cents / 100).toFixed(2).replace('.', ',') : ''
      this.formErrors.name = null
      this.revokePreviewUrl()
      this.photoFile = null
      this.photoPreviewUrl = this.uniformPhoto(uniform)
      this.removePhoto = false
      if (this.$refs.photoInput) this.$refs.photoInput.value = ''
    },

    cancelEdit() {
      this.resetForm()
    },

    resetForm() {
      this.editing = null
      this.form.name = ''
      this.form.price = ''
      this.formErrors.name = null
      this.revokePreviewUrl()
      this.photoFile = null
      this.photoPreviewUrl = null
      this.removePhoto = false
      if (this.$refs.photoInput) this.$refs.photoInput.value = ''
    },

    async confirmDelete(uniform) {
      const result = await Swal.fire({
        title: 'Excluir camisa?',
        text: `A camisa "${uniform.name}" será removida.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
      })
      if (result.isConfirmed) await this.deleteUniform(uniform)
    },

    async deleteUniform(uniform) {
      try {
        await api.delete(`/team/${this.teamId}/uniforms/${uniform.id}`)
        await Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: 'Camisa excluída', showConfirmButton: false, timer: 2500,
        })
        await this.loadUniforms()
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true, position: 'top-end', icon: 'error',
          title: 'Erro ao excluir camisa', showConfirmButton: false, timer: 3000,
        })
      }
    },
  },
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
