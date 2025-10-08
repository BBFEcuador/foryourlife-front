import { api } from '@/api/axios';
import type { Payment } from '@/models/Payments';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, toValue, watch, type MaybeRef } from 'vue';

const payment = ref<Payment>({} as Payment)

const fetchPayment = async (paymentId: string): Promise<Payment> => {
  const { data } = await api.get('/payments/' + paymentId);
  return data;
};

const usePayment = (id: MaybeRef<string>) => {
  const paymentId = computed(() => toValue(id));

  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['payment', paymentId.value],
    queryFn: () => fetchPayment(paymentId.value),
    enabled: computed(() => !!paymentId.value),
  });

  watch(data, (newVal) => {
    if (newVal) {
      payment.value = JSON.parse(JSON.stringify(newVal));
    }
  });

  return {
    payment,
    isPaymentError: isError,
    isPaymentLoading: isFetching,
    refetchPayment: refetch,
  };
};

export default usePayment;