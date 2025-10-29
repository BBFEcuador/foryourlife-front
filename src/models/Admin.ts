import type { Campus } from './Campus';
import type { User } from './User';

export interface Admin {
  id: string;
  user: User;
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
