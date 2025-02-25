import type { BlobOptions } from "buffer";
import type { BlockLike } from "typescript";

export interface Trainers{
    id: string;
    name: string;
    email: string,
    phone: string,
    password: string,
    active: boolean
}

export interface TrainerActive{
    id: string;
    isActive: boolean;
}