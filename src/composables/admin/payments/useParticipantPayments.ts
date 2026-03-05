import { api } from '@/api/axios';
import type { Payment } from '@/models/Payments';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, toValue, watch, type MaybeRef } from 'vue';

const payment = ref<Payment>({} as Payment)

const fetchPayment = async (participantId: string): Promise<Payment[]> => {
  const { data } = await api.get('/payments/participant-all/' + participantId);
  return data;
};

const useParticipantPaymentMutations = (id: MaybeRef<string>) => {
  const participantId = computed(() => toValue(id));

  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['payment-participant', participantId],
    queryFn: () => fetchPayment(participantId.value),
    enabled: computed(() => !!participantId.value),
  });

  const payments = computed(() => data.value || []);

  return {
    payments,
    isPaymentError: isError,
    isPaymentLoading: isFetching,
    refetchPayment: refetch,
  };
};

export default useParticipantPaymentMutations;