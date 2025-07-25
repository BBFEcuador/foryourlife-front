import type { Campus } from "./Campus";
import type { User } from "./User";

export interface CashBox {
  id: string;
  number: string;
  isActive: boolean;
  createdBy: User;
  created_at: string;
  firstNumberInvoice: number;
  store: Store;
}

export interface CashBoxRequest {
  id?: string;
  number: string;
  user: User;
  firstNumberInvoice: number;
  store: Store;
}


export interface Store {
  id: string;
  address: string;
  number: string;
  campus: Campus,
}

export interface StoreRequest {
  id?: string;
  address: string;
  number: string;
  campusId: string;
}

export interface CashDrawer {
  id: string;
  status: string;
  openedByUser: User;
  closedByUser: User;
  startDate: string;
  closeDate: string;
  openingBalance: number;
  closedBalance: number;
  detail: string | null;
  cashBox: CashBox;
  created_at: string;
  actualBalance: number;
}
