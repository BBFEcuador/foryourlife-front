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
}

export const CallStatusLabels = {
  [CallStatus.DONE]: 'Realizada',
  [CallStatus.NOT_ANSWERED]: 'No contestada',
  [CallStatus.RE_SCHEDULED]: 'Reprogramada'
};