import { api } from "@/api/axios"
import type { BankAccount } from "@/models/Payments"
import { adminStore } from "@/stores/adminStore"
import { useQuery } from "@tanstack/vue-query"

const store = adminStore()

const fetchBankAccounts = async (): Promise<BankAccount[]> => {
    const url = store.isCampusSelected ? `/bank/${store.selectCampusId}` : '/bank'

    const { data } = await api.get(url)

    return data
}

const useBankAccounts = () => {
    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['a-bank-accounts'],
        queryFn: fetchBankAccounts,
        initialData: []
    })

    return {
        bankAccounts: data,
        isBankAccountsErrors: isError,
        isBankAccountsLoading: isLoading,
        refetchBankAccounts: refetch
    }
}

export default useBankAccounts