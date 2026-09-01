<template>
  <div class="min-h-screen ">
    <TransitionRoot as="template" :show="isSidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="isSidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to=""
          leave="transition-opacity ease-linear duration-300"
          leave-from=""
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/85"></div>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to=""
                leave="ease-in-out duration-300"
                leave-from=""
                leave-to="opacity-0"
              >
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    class="-m-2.5 rounded-xl p-2.5 text-white hover:bg-white/10"
                    @click="isSidebarOpen = false"
                  >
                    <span class="sr-only">Fechar menu</span>
                    <XMarkIcon class="size-6" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <aside class="flex min-h-full grow flex-col border-r border-white/10 bg-[#070707]">
                <div class="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-6">
                  <div class="flex size-10 items-center justify-center rounded-sm bg-orange-500 shadow-[0_0_24px_rgba(249,115,22,0.35)]">
                    <BoltIcon class="size-6 text-white" aria-hidden="true" />
                  </div>

                  <div>
                    <p class="text-sm font-black leading-4 tracking-tight text-white">
                      SisBrasFute
                    </p>
                    <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                      Gestão de Clubes
                    </p>
                  </div>
                </div>

                <nav class="flex flex-1 flex-col overflow-y-auto px-4 py-6">
                  <div class="space-y-7">
                    <div>
                      <p class="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">
                        Navegação
                      </p>

                      <ul role="list" class="space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a
                            v-if="!item.children"
                            @click.prevent="$router.push(item.href); isSidebarOpen = false"
                            :href="item.href"
                            :class="[
                              isCurrentRoute(item.href)
                                ? 'bg-orange-500 text-white shadow-[0_0_26px_rgba(249,115,22,0.28)]'
                                : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white',
                              'group flex items-center gap-x-3 px-3 py-3 text-sm font-black transition-all cursor-pointer'
                            ]"
                          >
                            <component
                              :is="item.icon"
                              :class="[
                                isCurrentRoute(item.href)
                                  ? 'text-white'
                                  : 'text-zinc-500 group-hover:text-orange-400',
                                'size-5 shrink-0 transition-colors'
                              ]"
                              aria-hidden="true"
                            />

                            {{ item.name }}
                          </a>

                          <Disclosure v-else as="div" v-slot="{ open }">
                            <DisclosureButton
                              :class="[
                                item.children.some((child) => isCurrentRoute(child.href))
                                  ? 'bg-orange-500 text-white shadow-[0_0_26px_rgba(249,115,22,0.28)]'
                                  : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white',
                                'group flex w-full items-center gap-x-3 px-3 py-3 text-left text-sm font-black transition-all'
                              ]"
                            >
                              <component
                                :is="item.icon"
                                :class="[
                                  item.children.some((child) => isCurrentRoute(child.href))
                                    ? 'text-white'
                                    : 'text-zinc-500 group-hover:text-orange-400',
                                  'size-5 shrink-0 transition-colors'
                                ]"
                                aria-hidden="true"
                              />

                              {{ item.name }}

                              <ChevronRightIcon
                                :class="[
                                  open ? 'rotate-90 text-orange-400' : 'text-zinc-600',
                                  'ml-auto size-4 shrink-0 transition-transform'
                                ]"
                                aria-hidden="true"
                              />
                            </DisclosureButton>

                            <DisclosurePanel as="ul" class="mt-1 space-y-1 border-l border-white/10 pl-4">
                              <li v-for="subItem in item.children" :key="subItem.name">
                                <DisclosureButton
                                  as="a"
                                  :href="subItem.href"
                                  @click.prevent="$router.push(subItem.href); isSidebarOpen = false"
                                  :class="[
                                    isCurrentRoute(subItem.href)
                                      ? 'bg-orange-500/15 text-orange-400'
                                      : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200',
                                    'block px-3 py-2 text-sm font-bold transition-colors cursor-pointer'
                                  ]"
                                >
                                  {{ subItem.name }}
                                </DisclosureButton>
                              </li>
                            </DisclosurePanel>
                          </Disclosure>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="mt-auto border-t border-white/10 pt-4">
                    <Menu as="div" class="relative">
                      <MenuButton class="flex w-full items-center gap-3 bg-white/[0.04] p-3 text-left hover:bg-white/[0.07]">
                        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white">
                          {{ userInitials }}
                        </div>

                        <div class="min-w-0 flex-1">
                          <p class="truncate text-sm font-black text-white">
                            {{ user.name || 'Usuário' }}
                          </p>
                          <p class="truncate text-xs font-semibold text-zinc-500">
                            Gestor do Clube
                          </p>
                        </div>

                        <ChevronDownIcon class="size-4 text-zinc-500" aria-hidden="true" />
                      </MenuButton>

                      <transition
                        enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform scale-100"
                        leave-to-class="transform opacity-0 scale-95"
                      >
                        <MenuItems class="absolute bottom-full left-0 z-10 mb-2 w-full origin-bottom-left border border-white/10 bg-[#111111] py-2 shadow-2xl">
                          <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                            <a
                              :href="item.href"
                              @click.prevent="$router.push(item.href); isSidebarOpen = false"
                              :class="[
                                active ? 'bg-orange-500 text-white' : 'text-zinc-300',
                                'block px-4 py-2 text-sm font-bold cursor-pointer'
                              ]"
                            >
                              {{ item.name }}
                            </a>
                          </MenuItem>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </div>
                </nav>
              </aside>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <aside class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col border-r border-white/10 bg-[#070707]">
        <div class="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-6">
          <div class="flex size-10 items-center justify-center rounded-sm bg-orange-500 shadow-[0_0_24px_rgba(249,115,22,0.35)]">
            <BoltIcon class="size-6 text-white" aria-hidden="true" />
          </div>

          <div>
            <p class="text-sm font-black leading-4 tracking-tight text-white">
              SisBrasFute
            </p>
            <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
              Gestão de Clubes
            </p>
          </div>
        </div>

        <nav class="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <div class="space-y-7">
            <div>
              <p class="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">
                Navegação
              </p>

              <ul role="list" class="space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a
                    v-if="!item.children"
                    @click.prevent="$router.push(item.href)"
                    :href="item.href"
                    :class="[
                      isCurrentRoute(item.href)
                        ? 'bg-orange-500 text-white shadow-[0_0_26px_rgba(249,115,22,0.28)]'
                        : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white',
                      'group flex items-center gap-x-3 px-3 py-3 text-sm font-black transition-all cursor-pointer'
                    ]"
                  >
                    <component
                      :is="item.icon"
                      :class="[
                        isCurrentRoute(item.href)
                          ? 'text-white'
                          : 'text-zinc-500 group-hover:text-orange-400',
                        'size-5 shrink-0 transition-colors'
                      ]"
                      aria-hidden="true"
                    />

                    {{ item.name }}
                  </a>

                  <Disclosure v-else as="div" v-slot="{ open }">
                    <DisclosureButton
                      :class="[
                        item.children.some((child) => isCurrentRoute(child.href))
                          ? 'bg-orange-500 text-white shadow-[0_0_26px_rgba(249,115,22,0.28)]'
                          : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white',
                        'group flex w-full items-center gap-x-3 px-3 py-3 text-left text-sm font-black transition-all'
                      ]"
                    >
                      <component
                        :is="item.icon"
                        :class="[
                          item.children.some((child) => isCurrentRoute(child.href))
                            ? 'text-white'
                            : 'text-zinc-500 group-hover:text-orange-400',
                          'size-5 shrink-0 transition-colors'
                        ]"
                        aria-hidden="true"
                      />

                      {{ item.name }}

                      <ChevronRightIcon
                        :class="[
                          open ? 'rotate-90 text-orange-400' : 'text-zinc-600',
                          'ml-auto size-4 shrink-0 transition-transform'
                        ]"
                        aria-hidden="true"
                      />
                    </DisclosureButton>

                    <DisclosurePanel as="ul" class="mt-1 space-y-1 border-l border-white/10 pl-4">
                      <li v-for="subItem in item.children" :key="subItem.name">
                        <DisclosureButton
                          as="a"
                          :href="subItem.href"
                          @click.prevent="$router.push(subItem.href)"
                          :class="[
                            isCurrentRoute(subItem.href)
                              ? 'bg-orange-500/15 text-orange-400'
                              : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200',
                            'block px-3 py-2 text-sm font-bold transition-colors cursor-pointer'
                          ]"
                        >
                          {{ subItem.name }}
                        </DisclosureButton>
                      </li>
                    </DisclosurePanel>
                  </Disclosure>
                </li>
              </ul>
            </div>
          </div>

          <!-- Admin Section -->
          <div v-if="user.is_admin" class="mt-6">
            <p class="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-500">
              Administração
            </p>

            <Disclosure as="div" v-slot="{ open }">
              <DisclosureButton
                :class="[
                  adminChildren.some((child) => isCurrentRoute(child.href))
                    ? 'bg-red-600 text-white shadow-[0_0_26px_rgba(220,38,38,0.28)]'
                    : 'text-red-400 hover:bg-red-500/10 hover:text-red-300',
                  'group flex w-full items-center gap-x-3 px-3 py-3 text-left text-sm font-black transition-all'
                ]"
              >
                <Cog6ToothIcon
                  :class="[
                    adminChildren.some((child) => isCurrentRoute(child.href))
                      ? 'text-white'
                      : 'text-red-500 group-hover:text-red-400',
                    'size-5 shrink-0 transition-colors'
                  ]"
                  aria-hidden="true"
                />

                Painel Admin

                <ChevronRightIcon
                  :class="[
                    open ? 'rotate-90 text-red-400' : 'text-red-600',
                    'ml-auto size-4 shrink-0 transition-transform'
                  ]"
                  aria-hidden="true"
                />
              </DisclosureButton>

              <DisclosurePanel as="ul" class="mt-1 space-y-1 border-l border-red-500/30 pl-4">
                <li v-for="subItem in adminChildren" :key="subItem.name">
                  <DisclosureButton
                    as="a"
                    :href="subItem.href"
                    @click.prevent="$router.push(subItem.href)"
                    :class="[
                      isCurrentRoute(subItem.href)
                        ? 'bg-red-500/15 text-red-400'
                        : 'text-zinc-500 hover:bg-red-500/5 hover:text-red-300',
                      'block px-3 py-2 text-sm font-bold transition-colors cursor-pointer'
                    ]"
                  >
                    {{ subItem.name }}
                  </DisclosureButton>
                </li>
              </DisclosurePanel>
            </Disclosure>
          </div>

          <div class="mt-auto border-t border-white/10 pt-4">
            <Menu as="div" class="relative">
              <MenuButton class="flex w-full items-center gap-3 bg-white/[0.04] p-3 text-left hover:bg-white/[0.07]">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white">
                  {{ userInitials }}
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-black text-white">
                    {{ user.name || 'Usuário' }}
                  </p>
                </div>

                <ChevronDownIcon class="size-4 text-zinc-500" aria-hidden="true" />
              </MenuButton>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute bottom-full left-0 z-10 mb-2 w-full origin-bottom-left border border-white/10 bg-[#111111] py-2 shadow-2xl">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                    <a
                      :href="item.href"
                      @click.prevent="$router.push(item.href)"
                      :class="[
                        active ? 'bg-orange-500 text-white' : 'text-zinc-300',
                        'block px-4 py-2 text-sm font-bold cursor-pointer'
                      ]"
                    >
                      {{ item.name }}
                    </a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </nav>
      </div>
    </aside>

    <div class="lg:pl-72">
      <header class="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-white/10 bg-black/90 px-4 backdrop-blur sm:px-6 lg:px-8">
        <button
          type="button"
          class="-m-2.5 rounded-xl p-2.5 text-zinc-300 hover:bg-white/10 hover:text-white lg:hidden"
          @click="isSidebarOpen = true"
        >
          <span class="sr-only">Abrir menu</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>

        <div class="ml-4 hidden items-center gap-2 text-sm font-bold text-zinc-600 lg:flex">
          <span>SisBrasFute</span>
          <span>/</span>
          <span class="text-white">{{ currentPageName }}</span>
        </div>

        <div class="ml-auto flex items-center gap-3">
          <Menu as="div" class="relative">
            <MenuButton
              type="button"
              class="relative rounded-xl p-2 text-zinc-500 hover:bg-white/10 hover:text-orange-400"
              @click="onBellClick"
            >
              <span class="sr-only">Notificações</span>
              <BellIcon class="size-5" aria-hidden="true" />
              <span
                v-if="notificationsStore.unreadCount > 0"
                class="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black leading-none text-white"
              >
                {{ notificationsStore.unreadCount > 9 ? '9+' : notificationsStore.unreadCount }}
              </span>
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl focus:outline-none">
                <div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <p class="text-sm font-black text-white">Notificações</p>
                  <button
                    v-if="notificationsStore.unreadCount > 0"
                    type="button"
                    class="text-xs font-bold text-orange-400 hover:text-orange-300"
                    @click.stop="markAllRead"
                  >
                    Marcar todas
                  </button>
                </div>

                <div class="max-h-96 overflow-y-auto">
                  <div v-if="notificationsStore.latest.length === 0" class="px-4 py-8 text-center text-sm text-zinc-500">
                    Nenhuma notificação.
                  </div>

                  <MenuItem
                    v-for="item in notificationsStore.latest"
                    :key="item.id"
                    v-slot="{ active }"
                  >
                    <button
                      type="button"
                      @click="openNotification(item)"
                      :class="[
                        active ? 'bg-white/[0.06]' : '',
                        'flex w-full items-start gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors'
                      ]"
                    >
                      <span
                        :class="[
                          item.read_at ? 'bg-transparent' : 'bg-orange-500',
                          'mt-1.5 size-2 shrink-0 rounded-full'
                        ]"
                      ></span>
                      <span class="min-w-0 flex-1">
                        <span class="block truncate text-sm font-bold text-white">
                          {{ item.notification_info?.title || item.notificationInfo?.title }}
                        </span>
                        <span class="mt-0.5 block line-clamp-2 text-xs text-zinc-400">
                          {{ item.notification_info?.description || item.notificationInfo?.description }}
                        </span>
                      </span>
                    </button>
                  </MenuItem>
                </div>

                <button
                  type="button"
                  class="block w-full border-t border-white/10 px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-orange-400 hover:bg-white/[0.05]"
                  @click="$router.push('/notifications')"
                >
                  Ver todas
                </button>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </header>

      <main class="min-h-[calc(100vh-4rem)]">
        <div class="px-4 py-8 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-[1920px]">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.js";
