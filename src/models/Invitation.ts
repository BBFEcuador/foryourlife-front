import type { Campus } from './Campus';

export interface Invitation {
  id: string;
  token: string;
  users: User[];
  campus: Campus;
  senderId: string;
  quantity: number;
  enrolled: Enrolled;
  admin: boolean;
  active: boolean;
}

export interface Enrolled {
  id: string;
  name: string;
  trainingName: any;
  contact: string;
}
  
export interface User {
  userId: string;
  name: string;
  enrolledDate: string;
}
