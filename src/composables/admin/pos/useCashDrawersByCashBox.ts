import { api } from "@/api/axios";
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { CashDrawer } from "@/models/CashDrawer";
import { useQuery } from "@tanstack/vue-query";
import { ref } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchCashDrawersByCashBox = async (cashBoxId: string): Promise<PageableApiResponse<CashDrawer[]>> => {
    const { data } = await api.get(`/cash-drawer/cash-box/${cashBoxId}`, {
        params: {
            page: page.value,
            perPage: perPage.value,
            search: search.value
        }
    });
    return data;
}

const useCashDrawersByCashBox = (id: string) => {
    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['cash-drawers-cb', id, page, perPage, search],
        queryFn: () => fetchCashDrawersByCashBox(id),
        initialData: { numberOfElements: 0 } as PageableApiResponse<CashDrawer[]>,
        retry: false
    })

    return {
        cashDrawers: data,
        isCashDrawersError: isError,
        isCashDrawerLoading: isFetching,
        refetchCashDrawer: refetch,
        page,
        perPage,
        search
    }
}

export default useCashDrawersByCashBox