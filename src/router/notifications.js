export default [
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/System/Notifications/NotificationList.vue'),
    meta: { requiresAuth: true }
  },
]
