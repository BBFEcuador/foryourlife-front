import type { StaffWriteModel } from "./Staff";
import type { Trainers } from "./Trainers";
import type { TrainingData } from "./Training";
import type { Visionary } from "./Visionary";

export interface Participant {
  id: string;
  email: string;
  token: string;
  password: string;
  name: string;
  phone: string;
  participantLevel: ParticipantLevel;
  profile: Profile;
  invitationToken: string;
  roleId: string;
  lingerer: boolean;
  contacts: any[];
  modules: Modules;
  team?: Team;
}

export interface ParticipantUpdate {
  id: string;
  email: string;
  token: string;
  password: string;
  name: string;
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
  id: string
  hasFocus: boolean
  hasYour: boolean
  hasLife: boolean
}

export interface Team {
  id: string
  name: string
  photo: string
  trainingNumber: number
  masterLife: Participant[]
  users: Participant[]
  staff: StaffWriteModel[]
  visionaries: Visionary[]
  trainer: Trainers
  training: TrainingData,
  trainingData?: {
    endDate: string;
    name: string;
    curseLevel: string;
    startDate: string;
  };
}