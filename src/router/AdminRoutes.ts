import type { RouteRecordRaw } from 'vue-router';

const AdminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/auth',
    component: () => import('@/layouts/admin/AdminLayout.vue'),
    meta: {
      requiresAuth: false
    },
    children: [
      {
        name: 'Admin Login',
        path: 'login',
        component: () => import('@/views/admin/AdminLogin.vue')
      }
    ]
  },
  {
    path: '/admin',
    redirect: '/main',
    component: () => import('@/layouts/admin/AdminFullLayout.vue'),
    children: [
      {
        name: 'home-admin',
        path: '/admin',
        // beforeEnter: [isUserAuthenticated],
        component: () => import('@/views/admin/AdminDashboard.vue')
      }
    ]
  }
];

export default AdminRoutes;
