import { api } from "@/api/axios"
import { adminStore } from "@/stores/adminStore"
import { useMutation } from "@tanstack/vue-query"

const store = adminStore()

const fetchContificoPos = async () => {
    const { data } = await api.post('/store', null, {
        params: {
            campusId: store.selectCampusId
        }
    })
    return data
}

const useContificoPosMutation = () => {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: fetchContificoPos
    })

    return {
        useContificoSyncPosMutations: mutateAsync,
        isSyncPosLoading: isPending
    }
}

export default useContificoPosMutation