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

const sidebarItem: menu[] = [
  {
    title: 'Dashboard',
    icon: 'material-symbols:dashboard-2-outline',
    to: 'home-admin'
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
      }
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
  }
];

export default sidebarItem;
