import type { Participant } from './Participants';
import type { TrainingData } from './Training';
import type { User } from './User';

export interface Attendance {
  id: string;
  fridayAttendance: AttendanceStatus;
  saturdayAttendance: AttendanceStatus;
  sundayAttendance: AttendanceStatus;
  stage: string;
  user: User;
  training: TrainingData;
  isActive: boolean;
}

export interface UpdateDayAttendanceRequest {
  id: string;
  attendanceStatus: AttendanceStatus;
  day: DaysEnum;
}

export enum AttendanceStatus {
  ASISTIO = 'ASISTIO',
  NO_ASISTIO = 'NO_ASISTIO',
  DESERTO = 'DESERTO'
}

export enum DaysEnum {
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}
