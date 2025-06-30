import type { PaymentMethodRequest } from "@/models/Payments";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const savePaymentMethod = async (paymentMethod: PaymentMethodRequest): Promise<any> => {
    const { data } = await api.post('/payment-method', paymentMethod);
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

const usePaymentMethodMutations = () => {
    const savePaymentMethodMutation = useMutation({
        mutationFn: savePaymentMethod
    });
    const changePaymentMethodStatusMutation = useMutation({
        mutationFn: changeStatus
    });
    return {
        savePaymentMethodMutation,
        changePaymentMethodStatusMutation
    };
};

export default usePaymentMethodMutations