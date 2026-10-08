<template>
  <div>
    <!-- Preview + actions -->
    <div class="flex flex-col items-center gap-3">
      <div
        v-if="displayPreview"
        class="overflow-hidden border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-gray-700"
        :class="[previewClass, stencil === 'circle' ? 'rounded-full' : 'rounded-lg']"
      >
        <img :src="displayPreview" alt="Pré-visualização" class="h-full w-full object-cover" />
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <label
          class="cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          :class="{ 'pointer-events-none opacity-50': disabled }"
        >
          <span>{{ displayPreview ? 'Trocar imagem' : buttonLabel }}</span>
          <input
            ref="fileInput"
            type="file"
            class="sr-only"
            :accept="accept"
            :disabled="disabled"
            @change="onFileChange"
          />
        </label>

        <button
          v-if="displayPreview"
          type="button"
          :disabled="disabled"
          class="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
          @click="onRemove"
        >
          Remover
        </button>
      </div>

      <p v-if="hint" class="text-xs text-gray-500 dark:text-gray-400">{{ hint }}</p>
      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Crop modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      >
        <div class="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
          <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Recortar imagem</h3>
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="cancelCrop"
            >
              ×
            </button>
          </div>

          <div class="p-5">
            <div class="crop-area overflow-hidden rounded-lg bg-gray-900">
              <Cropper
                ref="cropper"
                class="h-[360px]"
                :src="rawImageUrl"
                :stencil-component="stencilComponent"
                :stencil-props="stencilProps"
                image-restriction="fit-area"
              />
            </div>
            <p class="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              Arraste para posicionar e use as alças para ajustar a área de recorte.
            </p>
          </div>

          <div class="flex justify-end gap-3 border-t border-gray-100 px-5 py-4 dark:border-gray-700">
            <button
              type="button"
              class="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              @click="cancelCrop"
            >
              Cancelar
            </button>
            <button
              type="button"
              :disabled="processing"
              class="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              @click="confirmCrop"
            >
              {{ processing ? 'Processando...' : 'Recortar e usar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { Cropper, CircleStencil, RectangleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  name: 'ImageCropUpload',
  components: {
    Cropper,
    // Registrados para resolução dinâmica via stencilComponent.
    CircleStencil,
    RectangleStencil,
  },
  props: {
    // Imagem já existente (URL) para exibir como preview inicial.
    modelValue: {
      type: String,
      default: null,
    },
    buttonLabel: {
      type: String,
      default: 'Escolher imagem',
    },
    // Proporção fixa do recorte (ex.: 1 para 1:1, 16/6 para banner). null = livre.
    aspectRatio: {
      type: Number,
      default: null,
    },
    // 'rectangle' ou 'circle'.
    stencil: {
      type: String,
      default: 'rectangle',
    },
    accept: {
      type: String,
      default: 'image/png,image/jpeg,image/gif,image/webp',
    },
    maxSize: {
      type: Number,
      default: 10 * 1024 * 1024, // 10MB
    },
    // Classe para dimensionar o preview (ex.: 'h-28 w-28', 'h-40 w-full').
    previewClass: {
      type: String,
      default: 'h-28 w-28',
    },
    hint: {
      type: String,
      default: 'PNG, JPG, GIF até 10MB',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // Mime do arquivo gerado após o recorte.
    outputType: {
      type: String,
      default: 'image/jpeg',
    },
    outputQuality: {
      type: Number,
      default: 0.9,
    },
  },
  emits: ['update:modelValue', 'cropped', 'removed'],
  data() {
    return {
      showModal: false,
      rawImageUrl: null, // objectURL da imagem original selecionada
      croppedPreviewUrl: null, // objectURL do resultado recortado
      originalFileName: 'imagem',
      error: null,
      processing: false,
    }
  },
  computed: {
    stencilComponent() {
      return this.stencil === 'circle' ? CircleStencil : RectangleStencil
    },
    stencilProps() {
      const props = {}
      if (this.aspectRatio) {
        props.aspectRatio = this.aspectRatio
      }
      return props
    },
    displayPreview() {
      return this.croppedPreviewUrl || this.modelValue
    },
  },
  beforeUnmount() {
    this.revokeRaw()
    this.revokeCropped()
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files && event.target.files[0]
      // Permite reselecionar o mesmo arquivo depois.
      if (event.target) event.target.value = ''
      if (!file) return

      this.error = null

      if (file.size > this.maxSize) {
        this.error = `O arquivo excede o tamanho máximo de ${Math.round(this.maxSize / (1024 * 1024))}MB.`
        return
      }
      if (!file.type.startsWith('image/')) {
        this.error = 'Selecione um arquivo de imagem válido.'
        return
      }

      this.originalFileName = file.name || 'imagem'
      this.revokeRaw()
      this.rawImageUrl = URL.createObjectURL(file)
      this.showModal = true
      document.body.classList.add('overflow-hidden')
    },

    cancelCrop() {
      this.closeModal()
    },

    closeModal() {
      this.showModal = false
      this.revokeRaw()
      document.body.classList.remove('overflow-hidden')
    },

    async confirmCrop() {
      const cropper = this.$refs.cropper
      if (!cropper) return

      this.processing = true
      try {
        const { canvas } = cropper.getResult()
        if (!canvas) {
          this.error = 'Não foi possível gerar o recorte.'
          return
        }

        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, this.outputType, this.outputQuality)
        })

        if (!blob) {
          this.error = 'Não foi possível gerar o recorte.'
          return
        }

        const file = new File([blob], this.buildFileName(), { type: this.outputType })

        this.revokeCropped()
        this.croppedPreviewUrl = URL.createObjectURL(blob)

        this.$emit('cropped', file)
        this.$emit('update:modelValue', this.croppedPreviewUrl)

        this.closeModal()
      } catch (err) {
        console.error('Erro ao recortar imagem:', err)
        this.error = 'Erro ao recortar a imagem.'
      } finally {
        this.processing = false
      }
    },

    buildFileName() {
      const ext = this.outputType === 'image/png' ? 'png'
        : this.outputType === 'image/webp' ? 'webp'
          : 'jpg'
      const base = String(this.originalFileName).replace(/\.[^.]+$/, '') || 'imagem'
      return `${base}.${ext}`
    },

    onRemove() {
      this.revokeCropped()
      this.croppedPreviewUrl = null
      this.error = null
      this.$emit('removed')
      this.$emit('update:modelValue', null)
    },

    revokeRaw() {
      if (this.rawImageUrl) {
        URL.revokeObjectURL(this.rawImageUrl)
        this.rawImageUrl = null
      }
    },

    revokeCropped() {
      if (this.croppedPreviewUrl && this.croppedPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.croppedPreviewUrl)
      }
    },
  },
}
</script>

<style scoped>
.crop-area :deep(.vue-advanced-cropper__background),
.crop-area :deep(.vue-advanced-cropper__foreground) {
  background: #111827;
}
</style>
