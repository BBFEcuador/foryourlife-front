import { api } from '@/api/axios';
import type { CashBox } from '@/models/CashDrawer';
import { useQuery } from '@tanstack/vue-query';

const fetchCashBoxes = async (): Promise<CashBox[]> => {
    const { data } = await api.get('/cash-box/available')
    return data;
}

const useCashBoxes = () => {
    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['cash-drawers'],
        queryFn: fetchCashBoxes,
        initialData: [] as CashBox[],
    });

    return {
        cashBoxes: data,
        isCashBoxesError: isError,
        isCashBoxesLoading: isFetching,
        refetchCashBoxes: refetch,
    };
};

export default useCashBoxes
