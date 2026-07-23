<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Recursos', href: '#recursos' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Comunidade', href: '#comunidade' },
]

const features = [
  {
    icon: '⚽',
    title: 'Organize equipes',
    description: 'Monte elencos, defina posições e gerencie convocações do seu time.',
  },
  {
    icon: '📅',
    title: 'Encontre partidas',
    description: 'Localize jogos disponíveis na sua região e participe com facilidade.',
  },
  {
    icon: '👤',
    title: 'Busque jogadores',
    description: 'Encontre atletas por posição, cidade e disponibilidade.',
  },
  {
    icon: '🏆',
    title: 'Crie campeonatos',
    description: 'Organize torneios completos com tabelas, resultados e classificação.',
  },
]

const steps = [
  { number: '01', title: 'Crie sua conta', description: 'Cadastre-se gratuitamente em menos de 1 minuto.' },
  { number: '02', title: 'Monte seu perfil', description: 'Defina suas posições, dados físicos e disponibilidade.' },
  { number: '03', title: 'Entre em um time', description: 'Encontre times recrutando ou crie o seu próprio.' },
  { number: '04', title: 'Jogue', description: 'Participe de partidas, acompanhe estatísticas e evolua.' },
]
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <!-- HEADER -->
    <header class="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <router-link to="/" class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            <span class="text-2xl">⚽</span>
          </div>
          <div>
            <p class="text-sm font-black tracking-wide text-white">SisBrasFute</p>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Gestão de Clubes</p>
          </div>
        </router-link>

        <nav class="hidden items-center gap-8 md:flex">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="text-sm font-medium text-zinc-400 transition hover:text-orange-400"
          >
            {{ link.label }}
          </a>
        </nav>

        <div class="hidden items-center gap-3 md:flex">
          <router-link
            to="/login"
            class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-orange-500/40 hover:bg-orange-500/10"
          >
            Entrar
          </router-link>
          <router-link
            to="/register"
            class="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40"
          >
            Criar Conta
          </router-link>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 md:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Abrir menu"
        >
          <span class="text-xl">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="border-t border-white/10 px-6 py-4 md:hidden">
        <div class="flex flex-col gap-3">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-orange-400"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </a>
          <div class="mt-2 flex flex-col gap-3">
            <router-link to="/login" class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white">
              Entrar
            </router-link>
            <router-link to="/register" class="rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white">
              Criar Conta
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main>
      <!-- HERO -->
      <section class="relative overflow-hidden">
        <!-- Background effects -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.15),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.08),_transparent_35%)]"></div>
        <div class="absolute top-20 right-20 h-72 w-72 rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div class="absolute bottom-20 left-10 h-56 w-56 rounded-full bg-orange-600/8 blur-[80px]"></div>

        <div class="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-32">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-300 backdrop-blur">
              <span class="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.9)]"></span>
              Plataforma para futebol amador e competitivo
            </div>

            <h1 class="mt-8 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Gerencie seu
              <span class="text-orange-500">futebol</span>
              com potência e estilo
            </h1>

            <p class="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              Conecte jogadores, monte equipes, organize partidas e crie campeonatos. Tudo em um sistema moderno feito para quem vive o esporte.
            </p>

            <div class="mt-10 flex flex-col gap-4 sm:flex-row">
              <router-link
                to="/register"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40"
              >
                Começar agora
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </router-link>
              <router-link
                to="/login"
                class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-orange-500/30 hover:bg-orange-500/10"
              >
                Já tenho conta
              </router-link>
            </div>

            <!-- Stats -->
            <div class="mt-14 grid gap-4 sm:grid-cols-3">
              <div class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p class="text-2xl font-black text-orange-400">+ Times</p>
                <p class="mt-1 text-sm text-zinc-400">Crie e administre equipes</p>
              </div>
              <div class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p class="text-2xl font-black text-orange-400">+ Jogos</p>
                <p class="mt-1 text-sm text-zinc-400">Encontre e organize partidas</p>
              </div>
              <div class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p class="text-2xl font-black text-orange-400">+ Players</p>
                <p class="mt-1 text-sm text-zinc-400">Descubra atletas para o elenco</p>
              </div>
            </div>
          </div>

          <!-- Hero visual panel -->
          <div class="relative hidden lg:block">
            <div class="absolute -inset-8 rounded-full bg-orange-500/15 blur-3xl"></div>

            <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/40 backdrop-blur">
              <div class="border-b border-white/10 bg-black/40 px-6 py-3">
                <div class="flex items-center gap-2">
                  <div class="h-3 w-3 rounded-full bg-orange-500"></div>
                  <div class="h-3 w-3 rounded-full bg-zinc-600"></div>
                  <div class="h-3 w-3 rounded-full bg-zinc-600"></div>
                  <span class="ml-3 text-xs text-zinc-500">SisBrasFute — Dashboard</span>
                </div>
              </div>

              <div class="grid gap-4 p-6 sm:grid-cols-2">
                <div class="rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 p-5 shadow-lg shadow-orange-500/20">
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-orange-100/70">Painel Rápido</p>
                  <h2 class="mt-3 text-xl font-black text-white">Seu time</h2>
                  <p class="mt-2 text-sm text-orange-100/80">Tudo que você precisa para organizar o jogo.</p>
                </div>

                <div class="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div class="flex items-center justify-between">
                    <p class="text-xs text-zinc-400">Atividade</p>
                    <span class="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-semibold text-orange-400">Live</span>
                  </div>
                  <div class="mt-4 space-y-2.5">
                    <div class="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                      <span class="text-sm">Times prontos</span>
                      <span class="font-bold text-orange-400">24</span>
                    </div>
                    <div class="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                      <span class="text-sm">Partidas hoje</span>
                      <span class="font-bold text-orange-400">08</span>
                    </div>
                    <div class="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                      <span class="text-sm">Novos jogadores</span>
                      <span class="font-bold text-orange-400">16</span>
                    </div>
                  </div>
                </div>

                <div class="col-span-2 rounded-xl border border-white/10 bg-white/5 p-5">
                  <p class="text-xs text-zinc-400">Próxima partida</p>
                  <div class="mt-3 flex items-center justify-between">
                    <div class="text-center">
                      <p class="text-lg font-black">Quinta FC</p>
                      <p class="text-xs text-zinc-500">Mandante</p>
                    </div>
                    <div class="rounded-lg bg-orange-500/15 px-4 py-2">
                      <p class="text-lg font-black text-orange-400">VS</p>
                    </div>
                    <div class="text-center">
                      <p class="text-lg font-black">Pelada FC</p>
                      <p class="text-xs text-zinc-500">Visitante</p>
                    </div>
                  </div>
                  <p class="mt-3 text-center text-sm text-zinc-400">Sábado, 19h — Campo do Bairro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section id="recursos" class="border-t border-white/10">
        <div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div class="text-center">
            <p class="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Recursos</p>
            <h2 class="mt-3 text-3xl font-black sm:text-4xl">Tudo para o seu futebol em um só lugar</h2>
            <p class="mx-auto mt-4 max-w-2xl text-zinc-400">Do recrutamento de jogadores à gestão financeira do time, cada detalhe foi pensado para quem organiza futebol de verdade.</p>
          </div>

          <div class="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-orange-500/30 hover:bg-orange-500/5"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-2xl transition group-hover:bg-orange-500/20">
                {{ feature.icon }}
              </div>
              <h3 class="mt-4 text-lg font-bold">{{ feature.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-zinc-400">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section id="como-funciona" class="border-t border-white/10 bg-zinc-950">
        <div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div class="max-w-2xl">
            <p class="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Como funciona</p>
            <h2 class="mt-3 text-3xl font-black sm:text-4xl">Da inscrição ao jogo, em 4 passos</h2>
            <p class="mt-4 text-zinc-400">Entre, crie seu perfil, participe de times e comece a jogar com organização profissional.</p>
          </div>

          <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="step in steps"
              :key="step.number"
              class="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <span class="text-4xl font-black text-orange-500/20">{{ step.number }}</span>
              <h3 class="mt-2 text-lg font-bold">{{ step.title }}</h3>
              <p class="mt-2 text-sm text-zinc-400">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="border-t border-white/10">
        <div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div class="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-black p-10 text-center sm:p-16">
            <div class="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-orange-500/20 blur-[80px]"></div>
            <div class="relative">
              <h2 class="text-3xl font-black sm:text-4xl">Pronto para organizar seu futebol?</h2>
              <p class="mx-auto mt-4 max-w-xl text-zinc-400">Cadastre-se gratuitamente e descubra como é fácil gerenciar times, partidas e jogadores com o SisBrasFute.</p>
              <div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <router-link
                  to="/register"
                  class="inline-flex items-center justify-center rounded-xl bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-400"
                >
                  Criar minha conta grátis
                </router-link>
                <router-link
                  to="/login"
                  class="inline-flex items-center justify-center rounded-xl border border-white/10 px-8 py-3.5 text-base font-semibold text-white transition hover:border-orange-500/30 hover:bg-orange-500/10"
                >
                  Já tenho conta
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer id="comunidade" class="border-t border-white/10 bg-black">
      <div class="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.3)]">
              <span class="text-lg">⚽</span>
            </div>
            <div>
              <p class="text-sm font-black text-white">SisBrasFute</p>
              <p class="text-xs text-zinc-500">Organize futebol, conecte jogadores.</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
            <a href="#recursos" class="transition hover:text-orange-400">Recursos</a>
            <a href="#como-funciona" class="transition hover:text-orange-400">Como funciona</a>
            <router-link to="/login" class="transition hover:text-orange-400">Entrar</router-link>
            <router-link to="/register" class="transition hover:text-orange-400">Criar Conta</router-link>
          </div>
        </div>

        <div class="mt-8 border-t border-white/10 pt-6 text-center text-xs text-zinc-600">
          © {{ new Date().getFullYear() }} SisBrasFute. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>
