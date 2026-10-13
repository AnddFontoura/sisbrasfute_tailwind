export default [
  {
    path: '/courts/my-courts',
    name: 'my-courts',
    component: () => import('../views/System/Court/MyCourts.vue'),
    meta: { requiresAuth: true, requiresCourtAllowed: true }
  },
  {
    path: '/courts/form',
    name: 'court-form',
    component: () => import('../views/System/Court/CourtForm.vue'),
    meta: { requiresAuth: true, requiresCourtAllowed: true }
  },
  {
    path: '/courts/edit/:id',
    name: 'court-edit',
    component: () => import('../views/System/Court/CourtForm.vue'),
    meta: { requiresAuth: true, requiresCourtAllowed: true }
  },
  {
    path: '/courts/show/:id',
    name: 'court-show',
    component: () => import('../views/System/Court/CourtShow.vue'),
    meta: { requiresAuth: true, requiresCourtAllowed: true }
  },
  {
    path: '/courts/:courtId/admin',
    name: 'court-admin',
    component: () => import('../views/System/Court/CourtAdmin.vue'),
    meta: { requiresAuth: true, requiresCourtAllowed: true }
  },
  {
    path: '/court-invitation/accept',
    name: 'court-invitation-accept',
    component: () => import('../views/System/Court/CourtInvitationAccept.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/court-invitation/received',
    name: 'court-invitation-received',
    component: () => import('../views/System/Court/CourtReceivedInvitations.vue'),
    meta: { requiresAuth: true }
  },
]
