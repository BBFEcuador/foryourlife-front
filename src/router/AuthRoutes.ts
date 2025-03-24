import { createRouter, createWebHistory } from 'vue-router';

export const PublicRoutes = {
  path: '/',
  component: () => import('@/layouts/auth/AuthLayout.vue'),
  meta: {
    requiresAuth: false
  },
  redirect: { name: "login-user" },
  children: [
    {
      name: 'login-user',
      path: '/login',
      component: () => import('@/views/authentication/LoginPage.vue')
    }
  ]
};

export const RegisterRoutes = {
  path: '/register/:token',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Authentication',
      path: '',
      component: () => import('@/views/authentication/ParticipantsRegister.vue')
    }
  ]
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    PublicRoutes,
    RegisterRoutes
  ]
});
export default router;
