export default [
  {
    path: '/courts/my-courts',
    name: 'my-courts',
    component: () => import('../views/System/Court/MyCourts.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/courts/form',
    name: 'court-form',
    component: () => import('../views/System/Court/CourtForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/courts/edit/:id',
    name: 'court-edit',
    component: () => import('../views/System/Court/CourtForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/courts/show/:id',
    name: 'court-show',
    component: () => import('../views/System/Court/CourtShow.vue'),
    meta: { requiresAuth: true }
  },
]
