import type { Campus } from './Campus';

export interface DashboardFinancial {
  trainingTotalIncome: number;
  pendingPaymentsAmount: number;
  paymentMethodSummary: PaymentMethodSummary[];
  completedPaymentsAmount: number;
  totalCompletedPayments: number;
  totalPendingPayments: number;
  weeklyPaymentStats: WeeklyPaymentStats[];
}

export interface PaymentMethodSummary {
  paymentMethod: PaymentMethod;
  totalAmount: number;
  transactionCount: number;
}

export interface PaymentMethod {
  createdDate: string;
  lastModifiedDate: string;
  createdBy: string;
  lastModifiedBy: string;
  id: string;
  type: string;
  code: string;
  campus: Campus;
  bank: Bank;
  isActive: boolean;
} 

export interface Bank {
  createdDate: string;
  lastModifiedDate: string;
  createdBy: string;
  lastModifiedBy: string;
  id: string;
  name: string;
  number: string;
  contificoId: string;
  campus: Campus;
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