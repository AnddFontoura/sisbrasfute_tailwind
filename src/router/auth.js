import {useAuthStore} from "@/stores/auth.js";

export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Auth/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Auth/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/Auth/Login.vue')
  },
  {
    path: "/logout",
    name: "logout",
    beforeEnter: async (to, from, next) => {
      const auth = useAuthStore()

      /*
      try {
        // opcional — avisa o backend
        await axios.post("/logout")
      } catch (_) {}
      */
      auth.logout()

      next("/login")
    }
  }
]
