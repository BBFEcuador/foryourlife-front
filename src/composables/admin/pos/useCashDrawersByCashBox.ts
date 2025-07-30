import { api } from "@/api/axios";
import type { CashDrawer } from "@/models/CashDrawer";
import { useQuery } from "@tanstack/vue-query";

const fetchCashDrawersByCashBox = async (cashBoxId: string): Promise<CashDrawer[]> => {
    const { data } = await api.get(`/cash-drawer/cash-box/${cashBoxId}`);
    return data;
}

const useCashDrawersByCashBox = (id: string) => {
    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['cash-drawers-cb', id],
        queryFn: () => fetchCashDrawersByCashBox(id),
        initialData: [] as CashDrawer[],
        retry: false
    })

    return {
        cashDrawers: data,
        isCashDrawersError: isError,
        isCashDrawerLoading: isLoading,
        refetchCashDrawer: refetch
    }
}

export default useCashDrawersByCashBox