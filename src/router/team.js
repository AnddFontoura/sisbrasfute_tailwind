export default [
  {
    path: '/team/list',
    name: 'team-list',
    component: () => import('../views/System/Team/TeamList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/form',
    name: 'team-form',
    component: () => import('../views/System/Team/TeamForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/edit',
    name: 'team-edit',
    component: () => import('../views/System/Team/TeamForm.vue'),
    meta: { requiresAuth: true }
  },
]
