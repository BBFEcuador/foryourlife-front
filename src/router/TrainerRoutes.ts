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
  }
];
export default TrainerRoutes