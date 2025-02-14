import type { Campus } from './Campus';
import type { Participant } from './Participants';

export interface TeamWriteModel {
  id: string;
  name: string;
  photo: string;
  training: Training;
  trainingNumber: number;
  users: Participant[];
}

export interface Training {
  id: string;
  number: number;
  name: string;
  startDate: string;
  endDate: string;
  courseLevel: string;
  nextLevel: string;
  campus: Campus;
  state: boolean;
}
