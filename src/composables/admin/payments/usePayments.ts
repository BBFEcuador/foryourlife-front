import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Payment } from '@/models/Payments';
import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchProducts = async (): Promise<PageableApiResponse<Payment[]>> => {
    const { data } = await api.get('/payments', {
        params: {
            page: page.value,
            perPage: perPage.value,
            search: search.value || undefined
        }
    });
    return data;
};

const usePayments = () => {
    const {
        data,
        isError,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ['admin-payments-p', page, perPage, search],
        queryFn: fetchProducts,
        initialData: {
            totalElements: 0,
        } as PageableApiResponse<Payment[]>
    });
    return {
        paymentsData: data,
        page,
        perPage,
        search,
        isPaymentsError: isError,
        isPaymentsLoading: isFetching,
        refetchPayments: refetch,
    };
};

export default usePayments;