import type { User } from "./User";

export interface CashBox {
    id: string;
    number: string;
    isActive: boolean;
    createdBy: User;
    created_at: string;
}

export interface CashBoxRequest {
    id?: string;
    number: string;
    detail?: string;
    user: User
}

export interface CashDrawer {
  id:             string;
  status:         string;
  openedByUser:   User;
  closedByUser:   User;
  startDate:      string;
  closeDate:      string;
  openingBalance: number;
  closedBalance:  number;
  detail:         string | null;
  cashBox:        CashBox;
  created_at:     string;
  actualBalance:  number;
}
