<template>
  <div class="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white text-black">
    <TransitionRoot as="template" :show="this.isSidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="this.isSidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="" leave="transition-opacity ease-linear duration-300" leave-from="" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/80"></div>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="" leave="ease-in-out duration-300" leave-from="" leave-to="opacity-0">
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 rounded-md p-2.5 text-white hover:bg-white/10" @click="this.isSidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <div class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4">
                <div class="relative flex h-16 shrink-0 items-center border-b border-orange-500/40">
                  <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=orange&shade=500" alt="Your Company" />
                </div>
                <nav class="relative flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a :href="item.href" :class="[item.current ? 'bg-orange-500 text-black' : 'text-white hover:bg-orange-500/20 hover:text-orange-300', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-colors']">
                            <component :is="item.icon" :class="[item.current ? 'text-black' : 'text-orange-300 group-hover:text-orange-200', 'size-6 shrink-0']" aria-hidden="true" />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div class="text-xs/6 font-semibold uppercase tracking-wide text-orange-300">Seus times</div>
                      <ul role="list" class="-mx-2 mt-2 space-y-1">
                        <li v-for="team in teams" :key="team.name">
                          <a :href="team.href" :class="[team.current ? 'bg-orange-500 text-black' : 'text-white hover:bg-orange-500/20 hover:text-orange-300', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-colors']">
                            <span :class="[team.current ? 'border-black/20 bg-white text-black' : 'border-orange-300/40 bg-black text-orange-200 group-hover:border-orange-300 group-hover:text-orange-100', 'flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium']">{{ team.initial }}</span>
                            <span class="truncate">{{ team.name }}</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-auto">
                      <a href="#" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-white hover:bg-orange-500/20 hover:text-orange-300 transition-colors">
                        <Cog6ToothIcon class="size-6 shrink-0 text-orange-300 group-hover:text-orange-200" aria-hidden="true" />
                        Configurações
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-black">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-orange-500/30 bg-black px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center border-b border-orange-500/40">
          <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=orange&shade=500" alt="Your Company" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li v-for="item in navigation" :key="item.name">
              <a v-if="!item.children" :href="item.href" :class="[item.current ? 'bg-orange-500 text-black' : 'text-white hover:bg-orange-500/20 hover:text-orange-300', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-colors']">
                <component :is="item.icon" :class="[item.current ? 'text-black' : 'text-orange-300 group-hover:text-orange-200', 'size-6 shrink-0']" aria-hidden="true" />
                {{ item.name }}
              </a>
              <Disclosure as="div" v-else v-slot="{ open }">
                <DisclosureButton :class="[item.current ? 'bg-orange-500 text-black' : 'text-white hover:bg-orange-500/20 hover:text-orange-300', 'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold transition-colors']">
                  <component :is="item.icon" :class="[item.current ? 'text-black' : 'text-orange-300', 'size-6 shrink-0']" aria-hidden="true" />
                  {{ item.name }}
                  <ChevronRightIcon :class="[open ? 'rotate-90 text-orange-200' : 'text-orange-300', 'ml-auto size-5 shrink-0 transition-transform']" aria-hidden="true" />
                </DisclosureButton>
                <DisclosurePanel as="ul" class="mt-1 px-2">
                  <li v-for="subItem in item.children" :key="subItem.name">
                    <DisclosureButton as="a" :href="subItem.href" :class="[subItem.current ? 'bg-orange-500 text-black' : 'text-white/90 hover:bg-orange-500/20 hover:text-orange-200', 'block rounded-md py-2 pr-2 pl-9 text-sm/6 transition-colors']">{{ subItem.name }}</DisclosureButton>
                  </li>
                </DisclosurePanel>
              </Disclosure>
            </li>
            <li>
              <div class="text-xs/6 font-semibold uppercase tracking-wide text-orange-300">Seus times</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="team in teams" :key="team.name">
                  <a :href="team.href" :class="[team.current ? 'bg-orange-500 text-black' : 'text-white hover:bg-orange-500/20 hover:text-orange-300', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-colors']">
                    <span :class="[team.current ? 'border-black/20 bg-white text-black' : 'border-orange-300/40 bg-black text-orange-200 group-hover:border-orange-300 group-hover:text-orange-100', 'flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium']">{{ team.initial }}</span>
                    <span class="truncate">{{ team.name }}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="mt-auto">
              <a href="#" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-white hover:bg-orange-500/20 hover:text-orange-300 transition-colors">
                <Cog6ToothIcon class="size-6 shrink-0 text-orange-300 group-hover:text-orange-200" aria-hidden="true" />
                Configurações
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-orange-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 rounded-md p-2.5 text-black hover:bg-orange-100 lg:hidden" @click="this.isSidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>

        <div class="h-6 w-px bg-orange-200 lg:hidden" aria-hidden="true"></div>

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-black hover:bg-orange-100 hover:text-orange-600 transition-colors">
              <span class="sr-only">View notifications</span>
              <BellIcon class="size-6" aria-hidden="true" />
            </button>

            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-orange-200" aria-hidden="true"></div>

            <Menu as="div" class="relative">
              <MenuButton class="relative flex items-center rounded-md p-1 hover:bg-orange-100 transition-colors">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">Open user menu</span>
                <img class="size-8 rounded-full bg-orange-100 outline -outline-offset-1 outline-orange-300" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm/6 font-semibold text-black" aria-hidden="true">{{ user.name }}</span>
                  <ChevronDownIcon class="ml-2 size-5 text-orange-500" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md border border-orange-200 bg-white py-2 shadow-lg">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                    <a :href="item.href" :class="[active ? 'bg-orange-50 text-orange-700' : 'text-black', 'block px-3 py-1 text-sm/6']">{{ item.name }}</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.js";
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
  ChevronRightIcon
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
  data() {
    return {
      user: {},
      isSidebarOpen: true,
      navigation: [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
        {
          name: "Times",
          icon: UsersIcon,
          current: false,
          children: [
            { name: "Listar Times", href: "/team/list" },
            { name: "Criar Times", href: "/team/form" },
          ],
        },
        {
          name: "Partidas",
          icon: GlobeAmericasIcon,
          current: false,
          children: [
            { name: "Listar Partidas", href: "/matches/list" },
            { name: "Criar Partida", href: "/matches/form" },
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
      ],
      teams: [
        { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
        { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
        { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
      ],
      userNavigation: [
        { name: "Meus Times", href: "#" },
        { name: "Meu Perfil", href: "/player-profile/form" },
        { name: "Sair", href: "/logout" },
      ]
    };
  },
  mounted() {
    const auth = useAuthStore();
    this.user = auth.user;
  },
  methods: {
    go(route) {
      this.fabOpen = false;
      this.$router.push(route);
    },
  },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
