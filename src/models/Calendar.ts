export interface Calendar {
    id: number;
    title: string;
    start: string | Date;
    end: string | Date;
    allDay: boolean;
    color?: string;
    extendedProps?: {
        description?: string;
        location?: string;
        guests?: string[];
    };
}