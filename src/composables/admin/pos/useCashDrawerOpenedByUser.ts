import { api } from "@/api/axios"
import type { CashDrawer } from "@/models/CashDrawer"
import { useQuery } from "@tanstack/vue-query"

const fetchCashDrawerOpenedByUser = async (idUser: string): Promise<CashDrawer> => {
    const { data } = await api.get('/cash-drawer/opened-user/' + idUser, {
        params: {
            userId : idUser
        }
    });
    return data;
}

const useCashDrawerOpenedByUser = (idUser: string) => {
    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['admin-cash-drawer'],
        queryFn: () => fetchCashDrawerOpenedByUser(idUser),
        initialData: {} as CashDrawer
    });

    return { cashDrawer: data, isCashDrawerError: isError, isCashDrawerOpenedByUserLoading: isFetching, refetchCashDrawerOpenedByUser: refetch }
}

export default useCashDrawerOpenedByUser