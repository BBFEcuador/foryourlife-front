import type { T } from 'node_modules/@fullcalendar/core/internal-common';
import { Participant } from './Participants';
import type { TrainingData } from './Training';
export interface Promises {
    id: string;
    firstPromise: string;
    secondPromise: string;
    thirdPromise: string;
    achievedCount: number;
    paidCount: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    participant: Participant;
    training: TrainingData;
}