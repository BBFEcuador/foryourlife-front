import { api } from '@/api/axios';
import type { PaymentMethod } from '@/models/Payments';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, toValue, watch, type MaybeRef } from 'vue';

const paymentMethod = ref<PaymentMethod>({} as PaymentMethod)

const fetchPaymentMethod = async (id: string): Promise<PaymentMethod> => {
    const { data } = await api.get('/payment-method/' + id);
    return data;
};

const usePaymentMethod = (id: MaybeRef<string>) => {
    const paymentMethodId = computed(() => toValue(id))

    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['payment-method', paymentMethodId.value],
        queryFn: () => fetchPaymentMethod(paymentMethodId.value)
    });

    watch(data, (newVal) => {
        if (newVal) {
            paymentMethod.value = JSON.parse(JSON.stringify(newVal));
        }
    });
    return {
        paymentMethod,
        isPaymentMethodError: isError,
        isPaymentMethodLoading: isFetching,
        refetchPaymentMethods: refetch
    };
};

export default usePaymentMethod;