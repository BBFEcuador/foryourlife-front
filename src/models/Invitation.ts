export interface Invitation {
  id: string;
  token: string;
  users: {
    userId: string;
    name: string;
    enrolledDate: Date
  }[];
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
