import type { Campus } from './Campus';

export interface Admin {
  id: string;
  name1: string;
  name2: string;
  lastName1: string;
  lastName2: string;
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
