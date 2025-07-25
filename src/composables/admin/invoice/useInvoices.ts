import { api } from "@/api/axios";
import type { PageableApiResponse } from "@/models/ApiResponse";
import type { Invoice } from "@/models/Invoice";
import { adminStore } from "@/stores/adminStore";
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";

const page = ref(0)
const perPage = ref(10)
const search = ref('')

const fetchInvoices = async (): Promise<PageableApiResponse<Invoice[]>> => {
    const { data } = await api.get('/invoices', {
        params: {
            page: page.value,
            perPage: perPage.value,
            search: search.value,
            campusId: adminStore().selectCampusId
        }
    })
    return data
}

const useInvoices = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin-invoices', page, perPage, search],
        queryFn: fetchInvoices,
        initialData: {
            numberOfElements: 0,
            content: [] as Invoice[]
        } as PageableApiResponse<Invoice[]>
    })

    return {
        invoicesData: data,
        isLoading,
        isError,
        refetch,
        page, perPage, search
    }
}

export default useInvoices