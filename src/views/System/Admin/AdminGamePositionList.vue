<template>
  <system-layout>
    <main class="py-8">
      <div>
        <!-- Header -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">Administração - Posições de Jogo</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gerencie as posições disponíveis no sistema.
            </p>
          </div>
          <button
            type="button"
            @click="openCreateModal"
            class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nova Posição
          </button>
        </div>

        <!-- Filters -->
        <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-800">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Nome</label>
              <input
                v-model="filters.name"
                type="text"
                placeholder="Filtrar por nome..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @input="debouncedFetch"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Sigla</label>
              <input
                v-model="filters.short"
                type="text"
                placeholder="Filtrar por sigla..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @input="debouncedFetch"
              >
            </div>
            <div class="flex items-end">
              <label class="text-xs font-semibold text-gray-600 dark:text-gray-300 mr-2">Itens por página:</label>
              <select
                v-model="perPage"
                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="fetchPositions(1)"
              >
                <option :value="10">10</option>
                <option :value="15">15</option>
                <option :value="30">30</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
        </div>

        <!-- Empty state -->
        <div v-else-if="positions.length === 0" class="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          Nenhuma posição encontrada.
        </div>

        <!-- Table -->
        <div v-else class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">ID</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nome</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sigla</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Botão (Preview)</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr
                  v-for="position in positions"
                  :key="position.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ position.id }}</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ position.name }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {{ position.short }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div v-if="position.icon" v-html="position.icon" class="inline-block"></div>
                    <span v-else class="text-xs text-gray-400">—</span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="openViewModal(position)"
                        class="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                        title="Visualizar"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        @click="openEditModal(position)"
                        class="rounded-lg p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                        title="Editar"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <pagination-component :pagination="pagination" @change="fetchPositions"></pagination-component>
      </div>
    </main>

    <!-- View Modal -->
    <Teleport to="body">
      <div
        v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showViewModal = false"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Detalhes da Posição</h2>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition dark:hover:bg-gray-700 dark:hover:text-gray-200"
              @click="showViewModal = false"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="viewPosition" class="space-y-4">
            <dl class="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">ID</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ viewPosition.id }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Sigla</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ viewPosition.short }}</dd>
              </div>
              <div class="col-span-2">
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Nome</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ viewPosition.name }}</dd>
              </div>
              <div class="col-span-2">
                <dt class="text-xs font-semibold text-gray-500 dark:text-gray-400">Descrição</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ viewPosition.description || '—' }}</dd>
              </div>
            </dl>

            <!-- Button Preview -->
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Preview do Botão</p>
              <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-gray-900/50">
                <div v-if="viewPosition.icon" v-html="viewPosition.icon"></div>
                <span v-else class="text-sm text-gray-400">Nenhum HTML de botão definido.</span>
              </div>
            </div>

            <!-- Raw HTML -->
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">HTML do Botão</p>
              <pre class="rounded-lg bg-gray-900 p-3 text-xs text-green-400 overflow-x-auto"><code>{{ viewPosition.icon || '(vazio)' }}</code></pre>
            </div>
          </div>

          <div class="mt-5 flex justify-end">
            <button
              @click="showViewModal = false"
              class="rounded-xl bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showEditModal = false"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Editar Posição</h2>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition dark:hover:bg-gray-700 dark:hover:text-gray-200"
              @click="showEditModal = false"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleUpdate" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Nome -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Nome *</label>
                <input
                  v-model="editForm.name"
                  type="text"
                  maxlength="100"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <p v-if="editErrors.name" class="mt-1 text-xs text-red-600">{{ editErrors.name[0] }}</p>
              </div>

              <!-- Sigla -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Sigla *</label>
                <input
                  v-model="editForm.short"
                  type="text"
                  maxlength="10"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <p v-if="editErrors.short" class="mt-1 text-xs text-red-600">{{ editErrors.short[0] }}</p>
              </div>
            </div>

            <!-- Descrição -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Descrição</label>
              <textarea
                v-model="editForm.description"
                rows="2"
                maxlength="10000"
                placeholder="Descrição da posição..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              ></textarea>
              <p v-if="editErrors.description" class="mt-1 text-xs text-red-600">{{ editErrors.description[0] }}</p>
            </div>

            <!-- Icon (HTML do Botão) -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">HTML do Botão (icon)</label>
              <textarea
                v-model="editForm.icon"
                rows="3"
                maxlength="500"
                placeholder="<p class='btn btn-sm btn-success w-100'> GK </p>"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              ></textarea>
              <p v-if="editErrors.icon" class="mt-1 text-xs text-red-600">{{ editErrors.icon[0] }}</p>
            </div>

            <!-- Live Preview -->
            <div>
              <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Preview em Tempo Real</p>
              <div class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900/50">
                <div v-if="editForm.icon && editForm.icon.trim()" v-html="editForm.icon" class="inline-block"></div>
                <span v-else class="text-sm text-gray-400 italic">Digite o HTML acima para visualizar o botão aqui...</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="showEditModal = false"
                class="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="saving" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                {{ saving ? 'Salvando...' : 'Salvar alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Create Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showCreateModal = false"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nova Posição de Jogo</h2>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition dark:hover:bg-gray-700 dark:hover:text-gray-200"
              @click="showCreateModal = false"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleCreate" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Nome *</label>
                <input
                  v-model="createForm.name"
                  type="text"
                  maxlength="100"
                  placeholder="Ex: Goleiro"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <p v-if="createErrors.name" class="mt-1 text-xs text-red-600">{{ createErrors.name[0] }}</p>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Sigla *</label>
                <input
                  v-model="createForm.short"
                  type="text"
                  maxlength="10"
                  placeholder="Ex: GK"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <p v-if="createErrors.short" class="mt-1 text-xs text-red-600">{{ createErrors.short[0] }}</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Descrição</label>
              <textarea
                v-model="createForm.description"
                rows="2"
                maxlength="10000"
                placeholder="Descrição da posição..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">HTML do Botão (icon)</label>
              <textarea
                v-model="createForm.icon"
                rows="3"
                maxlength="500"
                placeholder="<p class='btn btn-sm btn-success w-100'> GK </p>"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <!-- Live Preview -->
            <div>
              <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Preview em Tempo Real</p>
              <div class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900/50">
                <div v-if="createForm.icon && createForm.icon.trim()" v-html="createForm.icon" class="inline-block"></div>
                <span v-else class="text-sm text-gray-400 italic">Digite o HTML acima para visualizar o botão aqui...</span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="showCreateModal = false"
                class="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="creating" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                {{ creating ? 'Criando...' : 'Criar Posição' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </system-layout>
