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
    to: 'pos-preload',
  },
  {
    title: 'Administrativo',
    icon: 'solar:users-group-two-rounded-bold',
    children: [
      {
        title: 'Usuarios',
        to: 'users-admin'
      },
      {
        title: 'Sedes',
        to: 'sedes-admin'
      },
      {
        title: 'Productos',
        to: 'products-admin'
      },
      {
        title: 'Descuentos',
        to: 'discounts-admin'
      },
      {
        title: 'Pagos',
        to: 'payments-admin'
      },
      {
        title: 'Métodos de Pago',
        to: 'payment-methods'
      }
    ]
  },
  {
    title: 'Entrenamiento',
    icon: 'material-symbols-light:model-training',
    children: [
      {
        title: 'Entrenadores',
        to: 'training-admin'
      },
      {
        title: 'Programas',
        to: 'programs-admin'
      },
      {
        title: 'Equipos',
        to: 'teams-admin'
      },
      {
        title: 'Participantes',
        to: 'participants-admin'
      },
      {
        title: 'Master life',
        to: 'master-life-admin'
      },
      {
        title: 'Visionarios',
        to: 'visionary-admin'
      },
      {
        title: 'Staff',
        to: 'staff-admin'
      },
    ]
  },
  {
    title: 'Generales',
    icon: 'material-symbols:settings',
    children: [
      {
        title: 'Perfil',
        to: 'settings'
      }
    ]
  },
];

export default sidebarItem;
