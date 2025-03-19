import type { Campus } from './Campus';

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  active: boolean;
  role: Role;
  campus: Campus[];
}

export interface UserActive {
  id: string;
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
  type: string;
}
