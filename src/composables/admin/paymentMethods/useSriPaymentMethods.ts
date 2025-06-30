import { api } from '@/api/axios';
import type { SriPaymentMethod } from '@/models/Payments';
import { useQuery } from '@tanstack/vue-query';

const fetchSriPaymentMethods = async (): Promise<SriPaymentMethod[]> => {
    const { data } = await api.get('/sri-payment-method');
    return data;
};

const useSriPaymentMethods = () => {
    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['admin-sri-payments-methods'],
        queryFn: fetchSriPaymentMethods,
        initialData: []
    });
    
    return {
        sriPaymentMethodsData: data,
        isSriPaymentMethodsError: isError,
        isSriPaymentMethodsLoading: isFetching,
        refetchSriPaymentMethods: refetch
    };
};

export default useSriPaymentMethods;