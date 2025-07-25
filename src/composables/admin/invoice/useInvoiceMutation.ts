import { api } from "@/api/axios"
import type { EditInvoiceReq } from "@/models/Invoice"
import { adminStore } from "@/stores/adminStore"
import { useMutation } from "@tanstack/vue-query"

const updateInvoice = async (invoiceReq: EditInvoiceReq) => {
    const { data } = await api.put('/invoices', invoiceReq)
    return data
}

const sendInvoicesToContifico = async () => {
    const { data } = await api.post('/invoices/send', null, {
        params: {
            campusId: adminStore().selectCampusId
        }
    })
    return data
}

const useInvoiceMutations = () => {
    const updateInvoiceMutation = useMutation({
        mutationFn: updateInvoice
    })

    const sendInvoicesToContificoMutation = useMutation({
        mutationFn: sendInvoicesToContifico
    })

    return { updateInvoiceMutation, sendInvoicesToContificoMutation }
}

export default useInvoiceMutations