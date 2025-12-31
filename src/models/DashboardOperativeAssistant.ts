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
        callType: CallType;
        cuadre?: number;
        effectivenessPercentage?: number;
        projectedCallsPercentage?: number;
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

    finalPayments?: number;
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
    NEXT_DATE = 'NEXT_DATE',
    NOT_INTERESTED = 'NOT_INTERESTED',
    ANOTHER_CAMPUS = 'ANOTHER_CAMPUS',
    FOR_CONFIRMATION = 'FOR_CONFIRMATION',
    CONFIRMED = 'CONFIRMED',
    NO_CALLED = 'NO_CALLED',
}

export enum CallType {
    LOGISTIC = 'LOGISTIC',
    WELCOME = 'WELCOME',
    FOLLOW_UP = 'FOLLOW_UP',
}

export const CallStatusLabels = {
    [CallStatus.DONE]: 'Realizada',
    [CallStatus.NOT_ANSWERED]: 'No contesta',
    [CallStatus.RE_SCHEDULED]: 'Reprogramada',
    [CallStatus.NEXT_DATE]: 'Próxima fecha',
    [CallStatus.NOT_INTERESTED]: 'No interesa',
    [CallStatus.ANOTHER_CAMPUS]: 'Otra sede',
    [CallStatus.FOR_CONFIRMATION]: 'Por confirmar',
    [CallStatus.CONFIRMED]: 'Confirmada',
    [CallStatus.NO_CALLED]: 'Sin llamar',
};

export const CallTypeLabels = {
    [CallType.LOGISTIC]: 'Logística',
    [CallType.WELCOME]: 'Bienvenida',
};

