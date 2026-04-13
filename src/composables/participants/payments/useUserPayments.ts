// import { api } from "@/api/axios"
import { userApi } from '@/api/userAxios';
import type { PageableApiResponse } from "@/models/ApiResponse"
import type { Payment } from "@/models/Payments"
import { userStore } from "@/stores/useStore";
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";
import { id } from "vuetify/locale";

const page = ref(0);
const perPage = ref(10);
const store = userStore()

const fetchUserPayments = async (): Promise<PageableApiResponse<Payment[]>> => {
    const { data } = await userApi.get('/payments/participant/' + store.user.id, {
        params: {
            page: page.value,
            perPage: perPage.value,
        }
    })
    return data
}

const useUserPayments = () => {
    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['user-payments-p', page, perPage],
        queryFn: fetchUserPayments,
        initialData: {
            numberOfElements: 0,
        } as PageableApiResponse<Payment[]>
    })

    return {
        payments: data,
        page,
        perPage,
        isUserPaymentsError: isError,
        isUserPaymentsLoading: isFetching,
        refetchUserPayments: refetch
    }
}

export default useUserPayments