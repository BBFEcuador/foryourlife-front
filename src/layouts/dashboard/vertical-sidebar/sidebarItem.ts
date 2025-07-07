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
    title: 'Invitación',
    icon: 'mdi:qrcode',
    to: 'UserDashboard'
  },
  {
    title: 'Mis pagos',
    icon: 'hugeicons:payment-02',
    to: 'userPayments'
  },
];

export default sidebarItem;
