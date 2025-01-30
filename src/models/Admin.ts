import type { Campus } from './Campus';

export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  campus: Campus[];
}

export interface Role {
  id: string;
  name: string;
  type: string;
}
