export interface DashboardOperativeAssistantLife {
    trainingName: string;
    trainerName: string;
    courseLevel: string;
    callsInfoList: CallInfo[];
    weekendReport: WeekendReport;
}[];

export interface CallInfo {
    callType: CallType;
    statuses: CallStatuses[];
    cuadre: number;
    effectivenessPercentage?: number;
    projectedCallsPercentage?: number;
}

export interface CallStatuses {
    totalCalls: string;
    status: CallStatus;
}

export interface WeekendReport {
    initialParticipantsCount: number;
    realParticipantsCount: number;
    participantsDeclarationsCount: number;
    initialMasterLifesCount: number;
    realMasterLifesCount: number;
    masterLifesDeclarationsCount: number;
    initialTotalCount: number;
    realTotalCount: number;
    totalDeclarationsCount: number;
    totalEnrollmentsCount: number;
    declarationIndex: number;
    realIndex: number;
}

export enum CallType {
    LOGISTIC = 'LOGISTIC',
    WELCOME = 'WELCOME',
    FOLLOW_UP = 'FOLLOW_UP',
}

export const CallTypeMeta: Record<
    CallType,
    { label: string; icon: string; color: string }
> = {
    [CallType.LOGISTIC]: {
        label: 'Logística',
        icon: 'mdi-phone-log',
        color: 'primary'
    },
    [CallType.WELCOME]: {
        label: 'Bienvenida',
        icon: 'mdi-handshake',
        color: 'success'
    },
    [CallType.FOLLOW_UP]: {
        label: 'Seguimiento',
        icon: 'mdi-progress-clock',
        color: 'warning'
    }
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

export const CallStatusMeta: Record<
    CallStatus,
    { label: string; icon: string; color: string }
> = {
    [CallStatus.DONE]: {
        label: 'Realizada',
        icon: 'mdi-check-circle-outline',
        color: 'success'
    },
    [CallStatus.NOT_ANSWERED]: {
        label: 'No Contestada',
        icon: 'mdi-close-circle-outline',
        color: 'error'
    },
    [CallStatus.RE_SCHEDULED]: {
        label: 'Re agendada',
        icon: 'mdi-calendar-refresh',
        color: 'warning'
    },
    [CallStatus.NEXT_DATE]: {
        label: 'Próxima fecha',
        icon: 'mdi-calendar-clock',
        color: 'info'
    },
    [CallStatus.NOT_INTERESTED]: {
        label: 'No Interesado',
        icon: 'mdi-account-cancel-outline',
        color: 'error'
    },
    [CallStatus.ANOTHER_CAMPUS]: {
        label: 'Otro campus',
        icon: 'mdi-school',
        color: 'warning'
    },
    [CallStatus.FOR_CONFIRMATION]: {
        label: 'Por confirmar',
        icon: 'mdi-help-circle-outline',
        color: 'info'
    },
    [CallStatus.CONFIRMED]: {
        label: 'Confirmada',
        icon: 'mdi-check-circle-outline',
        color: 'success'
    },
    [CallStatus.NO_CALLED]: {
        label: 'No Llamada',
        icon: 'mdi-close-circle-outline',
        color: 'error'
    }
};


