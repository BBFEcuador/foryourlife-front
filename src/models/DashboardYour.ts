export interface AttendanceRecord {
  userName: string;
  userEntity: string;
  fridayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
  saturdayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
  sundayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
  forTrainingName: string;
}
export interface Attendance {
  totalFocus: number;
  totalLingerer: number;
  attendances: AttendanceRecord[];
  initialPx: number;
  totalDistorter: number;
  distortionPercentage: number;
}
export interface GenderByDay {
  day: string;
  male: number;
  female: number;
}
export interface AgeDashboard {
  day: string;
  age_less_18: number;
  age_18_27: number;
  age_28_40: number;
  age_41_65: number;
  age_above_65: number;
}
export interface PaymentStaffDashboard {
  staffName: string;
  saturdayPayments: number;
  accumulatedSaturdayPayments: number;
  passPercentageSaturday: number;

  sundayPayments: number;
  accumulatedSundayPayments: number;
  passPercentageSunday: number;

  previousLifePayments: number;
  previousPaymentsPercentage: number;
}
export interface DashboardYour {
  attendance: Attendance;
  genderByDay: GenderByDay[];
  ageDashboard: AgeDashboard[];
  paymentYourDashboard: PaymentStaffDashboard[];
  totalTrainings: string[];
  lingererStats: LingererStats;
  nextTrainingAttendance: NextTrainingAttendance;
  trainingName: string;
  trainerName: string;
  trainingDate: string;
  courseLevel: string;
  yourRecoveryPaymentStats: YourRecoveryPaymentStats;
  previousTrainingStats: previousTrainingStats;
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
export interface NextTrainingAttendance {
  nextTrainingAttendancePercentage: number;
  nextTrainingAttendanceCount: number;
}
export interface YourRecoveryPaymentStats {
  percentage: number;
  recoveredWithPreviousLifePayment: number;
}
export interface previousTrainingStats {
  attendeesFromPreviousTraining: number;
  attendeesFromPreviousTrainingPercentage: number;
  finalPaymentsFromPreviousTraining: number;
  finalPaymentsFromPreviousTrainingPercentage: number;
  previousLifePayments: number;
}