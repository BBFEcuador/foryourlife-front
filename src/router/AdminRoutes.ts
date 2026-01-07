import type { RouteRecordRaw } from 'vue-router';
import { adminStore } from '@/stores/adminStore';
import { PermissionEnum } from '@/utils/locales/PermissionEnum.ts';

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
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_CONFIGURATIONS]
        },
        component: () => import('@/views/admin/AdminSettings.vue')
      },
      {
        name: 'users-admin',
        path: 'users',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_USERS]
        },
        component: () => import('@/views/admin/users/AdminUsers.vue')
      },
      {
        name: 'users-admin-add',
        path: 'users/add',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.CREATE_USERS]
        },
        component: () => import('@/views/admin/users/AddAdminUser.vue')
      },
      {
        name: 'sedes-admin',
        path: 'sedes',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_CAMPUS]
        },
        component: () => import('@/views/admin/sedes/AdminSedes.vue')
      },
      {
        name: 'training-admin',
        path: 'trainers',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_TRAINERS]
        },
        component: () => import('@/views/admin/training/AdminTraining.vue')
      },
      {
        name: 'programs-admin',
        path: 'program',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_TRAININGS]
        },
        component: () => import('@/views/admin/programs/AdminPrograms.vue')
      },
      {
        name: 'teams-admin',
        path: 'teams',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_TEAMS]
        },
        component: () => import('@/views/admin/team/AdminTeams.vue')
      },
      {
        name: 'teams-admin-add',
        path: 'teams/add',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.CREATE_TEAMS]
        },
        component: () => import('@/views/admin/team/AdminCreateTeamv2.vue')
      },
      {
        name: 'teams-admin-update',
        path: 'teams/edit/:id',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.UPDATE_TEAMS]
        },
        component: () => import('@/views/admin/team/AdminTeamsUpdate.vue')
      },
      {
        name: 'teams-admin-organigram',
        path: 'teams/organigram/:id',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.UPDATE_TEAMS]
        },
        component: () => import('@/views/admin/team/AdminTeamsOrganigram.vue')
      },
      {
        name: 'participants-admin',
        path: 'participants',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_PARTICIPANTS]
        },
        component: () => import('@/views/admin/participants/AdminParticipants.vue')
      },
      {
        name: 'participants-admin-edit',
        path: 'participants/edit/:id',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.UPDATE_PARTICIPANTS]
        },
        component: () => import('@/views/admin/participants/EditParticipants.vue')
      },
      {
        name: 'calendar-admin',
        path: 'calendar',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_TRAININGS]
        },
        component: () => import('@/views/admin/programs/AdminPrograms.vue')
      },
      {
        name: 'master-life-admin',
        path: 'master-life',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_MASTER_LIFES]
        },
        component: () => import('@/views/admin/masterLife/AdminMasterLife.vue')
      },
      {
        name: 'staff-admin',
        path: 'staff',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_STAFF]
        },
        component: () => import('@/views/admin/staff/AdminStaffList.vue')
      },
      {
        name: 'visionary-admin',
        path: 'visionarios',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_VISIONARIES]
        },
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
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_PRODUCTS]
        },
        component: () => import('@/views/admin/products/Products.vue')
      },
      {
        name: 'discounts-admin',
        path: 'discounts',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_DISCOUNTS]
        },
        component: () => import('@/views/admin/discounts/DiscountList.vue')
      },
      {
        name: 'payments-admin',
        path: 'payments',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_PAYMENTS]
        },
        component: () => import('@/views/admin/payments/PaymentsList.vue')
      },
      {
        name: 'payments-admin-create',
        path: 'payments/create',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_PAYMENTS]
        },
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
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_PAYMENT_METHODS]
        },
        component: () => import('@/views/admin/paymentMethods/PaymentMethodsList.vue')
      },
      {
        name: 'crm-admin',
        path: 'crm-admin',
        // meta: {
        //   requiresAuth: true,
        //   permissions: [PermissionEnum.SEE_PAYMENT_METHODS]
        // },
        component: () => import('@/views/admin/crm/AdminCRM.vue')
      },
      {
        name: 'reports',
        path: 'reports',
        // meta: {
        //   requiresAuth: true,
        //   permissions: [PermissionEnum.SEE_PAYMENT_METHODS]
        // },
        component: () => import('@/views/admin/reports/AdminReports.vue')
      },
      {
        name: 'operative-assistant-report',
        path: 'operative-assistant-report',
        // meta: {
        //   requiresAuth: true,
        //   permissions: [PermissionEnum.SEE_PAYMENT_METHODS]
        // },
        component: () => import('@/views/admin/reports/OperationalAssistantReport.vue')
      },
      {
        name: 'financial-administrator-report',
        path: 'financial-administrator-report',
        // meta: {
        //   requiresAuth: true,
        //   permissions: [PermissionEnum.SEE_PAYMENT_METHODS]
        // },
        component: () => import('@/views/admin/reports/FinancialAdministratorReport.vue')
      },
      {
        name: 'pos-main',
        path: 'pos',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_EMISSION_POINTS]
        },
        component: () => import('@/views/admin/pos/Pos.vue')
      },
      {
        name: 'cash-drawer-balances',
        path: 'pos/balances/:id',
        component: () => import('@/views/admin/pos/CashDrawersBalances.vue')
      },
      {
        name: 'main-attendances',
        path: 'asistencias',
        meta: {
          requiresAuth: true,
          permissions: [PermissionEnum.SEE_ATTENDANCES_DECLARATIONS]
        },
        component: () => import('@/views/admin/attendance/SelectAttendanceWithTraining.vue')
      }
    ]
  }
];

export default AdminRoutes;
