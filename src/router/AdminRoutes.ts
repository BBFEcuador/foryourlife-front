import type { RouteRecordRaw } from 'vue-router';
import { adminStore } from '@/stores/adminStore';

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
        component: () => import('@/views/admin/team/AdminCreateTeamv2.vue')
      },
      {
        name: 'teams-admin-update',
        path: 'teams/edit/:id',
        component: () => import('@/views/admin/team/AdminTeamsUpdate.vue')
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
      },
      {
        name: 'master-life-admin',
        path: 'master-life',
        component: () => import('@/views/admin/masterLife/AdminMasterLife.vue')
      },
      {
        name: 'staff-admin',
        path: 'staff',
        component: () => import('@/views/admin/staff/AdminStaffList.vue')
      },
      {
        name: 'visionary-admin',
        path: 'visionarios',
        component: () => import('@/views/admin/visionaries/AdminVisionariesList.vue')
      },
      {
        name: 'promote-focus',
        path: 'focusToYour/:id',
        component: () => import('@/views/admin/team/PromoteFocus.vue')
      },
      {
        name: 'promote-your',
        path: 'yourToLife/:id',
        component: () => import('@/views/admin/team/PromoteYour.vue')
      },
      {
        name: 'promote-life',
        path: 'lifeToMasterlife/:id',
        component: () => import('@/views/admin/team/PromoteLife.vue')
      },
      {
        name: 'products-admin',
        path: 'products',
        component: () => import('@/views/admin/products/Products.vue')
      },
      {
        name: 'discounts-admin',
        path: 'discounts',
        component: () => import('@/views/admin/discounts/DiscountList.vue')
      },
      {
        name: 'payments-admin',
        path: 'payments',
        component: () => import('@/views/admin/payments/PaymentsList.vue')
      },
      {
        name: 'invoices-admin',
        path: 'invoices',
        component: () => import('@/views/admin/invoices/InvoiceList.vue')
      },
      {
        name: 'payments-admin-create',
        path: 'payments/create',
        component: () => import('@/views/admin/payments/PaymentsCreate.vue'),
        beforeEnter: (to, from, next) => {
          if (adminStore().isCashDrawerOpen) {
            next();
          } else {
            next({ name: 'pos-main' });
          }
        }
      },
      {
        name: 'payment-methods',
        path: 'payment-methods',
        component: () => import('@/views/admin/paymentMethods/PaymentMethodsList.vue')
      },
      {
        name: 'pos-preload',
        path: 'pos-preload',
        component: () => { },
        beforeEnter: (to, from, next) => {
          if (adminStore().isCashDrawerOpen) {
            next({ name: 'payments-admin-create' });
          } else {
            next({ name: 'pos-main' });
          }
        }
      },
      {
        name: 'pos-main',
        path: 'pos',
        component: () => import('@/views/admin/pos/Pos.vue'),
        beforeEnter: (to, from, next) => {
          if (adminStore().isCashDrawerOpen) {
            next({ name: 'payments-admin-create' });
          } else {
            next();
          }
        }
      }
    ]
  }
];

export default AdminRoutes;
