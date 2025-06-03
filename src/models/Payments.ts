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
  invoice: {
    fullName: string;
    address: string;
    document: string;
    phone: string;
    email: string;
  }
}

export interface PaymentResponse {
  id: string;
  product: Product;
  participant: Participant;
  campus: string;
  total: number;
}
