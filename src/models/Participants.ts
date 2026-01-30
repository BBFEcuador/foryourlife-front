import type { Campus } from './Campus';
import type { StaffWriteModel } from './Staff';
import type { Trainers } from './Trainers';
import type { TrainingData } from './Training';
import type { User } from './User';
import type { Visionary } from './Visionary';
import type { MasterLife } from '@/models/MasterLife.ts';

export interface Participant {
  id: string;
  user: User;
  participantLevel: ParticipantLevel;
  profile: Profile;
  campus:Campus;
  email: string;
  token: string;
  password: string;
  name: string;
  lastname: string;
  phone: string;
  invitationToken: string;
  roleId: string;
  isLingerer: boolean;
  isDesertor: boolean;
  contacts: any[];
  modules: Modules;
  medicalRecord: MedicalRecord;
  team?: Team;
}

export interface SaveParticipantReq {
  id: string;
  email: string;
  token: string;
  password: string;
  name1: string;
  name2: string;
  lastname1: string;
  lastname2: string;
  phone: string;
  profile: Profile;
  medicalRecord: MedicalRecord;
  contact: EmergencyContactReq;
  termsAndConditions: boolean
}

export interface EmergencyContactReq {
  name: string;
  relationship: string;
  phone: string;
}

export interface ParticipantUpdate {
  id: string;
  email: string;
  token: string;
  password: string;
  name: string;
  lastname: string;
  phone: string;
  profile: Profile;
  invitationToken: string;
  roleId: string;
  lingerer: boolean;
}

export interface ParticipantLevelUpdate {
  id: string;
  modules: Modules;
}

export interface ParticipantLevel {
  id: string;
  roleName: string;
  courseLevel: string;
  started: boolean;
}

export interface Profile {
  id: string;
  address: string;
  occupation: string;
  gender: string;
  civilStatus: string;
  dni: string;
  city: string;
  birthday: string;
}

export interface Modules {
  id: string;
  hasFocus: boolean;
  hasYour: boolean;
  hasLife: boolean;
}

export interface MedicalRecord {
  id: string;
  psychiatric_history_detail: string;
  medical_history_detail: string;
  medication_history_detail: string;
  participantId?: string;
}

export interface Team {
  id: string;
  name: string;
  photo: string;
  trainingNumber: number;
  masterLife: MasterLife[];
  users: Participant[];
  staffs: StaffWriteModel[];
  visionaries: Visionary[];
  trainer: Trainers;
  training?: TrainingData;
  trainingData?: {
    endDate: string;
    name: string;
    curseLevel: string;
    startDate: string;
  };
}
