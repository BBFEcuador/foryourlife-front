import type { Product } from './Products';
import type { Participant } from './Participants';
import type { Campus } from './Campus';

export interface Payment {
  id: string;
  products: Product[];
  discount: any;
  participant: Participant;
  campus: Campus;
  paymentshistory: any[];
  total: number;
  status: string;
  note: any;
}

export interface PaymentRequest {
  products: string[];
  participant: string;
  campus: string;
  total: number;
  paymentsHistory?: PaymentHistory[];
  invoice: {
    fullName: string;
    address: string;
    document: string;
    phone: string;
    email: string;
  }
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
  campus:Campus;
}

export interface PaymentHistory {
  date: string;
  amount: string;
  paymentMethod: PaymentMethod
}

export interface PaymentHistoryRequest {
  paymentId: string;
  paymentHistory: PaymentHistory;
  cashDrawerId: string;
}

export interface PaymentMethodRequest {
  id?:string;
  type:string;
  isActive:boolean;
  code:string;
  campusId:string;
}

export interface SriPaymentMethod {
  id:string;
  method:string;
  name:string;
  code:string;
}
