import type { Campus } from './Campus';
import type { Team } from './Participants';

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
  originalTeam?: Team;
}
