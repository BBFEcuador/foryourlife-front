import type { RouteRecordRaw } from 'vue-router';

const TrainerRoutes: RouteRecordRaw[] = [
  {
    path: '/trainer/auth',
    component: () => import('@/layouts/trainer/TrainerLayout.vue'),
    meta: {
      requiresAuth: false
    },
    children: [
      {
        name: 'Trainer Login',
        path: 'login',
        component: () => import('@/views/trainer/login/TrainerLogin.vue')
      }
    ]
  },
  {
    path: '/trainer',
    component: () => import('@/layouts/trainer/TrainerFullLayout.vue'),
    meta: {
      requiresAuth: false
    },
    children: [
      {
        name: 'Trainer Home',
        path: '',
        component: () => import('@/views/trainer/dashboard/Dashboard.vue')
      }
    ]
  }
];
export default TrainerRoutes