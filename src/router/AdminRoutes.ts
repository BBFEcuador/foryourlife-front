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
    component: () => import('@/layouts/admin/AdminFullLayout.vue'),
    children: [
      {
        name: 'home-admin',
        path: '',
        // beforeEnter: [isUserAuthenticated],
        component: () => import('@/views/admin/AdminDashboard.vue')
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('@/views/admin/AdminSettings.vue')
      },
      {
        name: 'users-admin',
        path: 'users',
        component: () => import('@/views/admin/users/AdminUsers.vue')
      },
      {
        name: 'sedes-admin',
        path: 'sedes',
        component: () => import('@/views/admin/sedes/AdminSedes.vue')
      },
    ]
  }
];

export default AdminRoutes;
