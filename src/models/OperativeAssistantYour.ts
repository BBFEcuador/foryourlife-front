export interface DashboardOperativeAssistantYour {
    trainingName: string;
    trainerName: string;
    captainCount: number;
    courseLevel: string;
    staffCount: number;
    attendance: Attendance;
    operativeYourPayments: OperativeYourPayments;
}

export interface OperativeYourPayments {
    previousPayments: number;
    saturdayPayments: number;
    sundayPayments: number;
    totalPayments: number;
    totalPaymentsPercentage: number;
    previousPaymentsPercentage: number;
    saturdayPaymentsPercentage: number;
    sundayPaymentsPercentage: number;
    weeklyPaymentStats: WeeklyPaymentStats[];
}

export interface AttendanceRecord {
    userName: string;
    userEntity: string;
    forTrainingName: string;
    fridayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
    saturdayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
    sundayAttendance: 'ASISTIO' | 'NO_ASISTIO' | null;
}

export interface WeeklyPaymentStats {
    weekNumber: number;
    weeklyPayments: {
        [key in DayOfWeek]: DailyPaymentStats;
    };
}

export interface DailyPaymentStats {
    finalPaymentsCount: number;
    agreedPaymentsCount: number;
    totalPaymentsCount: number;
    passPaymentsPercentage: number;
    projectedPaymentsPercentage: number;
}

export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
}

export const DayOfWeekLabels = {
    [DayOfWeek.MONDAY]: 'Lunes',
    [DayOfWeek.TUESDAY]: 'Martes',
    [DayOfWeek.WEDNESDAY]: 'Miércoles',
    [DayOfWeek.THURSDAY]: 'Jueves',
    [DayOfWeek.FRIDAY]: 'Viernes',
    [DayOfWeek.SATURDAY]: 'Sábado',
    [DayOfWeek.SUNDAY]: 'Domingo'
};

export interface Attendance {
    initialPx: number;
    totalFocus: number;
    totalLingerer: number;
    totalDistorter: number;
    distortionPercentage: number;
    attendances: AttendanceRecord[];
}




