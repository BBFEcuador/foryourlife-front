export interface AttendanceRecord {
  userName: string;
  userEntity: string;
  fridayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
  saturdayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
  sundayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
  forTrainingName: string
}
export interface FocusAttendanceDashboard {
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
  passPercentageFinal: number;
  totalPaymentsFinal: number;
  yourPaymentsFinal: number;
  yourPlusLifePaymentsFinal: number;
  passPercentageSunday: number;
  totalPaymentsSunday: number;
  yourPaymentsSunday: number;
  yourPlusLifePaymentsSunday: number;
}
export interface DashboardFocus {
  focusAttendanceDashboard: FocusAttendanceDashboard;
  genderByDay: GenderByDay[];
  ageDashboard: AgeDashboard[];
  paymentFocusDashboard: PaymentStaffDashboard[];
  totalTrainings: string[];
  lingererStats: LingererStats;
  lifeWeekendAssistants: LifeWeekendAssistants;
  trainingName: string;
  trainerName: string;
  trainingDate: string;
  nextTrainingAttendance: NextTrainingAttendance;
  cityParticipantDashboard: CityParticipantDashboard[];
  courseLevel: string;
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
export interface LifeWeekendAssistantItem {
  assistant: number;
  enrolled: number;
  percentage: number;
}
export interface LifeWeekendAssistants {
  [key: string]: LifeWeekendAssistantItem;
}
export interface NextTrainingAttendance {
  nextTrainingAttendancePercentage: number;
  nextTrainingAttendanceCount: number;
}
export interface CityParticipantDashboard {
  day: string;
  province: number;
  quito: number;
}