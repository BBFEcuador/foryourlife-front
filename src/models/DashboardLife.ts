export interface DashboardLife {
  trainingName: string;
  trainerName: string;
  trainingDate: string;
  courseLevel: string;
  lingererStats: LingererStats;
  lifeAttendanceDashboard: AttendanceDashboard;
  previousTrainingStats: previousTrainingStats;
  declarationStats: DeclarationStats
  users: Users[];
}[];

export interface Users {
  userName: string;
  userEntity: string;
  fridayAttendance: 'ASISTIO' | 'FALTO';
  saturdayAttendance: 'ASISTIO' | 'FALTO';
  sundayAttendance: 'ASISTIO' | 'FALTO';
  firstPromise: number;
  secondPromise: number;
  thirdPromise: number;
  achievedCount: number;
  paidCount: number;

}

export interface LingererStats {
  total: number;
  attended: number;
  notAttended: number;
  finalJornal: TotalJornals;
  penultimateJornal: TotalJornals;
  penultimateMatchJornal: TotalJornals;
  recovered: TotalJornals;
}

export interface TotalJornals {
  total: number;
  attended: number;
}

export interface AttendanceDashboard {
  deserterParticipantsCount: number;
  deserterParticipantsPercentage: number;
  enrollmentEffectiveness: number;
  enrollmentIndex: number;
  masterAttendancesCount: number;
  masterEnrolledCount: number;
  participantAttendancesCount: number;
  participantEnrolledCount: number;
  realEnrollmentIndex: number;
  totalAttendancesCount: number;
  totalEnrollmentCount: number;
  totalFocusAttendancesCount: number;
  totalMasterParticipants: number;
  totalParticipants: number;
  totalTotalUsers: number;
  totalUsersEnrollersPercentage: number;
  totalUsersEnrollersCount: number;
  staffMembersCount: number;
  staffMembersPercentage: number;
  focusDeclarationPercentage: number;
  focusDeclarationsCount: number;
}

export interface previousTrainingStats {
  attendeesFromPreviousTraining: number;
  attendeesFromPreviousTrainingPercentage: number;
  finalPaymentsFromPreviousTraining: number;
  finalPaymentsFromPreviousTrainingPercentage: number;
  previousLifePayments: number;
}

export interface DeclarationStats {
  accomplishmentMasterLife: number;
  accomplishmentParticipant: number;
  accomplishmentTeam: number;
  masterLifeCount: number;
  masterLifeEnrollmentIndex: number;
  participantCount: number;
  participantEnrollmentIndex: number;
  teamCount: number;
  teamEnrollmentIndex: number;
  totalMasterLifeAchievedCount: number;
  totalMasterLifePaidCount: number;
  totalMasterLifePromisesCount: number;
  totalParticipantAchievedCount: number
  totalParticipantPaidCount: number;
  totalParticipantPromisesCount: number;
  totalTeamAchievedCount: number;
  totalTeamLifePromisesCount: number;
  totalTeamPaidCount: number;
  totalUsersEnrollersCount: number;
  totalUsersEnrollersPercentage: number;
  totalUsersNotEnrolledCount: number;
}
