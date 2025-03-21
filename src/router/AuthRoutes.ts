const PublicRoutes = {
  path: '/',
  component: () => import('@/layouts/auth/AuthLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'login-user',
      path: '/login',
      component: () => import('@/views/authentication/LoginPage.vue')
    },
    {
      name: 'Authentication',
      path: '/register/:token',
      component: () => import('@/views/authentication/ParticipantsRegister.vue')
    },
  ]
};

export default PublicRoutes;
