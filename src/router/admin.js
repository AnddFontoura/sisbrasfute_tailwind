export default [
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('../views/System/Admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/System/Admin/AdminUserList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/teams',
    name: 'admin-teams',
    component: () => import('../views/System/Admin/AdminTeamList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/matches',
    name: 'admin-matches',
    component: () => import('../views/System/Admin/AdminMatchList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/game-positions',
    name: 'admin-game-positions',
    component: () => import('../views/System/Admin/AdminGamePositionList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
]
