import type { Campus } from './Campus';
import type { User } from './User';

export interface CashBox {
  id: string;
  number: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  firstNumberInvoice: number;
  store: Store;
  opened: boolean;
  openedByUser: string;
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
  campus: Campus;
  isActive: boolean;
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
  createdAt: string;
  actualBalance: number;
}
