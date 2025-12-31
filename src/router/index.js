import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth"
import auth from './auth.js'
import team from './team.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: '',
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/System/Dashboard.vue'),
      meta: { requiresAuth: true/*, requiresRole: "admin"*/ }
    },
    ...auth,
    ...team,
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isLoggedIn = !!auth.token || !!localStorage.getItem("token")
  const userRole = auth.user?.role || null // depende de como vem do backend

  // Bloqueia rota que precisa de login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: "login" })
  }

  // Impede usuário logado de acessar login
  if (to.name === "Login" && isLoggedIn) {
    return next({ name: "dashboard" })
  }

  // Se rota exige role específica
  //if (to.meta.requiresRole && userRole !== to.meta.requiresRole) {
  //  return next({ name: "Dashboard" }) // ou uma página de "Acesso Negado"
  //}

  next()
})

export default router
