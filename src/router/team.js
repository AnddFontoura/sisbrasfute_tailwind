export default [
  {
    path: '/team/list',
    name: 'team-list',
    component: () => import('../views/System/Team/TeamList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/show/:id',
    name: 'team-show',
    component: () => import('../views/System/Team/TeamShow.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/form',
    name: 'team-form',
    component: () => import('../views/System/Team/TeamForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/edit/:id',
    name: 'team-edit',
    component: () => import('../views/System/Team/TeamForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/teams/:id/admin',
    name: 'team-admin',
    component: () => import('../views/System/Team/TeamAdmin.vue'),
    meta: { requiresAuth: true }
  }
]
