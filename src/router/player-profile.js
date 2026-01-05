export default [
  {
    path: '/player-profile/list',
    name: 'player-profile-list',
    component: () => import('../views/System/PlayerProfile/PlayerProfileList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/player-profile/show/:id',
    name: 'player-profile-show',
    component: () => import('../views/System/PlayerProfile/PlayerProfileShow.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/player-profile/form',
    name: 'player-profile-form',
    component: () => import('../views/System/PlayerProfile/PlayerProfileForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/player-profile/edit',
    name: 'player-profile-edit',
    component: () => import('../views/System/PlayerProfile/PlayerProfileForm.vue'),
    meta: { requiresAuth: true }
  },
]
