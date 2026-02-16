export default [
  {
    path: '/matches/list',
    name: 'matches-list',
    component: () => import('../views/System/Matches/MatchesList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/matches/show/:id',
    name: 'matches-show',
    component: () => import('../views/System/Matches/MatchesShow.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/matches/form',
    name: 'matches-form',
    component: () => import('../views/System/Matches/MatchesForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/matches/edit/:id',
    name: 'matches-edit',
    component: () => import('../views/System/Matches/MatchesForm.vue'),
    meta: { requiresAuth: true }
  },
]
