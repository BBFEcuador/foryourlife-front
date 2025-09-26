import type { Participant } from './Participants';
export interface Promises {
  id: string;
  firstPromise: number;
  secondPromise: number;
  thirdPromise: number;
  achievedCount: number | null;
  paidCount: number | null;
  startDate: Date;
  endDate: Date;
  participant: Participant;
}

export interface PromiseRequest {
  id: string;
  promise: number;
}
