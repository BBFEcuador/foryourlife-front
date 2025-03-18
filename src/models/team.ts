import type { Participant } from './Participants';
import type { MinimalEntity } from './Shared';
import type { StaffWriteModel } from './Staff';
import type { Trainers } from './Trainers';
import type { TrainingData } from './Training';
import type { Visionary } from './Visionary';

export interface TeamWriteModel {
  id: string;
  name: string;
  photo: string;
  training: string;
  trainingObj: TrainingData;
  trainer: string;
  lvl: string;
  trainerObj: Trainers;
  users: Participant[];
  masterLife: Participant[];
  staffs: StaffWriteModel[];
  visionaries: Visionary[];
}

export interface TeamYourPromotionRequest {
  id: string;
  users: Participant[];
  staffs: StaffWriteModel[];
  trainer: string;
}

export interface TeamLifePromotionRequest {
  id: string;
  users: Participant[];
  masterLife: Participant[];
  trainer: string;
}
