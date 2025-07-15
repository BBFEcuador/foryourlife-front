import { api } from "@/api/axios"
import { useMutation } from "@tanstack/vue-query"

const syncContificoBankAccounts = async (campusId: string) => {
    const { data } = await api.post('/bank/sync', null, {
        params: {
            campusId: campusId
        }
    })
    return data
}

const useContificoBankAccountsMutation = () => {
    const useContificoSyncBankAccountsMutation = useMutation({
        mutationFn: syncContificoBankAccounts
    })

    return {
        useContificoSyncBankAccountsMutation
    }
}

export default useContificoBankAccountsMutation