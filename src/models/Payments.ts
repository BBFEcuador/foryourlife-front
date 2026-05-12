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
  status: Status;
  note: any;
  invoice: Invoice[];
  hasSomePaymentWithError: boolean;
  createdDate: string;
}

export interface PaymentRequest {
  products: string[];
  participant: string;
  campus: string;
  total: number;
  totalDiscount: number;
  paymentsHistory?: PaymentHistory[];
  trainingId: string;
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
  pingType?: PingType;
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

export enum Status {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED'
}

export const StatusMeta: Record<Status, { label: string; color: string; icon: string }> = {
  [Status.PENDING]: { label: 'Pendiente', color: 'warning', icon: 'mdi-clock-outline' },
  [Status.COMPLETED]: { label: 'Completado', color: 'success', icon: 'mdi-check-circle-outline' },
  [Status.REJECTED]: { label: 'Rechazado', color: 'error', icon: 'mdi-close-circle-outline' },
  [Status.APPROVED]: { label: 'Aprobado', color: 'info', icon: 'mdi-check-circle' },
  [Status.CANCELLED]: { label: 'Cancelado', color: 'secondary', icon: 'mdi-cancel' }
};

export enum PingType {
  D = 'D',
  M = 'M',
  P = 'P',
  E = 'E',
  A = 'A', 
}

export const PingTypeMeta: Record<PingType, { label: string }> = {
  [PingType.D]: { label: 'Débito' },
  [PingType.M]: { label: 'Crédito'  },
  [PingType.P]: { label: 'Efectivo' },
  [PingType.E]: { label: 'Transferencia' },
  [PingType.A]: { label: 'Otro' },
};
