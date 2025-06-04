import type { PaymentRequest, PaymentHistoryRequest } from "@/models/Payments";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";
import { toast } from "vue3-toastify";
import { router } from "@/router";

const savePayment = async (payment: PaymentRequest): Promise<any> => {
    const { data } = await api.post('/payments', payment);
    return data;
}

const savePaymentRecord = async (paymentRecord: PaymentHistoryRequest): Promise<any> => {
    const { data } = await api.put('/payments/add/payment-history/' + paymentRecord.paymentId, paymentRecord);
    return data;
}

const usePaymentMutations = () => {
    const savePaymentMutations = useMutation({
        mutationFn: savePayment
    });
    return {
        savePaymentMutations,
    };
};
export const usePaymentRecordMutations = () => {
    const savePaymentRecordMutations = useMutation({
        mutationFn: savePaymentRecord
    });
    return {
        savePaymentRecordMutations,
    };
};

export default usePaymentMutations;