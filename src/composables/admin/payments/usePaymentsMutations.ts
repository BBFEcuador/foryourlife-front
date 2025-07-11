import type { PaymentRequest } from "@/models/Payments";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const savePayment = async (payment: PaymentRequest): Promise<Uint8Array> => {
    const { data } = await api.post('/payments', payment, {
        responseType: "arraybuffer"
    });
    return new Uint8Array(data);
}

const usePaymentMutations = () => {
    const savePaymentMutations = useMutation({
        mutationFn: savePayment
    });
    return {
        savePaymentMutations,
    };
};

export default usePaymentMutations;