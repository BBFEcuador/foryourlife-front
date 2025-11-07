import type { Participant } from './Participants';
import type { User } from '@/models/User.ts';
export interface Promises {
  id: string;
  firstPromise: number;
  secondPromise: number;
  thirdPromise: number;
  achievedCount: number | null;
  paidCount: number | null;
  startDate: Date;
  endDate: Date;
  user: User;
}

export interface PromiseRequest {
  id: string;
  promise: number;
  day:string;
}
