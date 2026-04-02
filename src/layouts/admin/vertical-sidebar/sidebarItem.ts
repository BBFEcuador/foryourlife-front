import { PermissionEnum } from '@/utils/locales/PermissionEnum.ts';

export interface menu {
  header?: string;
  title?: string;
  icon?: string;
  to?: string;
  divider?: boolean;
  getURL?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem = [
  {
    title: 'Dashboard',
    icon: 'material-symbols:dashboard-2-outline',
    to: 'home-admin'
  },
  {
    title: 'Punto de Venta',
    icon: 'mdi:cash-register',
    to: 'pos-main',
    permissions: [PermissionEnum.SEE_EMISSION_POINTS]
  },
  {
    title: 'Administrativo',
    icon: 'solar:users-group-two-rounded-bold',
    permissions: [
      PermissionEnum.SEE_USERS,
      PermissionEnum.SEE_CAMPUS,
      PermissionEnum.SEE_PRODUCTS,
      PermissionEnum.SEE_DISCOUNTS,
      PermissionEnum.SEE_PAYMENTS,
      PermissionEnum.SEE_PAYMENT_METHODS
    ],
    children: [
      {
        title: 'Usuarios',
        to: 'users-admin',
        permissions: [PermissionEnum.SEE_USERS]
      },
      {
        title: 'Sedes',
        to: 'sedes-admin',
        permissions: [PermissionEnum.SEE_CAMPUS]
      },
      {
        title: 'Productos',
        to: 'products-admin',
        permissions: [PermissionEnum.SEE_PRODUCTS]
      },
      {
        title: 'Descuentos',
        to: 'discounts-admin',
        permissions: [PermissionEnum.SEE_DISCOUNTS]
      },
      {
        title: 'Cobros',
        to: 'payments-admin',
        permissions: [PermissionEnum.SEE_PAYMENTS]
      },
      {
        title: 'Métodos de Pago',
        to: 'payment-methods',
        permissions: [PermissionEnum.SEE_PAYMENT_METHODS]
      },
      {
        title: 'CRM',
        to: 'crm-admin',
        // permissions: [PermissionEnum.SEE_PAYMENT_METHODS]
      }
    ]
  },
  {
    title: 'Entrenamiento',
    icon: 'material-symbols-light:model-training',
    children: [
      {
        title: 'Entrenadores',
        to: 'training-admin',
        permissions: [PermissionEnum.SEE_TRAINERS]
      },
      {
        title: 'Entrenamientos',
        to: 'programs-admin',
        permissions: [PermissionEnum.SEE_TRAININGS]
      },
      {
        title: 'Asistencias / Declaraciones',
        to: 'main-attendances',
        permissions: [PermissionEnum.SEE_ATTENDANCES_DECLARATIONS]
      },
      {
        title: 'Equipos',
        to: 'teams-admin',
        permissions: [PermissionEnum.SEE_TEAMS]
      },
      {
        title: 'Participantes',
        to: 'participants-admin',
        permissions: [PermissionEnum.SEE_PARTICIPANTS]
      },
      {
        title: 'Master life',
        to: 'master-life-admin',
        permissions: [PermissionEnum.SEE_MASTER_LIFES]
      },
      {
        title: 'Visionarios',
        to: 'visionary-admin',
        permissions: [PermissionEnum.SEE_VISIONARIES]
      },
      {
        title: 'Staff',
        to: 'staff-admin',
        permissions: [PermissionEnum.SEE_STAFF]
      },
      {
        title: 'Declaraciones Focus / Your',
        to: 'statements-admin',
        permissions: [PermissionEnum.SEE_ATTENDANCES_DECLARATIONS]
      }
    ]
  },
  {
    title: 'Reportes',
    icon: 'mdi:chart-box-outline',
    children: [
      {
        title: 'Por Entrenamiento',
        to: 'reports',
        permissions: [PermissionEnum.SEE_TRAINER_DASHBOARD]
      },
      {
        title: 'Asistente Operativo',
        to: 'operative-assistant-report',
        permissions: [PermissionEnum.SEE_OPERATIVE_DASHBOARD]
      },
      // {
      //   title: 'Financiero',
      //   to: 'financial-administrator-report',
      //   permissions: [PermissionEnum.SEE_FINANCIAL_DASHBOARD]
      // }
    ]
  },
  {
    title: 'Configuración',
    icon: 'material-symbols:settings',
    to: 'settings',
    permissions: [PermissionEnum.SEE_CONFIGURATIONS, PermissionEnum.UPDATE_CONFIGURATIONS]
  }
];

export default sidebarItem;
