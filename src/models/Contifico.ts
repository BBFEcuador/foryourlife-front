export interface ContificoConfigRequest {
    id?: string;
    campusId: string;
    apiKey: string;
    apiSecret: string;
    ruc: string;
}
export interface ContificoConfig {
    id: string;
    campusId: string;
    apiKey: string;
    apiSecret: string;
    ruc: string;
}