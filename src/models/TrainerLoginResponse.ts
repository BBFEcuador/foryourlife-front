import type { Trainer } from '@/models/Trainers.ts';

export interface TrainerLoginResponse {
  token: string;
  trainer: Trainer
}