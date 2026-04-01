export interface DashboardOperativeAssistantFocus {
    trainingName: string;
    trainerName: string;
    courseLevel: string;
    weekendFocusReport: WeekendFocusReport;
    operativeFocusPayments: OperativeFocusPayments;
}

export interface WeekendFocusReport {
    initialParticipantsCount: number;
    realParticipantsCount: number;
    deserterParticipantsCount: number;
    declarationsCount: number;
    visionariesCount: number;
    captainsCount: number;
    staffsCount: number;
}

export interface OperativeFocusPayments {
    yourPaymentsCount: number;
    yourPlusLifePaymentsCount: number;
    totalPaymentsCount: number;
    pendingPaymentsCount: number;
    possibilityPaymentsCount: number;
    focusWeeklyPaymentStats: FocusWeeklyPaymentStats[];
}

export interface FocusWeeklyPaymentStats {
    weekNumber: number;
    focusWeeklyPayments: {
        [key in DayOfWeek]: DailyPaymentStats;
    };
}

export interface DailyPaymentStats {
    yourPaymentsCount: number;
    yourPlusLifePaymentsCount: number;
    totalPaymentsCount: number;
    pendingPaymentsCount: number;
    agreedPaymentsCount: number;
    possiblePaymentsCount: number;
    notInterestPaymentsCount: number;
    passPercentage: number;
    projectedPercentage: number;
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

