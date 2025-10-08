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

const trainerSidebarItem = [
  {
    title: 'Dashboard',
    icon: 'material-symbols:dashboard-2-outline',
    to: 'trainer-home'
  }
];

export default trainerSidebarItem;
