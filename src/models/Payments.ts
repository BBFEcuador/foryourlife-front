import type { Product } from "./Products";
import type { Participant } from "./Participants";

export interface Payment {
    id: string;
    product: Product;
    participant: Participant;
    campus: string;
    total: number;
}

export interface PaymentRequest {
    product: string;
    participant: string;
    campus: string;
    total: number;    
}

export interface PaymentResponse {
    id: string;
    product: Product;
    participant: Participant;
    campus: string;
    total: number;    
}
