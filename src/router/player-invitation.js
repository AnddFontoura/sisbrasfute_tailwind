export default [
    {
      path: '/team/:teamId/invitations/list',
      name: 'player-invitation-list',
      component: () => import('../views/System/PlayerInvitation/PlayerInvitationList.vue'),
      meta: { requiresAuth: true }
  },
  {
      path: '/player-invitations/received',
      name: 'player-invitation-received',
      component: () => import('../views/System/PlayerInvitation/ReceivedInvitations.vue'),
      meta: { requiresAuth: true }
  },
]
