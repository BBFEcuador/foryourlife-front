import { api } from "@/api/axios"
import type { PageableApiResponse } from "@/models/ApiResponse"
import type { Payment } from "@/models/Payments"
import { userStore } from "@/stores/useStore";
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";

const page = ref(0);
const perPage = ref(10);
const store = userStore()

const fetchUserPayments = async (): Promise<PageableApiResponse<Payment[]>> => {
    const { data } = await api.get('/payments/participant/' + store.user.id, {
        params: {
            page: page.value,
            perPage: perPage.value,
        }
    })
    return data
}

const useUserPayments = () => {
    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['user-payments-p', page, perPage],
        queryFn: fetchUserPayments,
        initialData: {
            totalElements: 0,
        } as PageableApiResponse<Payment[]>
    })

    return {
        payments: data,
        page,
        perPage,
        isUserPaymentsError: isError,
        isUserPaymentsLoading: isLoading,
        refetchUserPayments: refetch
    }
}

export default useUserPayments