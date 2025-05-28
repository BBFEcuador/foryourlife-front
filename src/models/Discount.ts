export interface Discount {
    id: string;
    name: string;
    discountType: string;
    discountValue: number;
    needSupervision: boolean;
    isActive: boolean;
}