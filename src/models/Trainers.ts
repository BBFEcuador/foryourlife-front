import type { Team } from "./Participants";

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

export interface TrainerLoginRequest {
    email: string;
    password: string;
}

export interface LoginTrainerResponse {
  trainer: Trainer;
  token: string;
}

export interface Trainer {
  id: string
  name: string
  email: string
  phone: string
  password: string
  teams: Team[]
  active: boolean
}