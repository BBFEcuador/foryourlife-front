import { api } from "@/api/axios"
import { useQuery } from "@tanstack/vue-query"
import { computed, ref, toValue, type MaybeRef, watch } from "vue"

const fetchPaymentPdf = async (id: string): Promise<Uint8Array> => {
    const { data } = await api.get('/payments/generate-pdf/' + id, { responseType: 'arraybuffer' })
    return new Uint8Array(data)
}

const usePaymentPdf = (id: MaybeRef<any>) => {
    const pdfArray = ref<Uint8Array>()

    const paymentId = computed(() => toValue(id));

    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['paymentPdf'],
        queryFn: () => fetchPaymentPdf(paymentId.value),
        enabled: computed(() => !!paymentId.value)
    });

    watch(data, (newval) => {
        if (newval) pdfArray.value = newval
    })

    return {
        pdfArray,
        isPaymentPdfError: isError,
        isPaymentPdfLoading: isFetching,
        refetchPaymentPdf: refetch
    }
}

export default usePaymentPdf