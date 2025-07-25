import type { Payment } from "./Payments";
import type { Product } from "./Products";

export interface Invoice {
    id: string;
    fullName: string;
    address: string;
    document: string;
    phone: string;
    email: string;
    invoiceNumber: string;
    invoiceDate: Date;
    products: Product[];
    payment: Payment;
    taxAmount: number;
    contificoId: string;
    contificoError: string;
    tax: number;
    amount: number;
    invoiceContifico: InvoiceContifico;
    sentContifico: boolean;
}

export interface EditInvoiceReq {
    id: string;
    fullName: string;
    address: string;
    document: string;
    phone: string;
    email: string;
}

export interface InvoiceContifico {
    pos: string;
    fecha_emision: string;
    tipo_documento: string;
    documento: string;
    autorizacion: string;
    cliente: Cliente;
    subtotal_0: number;
    subtotal_12: number;
    ice: number;
    iva: number;
    total: number;
    detalles: Detalle[];
    base_no_gravable: number;
    adicional1: string;
    estado: string;
}

export interface Cliente {
    cedula: string;
    razon_social: string;
    telefonos: string;
    direccion: string;
    tipo: string;
    email: string;
    ruc: null;
}

export interface Detalle {
    producto_id: string;
    cantidad: number;
    precio: number;
    porcentaje_iva: number;
    porcentaje_descuento: number;
    base_cero: number;
    base_gravable: number;
    base_no_gravable: number;
    porcentaje_ice: number;
    valor_ice: number;
}
