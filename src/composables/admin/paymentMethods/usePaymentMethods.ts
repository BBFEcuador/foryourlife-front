import { api } from '@/api/axios';
import type { PaymentMethod } from '@/models/Payments';
import { adminStore } from '@/stores/adminStore';
import { useQuery } from '@tanstack/vue-query';
import type { MaybeRef } from 'vue';
import { unref } from 'vue';

const fetchPaymentMethods = async (campusId?: string): Promise<PaymentMethod[]> => {
    const { data } = await api.get('/payment-method', {
        params: {
            campusId: campusId ?? ''
        }
    });
    return data;
};

const usePaymentMethods = (campusId?: MaybeRef<string | undefined>) => {
  const store = adminStore();

  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['admin-payments-methods', campusId],
    queryFn: () => {
      const resolvedCampusId = unref(campusId) ?? store.selectCampusId ?? '';
      return fetchPaymentMethods(resolvedCampusId);
    },
    initialData: [],
    gcTime: 0
  });

  return {
    paymentMethodsData: data,
    isPaymentMethodsError: isError,
    isPaymentMethodsLoading: isFetching,
    refetchPaymentMethods: refetch
  };
};

export default usePaymentMethods;