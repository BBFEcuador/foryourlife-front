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
  { header: 'Dashboard' },
  {
    title: 'Dashboard',
    icon: 'material-symbols:dashboard-2-outline',
    to: 'home-admin'
  },
  { header: 'Administrador' },
  {
    title: 'Usuarios',
    icon: 'solar:users-group-two-rounded-bold',
    to: 'users-admin',
    children: [
      {
        title: 'Usuarios',
        to: 'users-admin'
      }
    ]
  },
  { header: 'Programa' },
  { header: 'Ajustes' },
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
