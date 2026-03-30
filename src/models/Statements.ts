import { AttendanceStatus } from '@/models/Attendance';
export interface StatementsTraining {
    staffName: string;
    participantName: string;
    statement: Statement;
    yourPaymentStatus: PaymentStatus;
    lifePaymentStatus: PaymentStatus;
    nickname: string;
    enrollmentTeam: string;
    comment: string;
    attendanceStatus: AttendanceStatus;
    enrollerName: string;
}

export interface Statement {
    id: string;
    status: string;
    courseLevel: string;
    comment: string;
}

export enum PaymentStatus {
    FULL_PAYMENT = 'FULL_PAYMENT',
    NOT_PAYMENT = 'NOT_PAYMENT',
    PAYMENT = 'PAYMENT'
}

export interface StatementCommentRequest {
    comment: string;
    status: StatementStatus;
}

export const PaymentStatusMeta: Record<
    PaymentStatus,
    { label: string; icon: string; color: string }
> = {
    [PaymentStatus.FULL_PAYMENT]: {
        label: 'Pendiente',
        icon: 'mdi-clock-outline',
        color: 'info'
    },
    [PaymentStatus.NOT_PAYMENT]: {
        label: 'No Pago',
        icon: 'mdi-close-circle-outline',
        color: 'error'
    },
    [PaymentStatus.PAYMENT]: {
        label: 'Pago Completo',
        icon: 'mdi-check-circle-outline',
        color: 'success'
    }
};

export enum StatementStatus {
    NO_INTERESTED = 'NO_INTERESTED',    
    EMPTY = 'EMPTY',
    CONFIRMED = 'CONFIRMED',
    POSSIBILITY = 'POSSIBILITY',
    AGREEMENT = 'AGREEMENT'
}

export const StatementStatusMeta: Record<
    StatementStatus,
    { label: string; icon: string; color: string }
> = {
    [StatementStatus.NO_INTERESTED]: {
        label: 'No Interesado',
        icon: 'mdi-account-cancel-outline',
        color: 'warning'
    },
    [StatementStatus.EMPTY]: {
        label: 'Vacío',
        icon: 'mdi-alert-circle-outline',
        color: 'error'
    },
    [StatementStatus.CONFIRMED]: {
        label: 'Confirmado',
        icon: 'mdi-check-circle-outline',
        color: 'success'
    },
    [StatementStatus.POSSIBILITY]: {
        label: 'Posibilidad',
        icon: 'mdi-lightbulb-outline',
        color: 'info'
    },
    [StatementStatus.AGREEMENT]: {
        label: 'Acuerdo',
        icon: 'mdi-handshake-outline',
        color: 'primary'
    }
};

export const AttendanceStatusMeta: Record<
    AttendanceStatus,
    { label: string; icon: string; color: string }
> = {
    [AttendanceStatus.ASISTIO]: {
        label: 'Asistió',   
        icon: 'mdi-check-circle-outline',
        color: 'success'
    },
    [AttendanceStatus.NO_ASISTIO]: {
        label: 'No Asistió',
        icon: 'mdi-close-circle-outline',
        color: 'error'
    },
    [AttendanceStatus.DESERTO]: {
        label: 'Desertó',
        icon: 'mdi-account-cancel-outline',
        color: 'warning'
    }
};