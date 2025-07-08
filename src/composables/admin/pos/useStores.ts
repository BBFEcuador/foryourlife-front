import { api } from "@/api/axios"
import type { Store } from "@/models/CashDrawer"
import { adminStore } from "@/stores/adminStore"
import { useQuery } from "@tanstack/vue-query"
import { computed } from "vue"

const store = adminStore()

const fetchStores = async (): Promise<Store[]> => {
    const { data } = await api.get('/store/campus/' + store.selectCampusId)
    return data
}

const useStores = () => {
    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ['admin-stores-c'],
        queryFn: fetchStores,
        initialData: [],
        enabled: store.isCampusSelected
    })

    return {
        storesData: data,
        isStoresDataLoading: isFetching,
        isStoresError: isError,
        refetchStoresData: refetch
    }
}

export default useStores