import type { PaymentHistoryRequest } from "@/models/Payments";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const savePaymentRecord = async (paymentRecord: PaymentHistoryRequest): Promise<any> => {
    const { data } = await api.put('/payments/add/payment-history/' + paymentRecord.paymentId, paymentRecord);
    return data;
}

const changeStatus = async (item: {
    id: string;
    isActive: boolean;
}): Promise<any> => {
    const { data } = await api.patch('/product/change-status/' + item.id
    );
    return data;
};

const usePaymentRecordMutations = () => {
    const savePaymentRecordMutations = useMutation({
        mutationFn: savePaymentRecord
    });
    return {
        savePaymentRecordMutations,
    };
};

export default usePaymentRecordMutations