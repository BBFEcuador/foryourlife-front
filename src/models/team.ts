import type { Campus } from './Campus';
import type { Participant } from './Participants';
import type { Trainers } from './Trainers';

export interface TeamWriteModel {
  id: string;
  name: string;
  photo: string;
  training: string;
  trainer: string;
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
