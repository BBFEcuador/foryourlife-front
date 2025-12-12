export interface DashboardOperativeAssistant {
  trainingInfo: TrainingInfo[];
}

export interface TrainingInfo {
    courseLevel: string;
    trainerName: string;
    teamName: string;
    teamNumber: string;
    totalParticipants: number;
    totalParticipantAssistants: number;
    totalParticipantsDeclarations: number;
    totalMasterLifes: number;
    totalMasterLifesAssistants: number;
    totalMasterLifesDeclarations: number;
    totalEnrolments: number;
    totalEnrolmentsAssistants: number;
    totalEnrolmentsDeclarations: number;
    callsInfoList: {
        totalCalls: number;
        status: CallStatus;
    }[];
    weeklyPaymentStatsList: WeeklyPaymentStats[];
}

export interface WeeklyPaymentStats {
    weekNumber: number;
    statsPerDay: {
        [key in DayOfWeek]: DailyPaymentStats;
    };
}

export interface DailyPaymentStats {
    participantsFinal: number;
    yourCount: number;
    yourLifeCount: number;
    totalPayments: number;
    partialPayments: number;
    passPercent: number;
    projectedPercent: number;
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

export enum CallStatus {
    DONE = 'DONE',
    NOT_ANSWERED = 'NOT_ANSWERED',
    RE_SCHEDULED = 'RE_SCHEDULED',
}

export enum CallType {
    LOGISTIC = 'LOGISTIC',
    WELCOME = 'WELCOME',
    FOLLOW_UP = 'FOLLOW_UP',
}

export const CallStatusLabels = {
    [CallStatus.DONE]: 'Realizada',
    [CallStatus.NOT_ANSWERED]: 'No contestada',
    [CallStatus.RE_SCHEDULED]: 'Reprogramada'
};

export const CallTypeLabels = {
    [CallType.LOGISTIC]: 'Logística',
    [CallType.WELCOME]: 'Bienvenida',
};

