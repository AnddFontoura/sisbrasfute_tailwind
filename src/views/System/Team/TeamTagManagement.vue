<template>
  <system-layout>
    <main>
      <team-banner
        v-if="teamId"
        :teamInfoId="teamId"
      >
      </team-banner>

      <div class="mt-6">
        <h2 class="text-xl font-bold text-gray-900">Gerenciar Tags</h2>
        <p class="mt-1 text-sm text-gray-500">
          Crie e gerencie tags para categorizar os jogadores do seu time.
        </p>
      </div>

      <!-- Formulário de criação/edição -->
      <div class="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          {{ editingTag ? 'Editar Tag' : 'Nova Tag' }}
        </h3>

        <div class="flex flex-col sm:flex-row gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              v-model="form.name"
              type="text"
              maxlength="50"
              placeholder="Ex: Titular, Reserva, Sub-20"
              class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              @keyup.enter="saveTag"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
          </div>

          <div class="w-32">
            <label class="block text-sm font-medium text-gray-700">Cor</label>
            <input
              v-model="form.color"
              type="color"
              class="mt-1 w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>

          <div class="flex gap-2">
            <button
              @click="saveTag"
              :disabled="saving"
              class="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white
                hover:bg-orange-600 shadow-sm disabled:opacity-50"
            >
              {{ saving ? 'Salvando...' : (editingTag ? 'Atualizar' : 'Criar') }}
            </button>

            <button
              v-if="editingTag"
              @click="cancelEdit"
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="mt-6 text-center text-gray-500">
        Carregando tags...
      </div>

      <!-- Empty state -->
      <div
        v-else-if="tags.length === 0"
        class="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 shadow-sm"
      >
        <p class="text-sm font-medium">
          Nenhuma tag cadastrada. Crie a primeira tag acima.
        </p>
      </div>

      <!-- Lista de tags -->
      <div v-else class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              :style="{ backgroundColor: tag.color }"
            >
              {{ tag.name }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="startEdit(tag)"
              class="p-1.5 text-gray-500 hover:text-orange-500 rounded-lg hover:bg-gray-100"
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>

            <button
              @click="confirmDelete(tag)"
              class="p-1.5 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100"
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
  </system-layout>
</template>

<script>
import api from "@/services/api";
import systemLayout from "@/components/layouts/systemLayout.vue";
import TeamBanner from "@/components/team/teamBanner.vue";
import Swal from "@/services/swal.js";

export default {
  name: "TeamTagManagement",
  components: {
    systemLayout,
    TeamBanner,
  },
  data() {
    return {
      teamId: null,
      tags: [],
      loading: false,
      saving: false,
      editingTag: null,
      form: {
        name: '',
        color: '#6b7280',
      },
      formErrors: {
        name: null,
      },
    }
  },
  created() {
    this.teamId = this.$route.params.teamId ?? null
    this.loadTags()
  },
  methods: {
    async loadTags() {
      if (!this.teamId) return

      this.loading = true
      try {
        const response = await api.get(`/team/${this.teamId}/tags`)
        this.tags = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar tags',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    async saveTag() {
      this.formErrors.name = null

      if (!this.form.name || !this.form.name.trim()) {
        this.formErrors.name = 'O nome da tag é obrigatório.'
        return
      }

      if (this.form.name.length > 50) {
        this.formErrors.name = 'O nome deve ter no máximo 50 caracteres.'
        return
      }

      this.saving = true

      try {
        if (this.editingTag) {
          await api.put(`/team/${this.teamId}/tags/${this.editingTag.id}`, {
            name: this.form.name.trim(),
            color: this.form.color,
          })

          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Tag atualizada com sucesso',
            showConfirmButton: false,
            timer: 3000,
          })
        } else {
          await api.post(`/team/${this.teamId}/tags`, {
            name: this.form.name.trim(),
            color: this.form.color,
          })

          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Tag criada com sucesso',
            showConfirmButton: false,
            timer: 3000,
          })
        }

        this.resetForm()
        await this.loadTags()
      } catch (err) {
        console.error(err)

        if (err.response?.status === 422) {
          const errors = err.response.data.errors || err.response.data
          this.formErrors.name = errors.name?.[0] || errors.message || 'Erro de validação'
        } else if (err.response?.status === 403) {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Você não tem permissão para gerenciar tags',
            showConfirmButton: false,
            timer: 3000,
          })
        } else {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Erro ao salvar tag',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      } finally {
        this.saving = false
      }
    },

    startEdit(tag) {
      this.editingTag = tag
      this.form.name = tag.name
      this.form.color = tag.color
      this.formErrors.name = null
    },

    cancelEdit() {
      this.resetForm()
    },

    resetForm() {
      this.editingTag = null
      this.form.name = ''
      this.form.color = '#6b7280'
      this.formErrors.name = null
    },

    async confirmDelete(tag) {
      const result = await Swal.fire({
        title: 'Excluir tag?',
        text: `A tag "${tag.name}" será removida de todos os jogadores e partidas associados.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        await this.deleteTag(tag)
      }
    },

    async deleteTag(tag) {
      try {
        await api.delete(`/team/${this.teamId}/tags/${tag.id}`)

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Tag excluída com sucesso',
          showConfirmButton: false,
          timer: 3000,
        })

        await this.loadTags()
      } catch (err) {
        console.error(err)

        if (err.response?.status === 403) {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Você não tem permissão para excluir tags',
            showConfirmButton: false,
            timer: 3000,
          })
        } else {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Erro ao excluir tag',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      }
    },
  },
}
</script>
