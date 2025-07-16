import { api } from "@/api/axios";
import type { StoreRequest } from "@/models/CashDrawer";
import { useMutation } from "@tanstack/vue-query";

const saveStore = async (storeReq: StoreRequest): Promise<any> => {
    const { data } = await api.post('/store/add-change', storeReq)
    return data
}

const useStoreMutations = () => {
    const saveStoreMutation = useMutation({
        mutationFn: saveStore
    })
    return {
        saveStoreMutation
    }
}

export default useStoreMutations