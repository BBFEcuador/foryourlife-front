import type { User } from '@/models/User';
import type { TrainingData } from '@/models/Training';

export interface CallLog {
    createdDate: string;
    lastModifiedDate: string;
    createdBy: string;
    lastModifiedBy: string;
    id: string;
    calledBy: User;
    date: string;
    type: string;
    status: string;
    notes: string;
}

export interface CallTraining {
    id: string;
    calledUser: User;
    callLogs: CallLog[];
    training: TrainingData;
}

export interface CallsLogRequest {
    callType: CallType;
    callStatus: CallStatus;
    notes: string;
    calledById: string;
    date: string;
    callId: string;
}

export enum CallType {
    WELCOME = 'WELCOME',
    LOGISTIC = 'LOGISTIC',
}

export const CallTypeLabels = {
    [CallType.WELCOME]: 'Bienvenida',
    [CallType.LOGISTIC]: 'Logística'
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
};