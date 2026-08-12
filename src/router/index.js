import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth"
import auth from './auth.js'
import team from './team.js'
import teamFinance from "@/router/team-finance.js";
import matches from './matches.js'
import playerProfile from './player-profile.js'
import teamApplication from './team-application.js'
import playerInvitation from './player-invitation.js'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Website/Home.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/System/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/configuration',
      name: 'configuration',
      component: () => import('../views/System/Configuration.vue'),
      meta: { requiresAuth: true }
    },
    ...auth,
    ...team,
    ...teamFinance,
    ...playerProfile,
    ...matches,
    ...teamApplication,
    ...playerInvitation,
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isLoggedIn = !!auth.token || !!localStorage.getItem("access_token")
  const userRole = auth.user?.role || null // depende de como vem do backend

  // Bloqueia rota que precisa de login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: "login" })
  }

  // Impede usuário logado de acessar login
  if (to.name === "login" && isLoggedIn) {
    return next({ name: "dashboard" })
  }

  // Se rota exige role específica
  //if (to.meta.requiresRole && userRole !== to.meta.requiresRole) {
  //  return next({ name: "Dashboard" }) // ou uma página de "Acesso Negado"
  //}

  next()
})

export default router
