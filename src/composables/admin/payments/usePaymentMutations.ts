import type { PaymentHistoryRequest } from "@/models/Payments";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const savePaymentRecord = async (paymentRecord: PaymentHistoryRequest): Promise<any> => {
    const { data } = await api.put('/payments/add/payment-history/' + paymentRecord.paymentId, paymentRecord);
    return data;
}

const changeStatus = async (item: {
    id: string;
    newStatus: string;
}): Promise<any> => {
    const { data } = await api.patch('/payments/change-status/' + item.id, null, {
        params: {
            status: item.newStatus
        }
    }
    );
    return data;
};

const usePaymentRecordMutations = () => {
    const savePaymentRecordMutations = useMutation({
        mutationFn: savePaymentRecord
    });
    const cancelPaymentMutation = useMutation({
        mutationFn: changeStatus
    });
    return {
        savePaymentRecordMutations,
        cancelPaymentMutation
    };
};

export default usePaymentRecordMutations