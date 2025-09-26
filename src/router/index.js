import { createRouter, createWebHistory } from 'vue-router'
import auth from './auth.js'

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
      component: () => import('../views/System/Dashboard.vue')
    },
    ...auth
  ],
})

export default router
