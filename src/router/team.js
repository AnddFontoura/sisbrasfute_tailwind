export default [
  {
    path: '/team/list',
    name: 'team-list',
    component: () => import('../views/System/Team/TeamList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/my-teams',
    name: 'my-teams',
    component: () => import('../views/System/Team/MyTeams.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/:teamId/players/list',
    name: 'team-players-list',
    component: () => import('../views/System/Team/TeamPlayerList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/:teamId/players/:playerId/edit',
    name: 'team-player-edit',
    component: () => import('../views/System/Team/TeamPlayerEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/:teamId/players/form',
    name: 'team-players-form',
    component: () => import('../views/System/Team/TeamPlayerRecruitamentForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/:teamId/matches/list',
    name: 'team-matches-list',
    component: () => import('../views/System/Matches/MatchesList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/:teamId/matches/:matchId/manage',
    name: 'team-matches-manage',
    component: () => import('../views/System/Matches/MatchPositions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/:teamId/matches/form',
    name: 'team-matches-form',
    component: () => import('../views/System/Matches/MatchesForm.vue'),
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
    path: '/team/:teamId/tags',
    name: 'team-tags',
    component: () => import('../views/System/Team/TeamTagManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/teams/:id/admin',
    name: 'team-admin',
    component: () => import('../views/System/Team/TeamAdmin.vue'),
    meta: { requiresAuth: true }
  }
]
