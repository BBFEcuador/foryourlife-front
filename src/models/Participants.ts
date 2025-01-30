export interface Participant {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  participantLevel: ParticipantLevel;
  profile: Profile;
  invitationToken: string;
  roleId: string;
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
