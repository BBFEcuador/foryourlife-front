const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: false
  },
  redirect: '/main',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'UserDashboard',
      path: '/dashboard',
      component: () => import('@/views/user/UserDashboard.vue')
    },
    {
      name: 'userPayments',
      path: '/payments',
      component: () => import('@/views/user/PaymentsList.vue')
    }
  ]
};

export default MainRoutes;