import { useNotificationsStore } from "@/stores/notifications.js";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  GlobeAmericasIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BoltIcon,
} from "@heroicons/vue/20/solid";

export default {
  components: {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    Bars3Icon,
    BellIcon,
    BoltIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    GlobeAmericasIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  },
  setup() {
    const notificationsStore = useNotificationsStore();
    return { notificationsStore };
  },
  data() {
    return {
      user: {},
      isSidebarOpen: false,
      userInitials: 'A',
      navigation: [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
        {
          name: "Times",
          icon: UsersIcon,
          current: false,
          children: [
            { name: "Listar Times", href: "/team/list" },
            { name: "Meus Times", href: "/team/my-teams" },
            { name: "Criar Times", href: "/team/form" },
          ],
        },
        {
          name: "Partidas",
          icon: GlobeAmericasIcon,
          current: false,
          children: [
            { name: "Listar Partidas", href: "/matches/list" },
            { name: "Minhas Partidas", href: "/matches/my-matches" },
            { name: "Criar Partida", href: "/matches/form" },
          ],
        },
        {
          name: "Amistosos",
          icon: CalendarIcon,
          current: false,
          children: [
            { name: "Partidas Abertas", href: "/friendly/open" },
            { name: "Meus Desafios", href: "/friendly/my-challenges" },
          ],
        },
        {
          name: "Jogadores",
          icon: UsersIcon,
          current: false,
          children: [
            { name: "Listar Jogadores", href: "/player-profile/list" },
          ],
        },
        {
          name: "Financeiro",
          icon: ChartPieIcon,
          current: false,
          href: "/financeiro",
        },
      ],
      teams: [
        { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
        { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
        { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
      ],
      userNavigation: [
        { name: "Meus Times", href: "/team/my-teams" },
        { name: "Meu Perfil", href: "/player-profile/form" },
        { name: "Sair", href: "/logout" },
      ],
      adminChildren: [
        { name: "Dashboard", href: "/admin" },
        { name: "Usuários", href: "/admin/users" },
        { name: "Times", href: "/admin/teams" },
        { name: "Partidas", href: "/admin/matches" },
        { name: "Notificações", href: "/admin/notifications" },
        { name: "Posições de Jogo", href: "/admin/game-positions" },
        { name: "Config. Taxas", href: "/admin/fee-config" },
        { name: "Receita", href: "/admin/revenue" },
      ],
      currentPageName: false,
    };
  },
  mounted() {
    const auth = useAuthStore();
    this.user = auth.user;
    if (this.user?.name) {
      this.userInitials = this.user.name.trim().charAt(0).toUpperCase() || 'A';
    }
    this.notificationsStore.fetchLatest();
  },
  methods: {
    go(route) {
      this.fabOpen = false;
      this.$router.push(route);
    },
    isCurrentRoute(href) {
      if (!href || href === "#") {
        return false;
      }

      return this.$route.path === href || this.$route.path.startsWith(`${href}/`);
    },
    onBellClick() {
      this.notificationsStore.fetchLatest();
    },
    async markAllRead() {
      try {
        await this.notificationsStore.markAllAsRead();
      } catch {
        // ignore
      }
    },
    async openNotification(item) {
      if (!item.read_at) {
        try {
          await this.notificationsStore.markAsRead(item.id);
        } catch {
          // ignore
        }
      }
      this.$router.push('/notifications');
    },
  },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
