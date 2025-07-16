export interface ContificoConfigRequest {
    id?: string | null;
    campusId: string;
    apiKey: string;
    apiSecret: string;
    ruc: string;
    address: string;
    razonSocial: string;
    phone: string;
}
export interface ContificoConfig {
    id: string;
    campusId: string;
    apiKey: string;
    apiSecret: string;
    ruc: string;
    address: string;
    razonSocial: string
    phone: string;
}