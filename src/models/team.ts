import type { Campus } from './Campus';
import type { Participant } from './Participants';

export interface TeamWriteModel {
  id: string;
  name: string;
  photo: string;
  training: string;
  trainer: string;
  users: Participant[];
  staffIds: string[];
  visionaryIds: string[];
}
