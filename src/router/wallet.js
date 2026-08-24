export default [
  {
    path: '/financeiro',
    name: 'meu-financeiro',
    component: () => import('../views/System/Wallet/MeuFinanceiro.vue'),
    meta: { requiresAuth: true }
  },
]
