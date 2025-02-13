const PublicRoutes = {
  path: '/',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Authentication',
      path: '/login',
      component: () => import('@/views/authentication/LoginPage.vue')
    },
    {
      name: 'Authentication',
      path: '/register/:token',
      component: () => import('@/views/authentication/ParticipantsRegister.vue')
    }
  ]
};

export default PublicRoutes;
