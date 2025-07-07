import { api } from '@/api/axios';
import type { PaymentMethod } from '@/models/Payments';
import { adminStore } from '@/stores/adminStore';
import { useQuery } from '@tanstack/vue-query';

const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
    const { data } = await api.get('/payment-method',{
        params:{
            campusId: adminStore().selectCampusId
        }
    });
    return data;
};

const usePaymentMethods = () => {
    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['admin-payments-methods'],
        queryFn: fetchPaymentMethods,
        initialData: []
    });
    
    return {
        paymentMethodsData: data,
        isPaymentMethodsError: isError,
        isPaymentMethodsLoading: isFetching,
        refetchPaymentMethods: refetch
    };
};

export default usePaymentMethods;