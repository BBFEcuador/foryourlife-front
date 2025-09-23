import type { Participant } from './Participants';
import type { TrainingData } from './Training';

export interface Attendance {
  id: string;
  fridayAttendance: AttendanceStatus;
  saturdayAttendance: AttendanceStatus;
  sundayAttendance: AttendanceStatus;
  stage: string;
  participant: Participant;
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
