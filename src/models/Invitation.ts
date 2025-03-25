export interface Invitation {
  id: string;
  token: string;
  users: any;
  senderId: string;
  quantity: number;
  enrolled: Enrolled;
  admin: boolean;
  used: boolean;
}

export interface Enrolled {
  name: string;
  contact: string;
}
