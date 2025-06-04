import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Payment, PaymentMethod } from '@/models/Payments';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, toValue, watch, type ComputedRef, type MaybeRef } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');
const dataTotal = ref<PageableApiResponse<Payment[]>>({
  content: [] as Payment[],
  totalElements: 0,
} as PageableApiResponse<Payment[]>)

const payment = ref<Payment>({} as Payment)

const fetchPayments = async (): Promise<PageableApiResponse<Payment[]>> => {
  const { data } = await api.get('/payments', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value || undefined
    }
  });
  return data;
};
const fetchPayment = async (paymentId: string): Promise<Payment> => {
  const { data } = await api.get('/payments/' + paymentId);
  return data;
};

const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const { data } = await api.get('/payment-method');
  return data;
};

const usePayments = () => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['admin-payments-p', page, perPage, search],
    queryFn: fetchPayments,
    initialData: {
      totalElements: 0,
      content: [] as Payment[]
    } as PageableApiResponse<Payment[]>
  });
  watch(data, () => {
    if (data.value) {
      dataTotal.value = JSON.parse(JSON.stringify(data.value));
    }
  });
  return {
    paymentsData: dataTotal,
    page,
    perPage,
    search,
    isPaymentsError: isError,
    isPaymentsLoading: isFetching,
    refetchPayments: refetch
  };
};

export default usePayments;


export const usePaymentMethods = () => {
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

export const usePayment = (id: MaybeRef<string>) => {
  const paymentId = computed(() => toValue(id));

  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['payment', paymentId.value],
    queryFn: () => fetchPayment(paymentId.value),
    enabled: computed(() => !!paymentId.value), // solo activa si hay id válido
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