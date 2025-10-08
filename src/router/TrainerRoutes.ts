import type { RouteRecordRaw } from 'vue-router';

const TrainerRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/trainer',
    component: () => import('@/layouts/trainer/TrainerLayout.vue'),
    meta: {
      requiresAuth: false
    },
    children: [
      {
        name: 'trainer-login',
        path: 'login',
        component: () => import('@/views/trainer/login/TrainerLogin.vue')
      }
    ]
  },
  {
    path: '/trainer',
    component: () => import('@/layouts/trainer/TrainerFullLayout.vue'),
    children: [
      {
        name: 'trainer-home',
        path: '',
        component: () => import('@/views/trainer/dashboard/Dashboard.vue')
      },
      {
        name: 'trainer-team',
        path: 'team/:id',
        component: () => import('@/views/trainer/team/TrainerTeam.vue')
      }
    ]
  },
];
export default TrainerRoutes