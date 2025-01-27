import type { StringSchema } from "yup";

export interface menu {
  header?: string;
  title?: string;
  icon?: string;
  to?: string;
  divider?: boolean;
  getURL?: boolean;
  chip?: string;
  id?: number;
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
        icon: 'material-symbols:dashboard',
        to: 'home-admin'
      },
      {
        title: 'Usuarios',
        icon: 'solar:users-group-two-rounded-line-duotone',
        to: 'users-admin',
        id: 2
      },
      {
        title: 'Sedes',
        icon: 'material-symbols:local-convenience-store-outline-sharp',
        to: 'sedes-admin'
      },
      {
        title: 'Precios',
        icon: 'solar:tag-price-bold',
        to: 'prices-admin'
      },
    ]

export default sidebarItem;
