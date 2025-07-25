import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Payment } from '@/models/Payments';
import { adminStore } from '@/stores/adminStore';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');
const dataTotal = ref<PageableApiResponse<Payment[]>>({
  content: [] as Payment[],
  numberOfElements: 0,
} as PageableApiResponse<Payment[]>)

const fetchPayments = async (): Promise<PageableApiResponse<Payment[]>> => {
  const { data } = await api.get('/payments', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value,
      campusId: adminStore().selectCampusId
    }
  });
  return data;
};

const usePayments = () => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['admin-payments-p', page, perPage, search],
    queryFn: fetchPayments,
    initialData: {
      numberOfElements: 0,
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
