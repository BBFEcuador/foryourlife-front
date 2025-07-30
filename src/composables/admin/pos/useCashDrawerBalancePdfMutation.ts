import { api } from "@/api/axios"
import { useQuery } from "@tanstack/vue-query"
import { computed, ref, toValue, type MaybeRef, watch } from "vue"

const fetchBalancePdf = async (id: string): Promise<Uint8Array> => {
    const { data } = await api.post('/cash-drawer/generate-report', null, {
        responseType: 'arraybuffer',
        params: {
            id: id
        }
    })
    return new Uint8Array(data)
}

const useCashDrawerBalancePdfMutationPdf = (id: MaybeRef<any>) => {
    const cashDrawerId = computed(() => toValue(id));

    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['balance-pdf'],
        queryFn: () => fetchBalancePdf(cashDrawerId.value),
        enabled: computed(() => !!cashDrawerId.value)
    });

    return {
        pdfArray: data,
        isPaymentPdfError: isError,
        isPaymentPdfLoading: isFetching,
        refetchPaymentPdf: refetch
    }
}

export default useCashDrawerBalancePdfMutationPdf