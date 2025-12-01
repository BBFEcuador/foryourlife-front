export interface AttendanceRecord {
  userName: string;
  userEntity: string;
  fridayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
  saturdayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
  sundayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
}
export interface Attendance {
  totalFocus: number;
  totalLingerer: number;
  attendances: AttendanceRecord[];
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
  completedPaymentCount: number;
  partialPaymentCount: number;
  totalPayments: number;
  yourPartialPaymentsCount: number;
  yourCompletedPaymentsCount: number;
  lifePartialPaymentsCount: number;
  lifeCompletedPaymentsCount: number;
}  
export interface DashboardYour {
  attendance: Attendance;
  genderByDay: GenderByDay[];
  ageDashboard: AgeDashboard[];
  paymentDashboard: PaymentStaffDashboard[];
}
