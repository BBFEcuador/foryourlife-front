import { api } from "@/api/axios"
import { useMutation } from "@tanstack/vue-query"

const syncContificoProducts = async (campusId: string) => {
    const { data } = await api.post('/product/sync', null, {
        params: {
            campusId: campusId
        }
    })
    return data
}

const useContificoProductsMutation = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: syncContificoProducts
    })

    return {
        useContificoSyncProductsMutation: mutate,
        isSyncProductLoading: isPending
    }
}

export default useContificoProductsMutation