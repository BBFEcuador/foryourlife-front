import { api } from '@/api/axios';
import type { CashBox } from '@/models/CashDrawer';
import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue'

const fetchCashBoxes = async (storeId: string): Promise<CashBox[]> => {
    const { data } = await api.get(`/cash-box/store/${storeId}`);
    return data;
}

const useCashBoxes = (storeId: Ref<string>) => {
    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['cash-drawers', storeId],
        queryFn: () => fetchCashBoxes(storeId.value),
        initialData: [] as CashBox[],
        enabled: !!storeId.value,
        retry: false
    });

    return {
        cashBoxes: data,
        isCashBoxesError: isError,
        isCashBoxesLoading: isFetching,
        refetchCashBoxes: refetch,
    };
};

export default useCashBoxes



// import { api } from '@/api/axios';
// import type { CashBox } from '@/models/CashDrawer';
// import { adminStore } from '@/stores/adminStore';
// import { useQuery } from '@tanstack/vue-query';

// const fetchCashBoxes = async (): Promise<CashBox[]> => {
//     const { data } = await api.get('/cash-box', {
//         params: {
//             campusId: adminStore().selectCampusId
//         }
//     })
//     return data;
// }

// const useCashBoxes = () => {
//     const { data, isError, isFetching, refetch } = useQuery({
//         queryKey: ['cash-drawers'],
//         queryFn: fetchCashBoxes,
//         initialData: [] as CashBox[],
//         enabled: adminStore().isCampusSelected,
//         retry: false
//     });

//     return {
//         cashBoxes: data,
//         isCashBoxesError: isError,
//         isCashBoxesLoading: isFetching,
//         refetchCashBoxes: refetch,
//     };
// };

// export default useCashBoxes
