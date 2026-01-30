export interface ContactEmergency {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export interface RequestContactEmergency {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  userId: string;
}
