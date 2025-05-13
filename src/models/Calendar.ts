import type { TrainingData } from "./Training";

export interface Calendar {
    id: string;
    title: string;
    start: string | Date;
    end: string | Date;
    allDay: boolean;
    color?: string;
    embedded:TrainingData
    extendedProps?: {
        description?: string;
        location?: string;
        guests?: string[];
    };
}