</template>

<script>
import systemLayout from "@/components/layouts/systemLayout.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";
import api from "@/services/api.js";
import Swal from "@/services/swal.js";

export default {
  name: "AdminGamePositionList",
  components: {
    systemLayout,
    PaginationComponent,
  },

  data() {
    return {
      positions: [],
      pagination: { data: [], current_page: 1, last_page: 1 },
      loading: false,
      perPage: 15,
      filters: {
        name: '',
        short: '',
      },
      debounceTimer: null,

      // View modal
      showViewModal: false,
      viewPosition: null,

      // Edit modal
      showEditModal: false,
      editingId: null,
      editForm: {
        name: '',
        short: '',
        description: '',
        icon: '',
      },
      editErrors: {},
      saving: false,

      // Create modal
      showCreateModal: false,
      createForm: {
        name: '',
        short: '',
        description: '',
        icon: '',
      },
      createErrors: {},
      creating: false,
    }
  },

  created() {
    this.fetchPositions()
  },

  methods: {
    debouncedFetch() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchPositions(1)
      }, 400)
    },

    async fetchPositions(page = 1) {
      this.loading = true
      try {
        const params = { page, per_page: this.perPage }
        if (this.filters.name) params.name = this.filters.name
        if (this.filters.short) params.short = this.filters.short

        const response = await api.get('/admin/game-positions', { params })
        this.positions = response.data.data || []
        this.pagination = response.data
      } catch (err) {
        console.error(err)
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao carregar posições',
          showConfirmButton: false,
          timer: 3000,
        })
      } finally {
        this.loading = false
      }
    },

    openViewModal(position) {
      this.viewPosition = position
      this.showViewModal = true
    },

    openEditModal(position) {
      this.editingId = position.id
      this.editForm = {
        name: position.name || '',
        short: position.short || '',
        description: position.description || '',
        icon: position.icon || '',
      }
      this.editErrors = {}
      this.showEditModal = true
    },

    async handleUpdate() {
      this.editErrors = {}
      this.saving = true

      try {
        await api.put(`/admin/game-positions/${this.editingId}`, this.editForm)

        this.showEditModal = false
        await this.fetchPositions(this.pagination.current_page)

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Posição atualizada!',
          showConfirmButton: false,
          timer: 2000,
        })
      } catch (err) {
        if (err.response?.status === 422 && err.response.data?.errors) {
          this.editErrors = err.response.data.errors
        } else {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: err.response?.data?.message || 'Erro ao atualizar posição.',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      } finally {
        this.saving = false
      }
    },

    openCreateModal() {
      this.createForm = { name: '', short: '', description: '', icon: '' }
      this.createErrors = {}
      this.showCreateModal = true
    },

    async handleCreate() {
      this.createErrors = {}
      this.creating = true

      try {
        await api.post('/admin/game-positions', this.createForm)

        this.showCreateModal = false
        await this.fetchPositions(1)

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Posição criada!',
          showConfirmButton: false,
          timer: 2000,
        })
      } catch (err) {
        if (err.response?.status === 422 && err.response.data?.errors) {
          this.createErrors = err.response.data.errors
        } else {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: err.response?.data?.message || 'Erro ao criar posição.',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      } finally {
        this.creating = false
      }
    },
  },
}
</script>
