export default [
    {
      path: '/team-application/:teamId/list',
      name: 'team-application-list',
      component: () => import('../views/System/TeamApplication/TeamApplicationList.vue'),
      meta: { requiresAuth: true }
  },
]
