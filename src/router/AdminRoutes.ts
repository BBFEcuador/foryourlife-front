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
      },
      {
        name: 'Admin Reset Password',
        path: 'reset-password',
        component: () => import('@/views/admin/AdminResetPassword.vue')
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
        name: 'users-admin-add',
        path: 'users/add',
        component: () => import('@/views/admin/users/AddAdminUser.vue')
      },
      {
        name: 'sedes-admin',
        path: 'sedes',
        component: () => import('@/views/admin/sedes/AdminSedes.vue')
      },
      {
        name: 'training-admin',
        path: 'trainers',
        component: () => import('@/views/admin/training/AdminTraining.vue')
      },
      {
        name: 'programs-admin',
        path: 'program',
        component: () => import('@/views/admin/programs/AdminPrograms.vue')
      },
      {
        name: 'teams-admin',
        path: 'teams',
        component: () => import('@/views/admin/team/AdminTeams.vue')
      },
      {
        name: 'teams-admin-add',
        path: 'teams/add',
        //component: () => import('@/views/admin/team/AdminSaveTeam.vue')
        component: () => import('@/views/admin/team/AdminCreateTeam.vue')
      },
      {
        name: 'participants-admin',
        path: 'participants',
        component: () => import('@/views/admin/participants/AdminParticipants.vue')
      },
      {
        name: 'participants-admin-edit',
        path: 'participants/edit/:id',
        component: () => import('@/views/admin/participants/EditParticipants.vue')
      },
      {
        name: 'calendar-admin',
        path: 'calendar',
        component: () => import('@/views/admin/programs/AdminPrograms.vue')
      }
    ]
  }
];

export default AdminRoutes;
