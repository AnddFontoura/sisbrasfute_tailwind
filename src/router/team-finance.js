export default [
  {
    path: '/team/:teamId/receivables',
    name: 'team-receivables',
    component: () => import('../views/System/TeamFinance/TeamReceivables.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team-finance/:teamId/list',
    name: 'team-finance-list',
    component: () => import('../views/System/TeamFinance/TeamFinanceList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team-finance/:teamId/settings',
    name: 'team-finance-settings',
    component: () => import('../views/System/TeamFinance/TeamFinanceSettings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team-finance/:teamId/show/:id',
    name: 'team-finance-show',
    component: () => import('../views/System/TeamFinance/TeamFinanceShow.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team-finance/:teamId/form',
    name: 'team-finance-form',
    component: () => import('../views/System/TeamFinance/TeamFinanceForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team-finance/:teamId/edit/:id',
    name: 'team-edit-finance',
    component: () => import('../views/System/TeamFinance/TeamFinanceForm.vue'),
    meta: { requiresAuth: true }
  },
]
