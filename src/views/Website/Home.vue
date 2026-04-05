<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Recursos', href: '#recursos' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Comunidade', href: '#comunidade' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <header class="sticky top-0 z-50 border-b border-slate-200/10 bg-slate-950/85 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <router-link to="/" class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-400 ring-1 ring-sky-400/30 shadow-lg shadow-sky-500/10">
            <span class="text-2xl">⚽</span>
          </div>
          <div>
            <p class="text-sm font-semibold tracking-wide text-sky-300">SisBrasFute</p>
            <p class="text-xs text-slate-400">Organize seu futebol</p>
          </div>
        </router-link>

        <nav class="hidden items-center gap-8 md:flex">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            {{ link.label }}
          </a>
        </nav>

        <div class="hidden items-center gap-3 md:flex">
          <router-link
            to="/login"
            class="rounded-xl border border-slate-200/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-sky-400/30 hover:bg-sky-500/10"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:from-sky-400 hover:to-blue-500"
          >
            Criar Login
          </router-link>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl border border-slate-200/10 bg-white/5 p-2 md:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Abrir menu"
        >
          <span class="text-xl">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>

      <div v-if="mobileMenuOpen" class="border-t border-slate-200/10 px-6 py-4 md:hidden">
        <div class="flex flex-col gap-3">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
          >
            {{ link.label }}
          </a>

          <div class="mt-2 flex flex-col gap-3">
            <router-link
              to="/login"
              class="rounded-xl border border-slate-200/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Criar Login
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(148,163,184,0.20),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.03),_transparent)]"></div>

        <div class="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div class="relative">
            <div class="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              <span class="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.9)]"></span>
              Plataforma premium para futebol amador e competitivo
            </div>

            <h1 class="mt-6 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Organize times, partidas e campeonatos com visual metálico e potência digital
            </h1>

            <p class="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Conecte jogadores, encontre jogos, monte equipes, gerencie convocações e crie campeonatos em um sistema elegante, moderno e feito para quem vive o futebol.
            </p>

            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <router-link
                to="/login"
                class="inline-flex items-center justify-center rounded-2xl border border-slate-200/10 bg-slate-100 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/10 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="inline-flex items-center justify-center rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-500/20 to-blue-600/20 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-sky-500/25"
              >
                Criar Login
              </router-link>
            </div>

            <div class="mt-10 grid gap-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-slate-200/10 bg-white/5 p-4 shadow-lg shadow-black/20">
                <p class="text-2xl font-black text-sky-300">+ Time</p>
                <p class="mt-1 text-sm text-slate-300">Crie e administre equipes</p>
              </div>
              <div class="rounded-2xl border border-slate-200/10 bg-white/5 p-4 shadow-lg shadow-black/20">
                <p class="text-2xl font-black text-sky-300">+ Jogo</p>
                <p class="mt-1 text-sm text-slate-300">Encontre e organize partidas</p>
              </div>
              <div class="rounded-2xl border border-slate-200/10 bg-white/5 p-4 shadow-lg shadow-black/20">
                <p class="text-2xl font-black text-sky-300">+ Players</p>
                <p class="mt-1 text-sm text-slate-300">Descubra atletas para completar o elenco</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -inset-6 rounded-full bg-sky-500/25 blur-3xl"></div>

            <div class="relative overflow-hidden rounded-[2rem] border border-slate-200/10 bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur">
              <div class="grid gap-4 p-6 sm:grid-cols-2">
                <div class="rounded-3xl bg-gradient-to-br from-slate-200 via-slate-400 to-sky-500 p-6 text-slate-950 shadow-lg shadow-sky-500/20">
                  <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-950/70">Matchday</p>
                  <h2 class="mt-3 text-2xl font-black">Painel rápido</h2>
                  <p class="mt-2 text-sm font-medium text-slate-950/85">
                    Tudo o que seu grupo precisa para se organizar.
                  </p>
                </div>

                <div class="rounded-3xl border border-slate-200/10 bg-white/5 p-6">
                  <div class="flex items-center justify-between">
                    <p class="text-sm text-slate-400">Jogadores online</p>
                    <span class="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300">Ao vivo</span>
                  </div>
                  <div class="mt-6 space-y-3">
                    <div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                      <span class="text-sm font-medium">Times prontos</span>
                      <span class="text-sky-300">24</span>
                    </div>
                    <div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                      <span class="text-sm font-medium">Partidas hoje</span>
                      <span class="text-sky-300">08</span>
                    </div>
                    <div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                      <span class="text-sm font-medium">Novos jogadores</span>
                      <span class="text-sky-300">16</span>
                    </div>
                  </div>
                </div>

                <div class="rounded-3xl border border-slate-200/10 bg-white/5 p-6">
                  <p class="text-sm text-slate-400">Recursos</p>
                  <h3 class="mt-2 text-xl font-bold">Organização completa</h3>
                  <ul class="mt-4 space-y-3 text-sm text-slate-300">
                    <li>• Criar e administrar times</li>
                    <li>• Encontrar partidas abertas</li>
                    <li>• Buscar jogadores por posição</li>
                    <li>• Organizar campeonatos e torneios</li>
                  </ul>
                </div>

                <div class="overflow-hidden rounded-3xl border border-slate-200/10">
                  <img
                    src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg"
                    alt="Campo de futebol"
                    class="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" class="border-t border-slate-200/10 bg-slate-950">
        <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-3xl border border-slate-200/10 bg-white/5 p-6">
              <h3 class="text-lg font-bold">Organize equipes</h3>
              <p class="mt-2 text-sm text-slate-300">Monte elencos, defina funções e acompanhe seus grupos.</p>
            </div>
            <div class="rounded-3xl border border-slate-200/10 bg-white/5 p-6">
              <h3 class="text-lg font-bold">Encontre partidas</h3>
              <p class="mt-2 text-sm text-slate-300">Localize jogos disponíveis e participe com facilidade.</p>
            </div>
            <div class="rounded-3xl border border-slate-200/10 bg-white/5 p-6">
              <h3 class="text-lg font-bold">Busque jogadores</h3>
              <p class="mt-2 text-sm text-slate-300">Encontre atletas por perfil, posição e disponibilidade.</p>
            </div>
            <div class="rounded-3xl border border-slate-200/10 bg-white/5 p-6">
              <h3 class="text-lg font-bold">Crie campeonatos</h3>
              <p class="mt-2 text-sm text-slate-300">Organize torneios com estrutura simples e prática.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" class="bg-slate-900/60">
        <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div class="max-w-2xl">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Como funciona</p>
            <h2 class="mt-3 text-3xl font-black">Da inscrição ao campeonato, tudo em um só sistema</h2>
            <p class="mt-4 text-slate-300">
              Entre, crie seu perfil, participe de times e comece a organizar suas partidas com uma experiência mais profissional.
            </p>
          </div>
        </div>
      </section>
    </main>

    <footer id="comunidade" class="border-t border-slate-200/10 bg-slate-950">
      <div class="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p class="text-base font-semibold">SisBrasFute</p>
          <p class="mt-1 text-sm text-slate-400">Organize futebol, conecte jogadores e fortaleça sua comunidade.</p>
        </div>

        <div class="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <a href="#recursos" class="transition hover:text-white">Recursos</a>
          <a href="#como-funciona" class="transition hover:text-white">Como funciona</a>
          <router-link to="/login" class="transition hover:text-white">Login</router-link>
          <router-link to="/register" class="transition hover:text-white">Criar Login</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>
