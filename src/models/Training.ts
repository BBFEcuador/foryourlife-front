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
  courseLevelDisplay?: string;
}

export interface AttendanceDashboard {
  fridayCount: number;
  saturdayCount: number;
  sundayCount: number;
  totalParticipants: number;
  masterFridayCount: number;
  masterSaturdayCount: number;
  masterSundayCount: number;
}

// export interface PromiseDashboard {
//   totalFirstPromise: number;
//   totalSecondPromise: number;
//   totalThirdPromise: number;
//   totalAchieved: number;
//   totalPaid: number;
//   totalMasterLifePromise: number;
//   totalMasterLifeAchieved: number;
//   totalMasterLifePaid: number;
//   totalFirstMasterLifePromise: number;
//   totalSecondMasterLifePromise: number;
//   totalThirdMasterLifePromise: number;
// }

export interface UserTraining {
  userName: string;
  userEntity: string;
  fridayAttendance: 'ASISTIO' | 'FALTO'; // si solo existen esos valores
  saturdayAttendance: 'ASISTIO' | 'FALTO';
  sundayAttendance: 'ASISTIO' | 'FALTO';
  firstPromise: number;
  secondPromise: number;
  thirdPromise: number;
  achievedCount: number;
  paidCount: number;

}

export interface TrainingMasterLifeDashboard {
  trainingName: string;
  trainerName: string;
  attendanceDashboard: AttendanceDashboard;
  // promiseDashboard: PromiseDashboard;
  users: UserTraining[];
}
