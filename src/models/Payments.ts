import type { Product } from './Products';
import type { Participant } from './Participants';
import type { Campus } from './Campus';
import type { Invoice } from './Invoice';

export interface Payment {
  id: string;
  products: Product[];
  discount: any;
  participant: Participant;
  campus: Campus;
  paymentshistory: PaymentHistory[];
  total: number;
  remainingBalance: number;
  status: string;
  note: any;
  invoice: Invoice[];
}

export interface PaymentRequest {
  products: string[];
  participant: string;
  campus: string;
  total: number;
  totalDiscount: number;
  paymentsHistory?: PaymentHistory[];
  invoice: {
    type: string;
    fullName: string;
    address: string;
    document: string;
    phone: string;
    email: string;
  };
  note?: string;
  cashDrawerId: string;
}

export interface PaymentResponse {
  id: string;
  product: Product;
  participant: Participant;
  campus: string;
  total: number;
}

export interface PaymentMethod {
  id: string;
  type: string;
  isActive: boolean;
  code: string;
  campus: Campus;
  bank?: BankAccount;
}

export interface PaymentHistory {
  date: string;
  amount: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  sent?: boolean;
  pingType?: string;
  notSendError?: string;
}

export interface PaymentHistoryRequest {
  paymentId: string;
  paymentHistory: PaymentHistory;
  cashDrawerId: string;
}

export interface PaymentMethodRequest {
  id?: string;
  type: string;
  isActive: boolean;
  code: string;
  campusId: string;
  bankId?: string;
}

export interface SriPaymentMethod {
  id: string;
  method: string;
  name: string;
  code: string;
}

export interface BankAccount {
  id: string;
  name: string;
  number: string;
  contificoId: string;
  campus: Campus;
}

export interface BankAccountRequest {
  id?: string;
  name: string;
  number: string;
  campusId: string;
}
