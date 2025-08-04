import { api } from "@/api/axios"
import type { CashDrawer } from "@/models/CashDrawer"
import { useQuery } from "@tanstack/vue-query"

const fetchCashDrawerById = async (id: string): Promise<CashDrawer> => {
    const { data } = await api.get('/cash-drawer/' + id)
    return data
}

const useCashDrawerById = (id: string) => {
    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['admin-cash-drawer'],
        queryFn: () => fetchCashDrawerById(id),
        initialData: {} as CashDrawer
    })

    return { cashDrawer: data, isCashDrawerError: isError, isCashDrawerLoading: isFetching, refetchCashDrawer: refetch }
}

export default useCashDrawerById