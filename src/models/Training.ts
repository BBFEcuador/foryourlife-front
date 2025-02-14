import type { Campus } from './Campus';

export interface Training {
  id: string;
  number: number;
  name: string;
  startDate: string;
  endDate: string;
  courseLevel: string;
  nextLevel: Training;
  campus: Campus;
  state: boolean;
}
