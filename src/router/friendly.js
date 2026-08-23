export default [
  {
    path: '/friendly/open',
    name: 'friendly-open',
    component: () => import('../views/System/Friendly/FriendlyOpenList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/friendly/my-challenges',
    name: 'friendly-my-challenges',
    component: () => import('../views/System/Friendly/FriendlyMyChallenges.vue'),
    meta: { requiresAuth: true }
  },
]
