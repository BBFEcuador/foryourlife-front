import type { Campus } from './Campus';

export interface TrainingData {
  id: string;
  number: number;
  name: string;
  startDate: string;
  endDate: string;
  courseLevel: string;
  nextLevel: TrainingData;
  campus: Campus;
  state: boolean;
}
