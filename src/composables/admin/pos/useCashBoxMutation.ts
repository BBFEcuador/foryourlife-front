import type { CashBoxRequest } from "@/models/CashDrawer";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const saveCashBox = async (cashDrawer: CashBoxRequest): Promise<any> => {
    const { data } = await api.post('/cash-box', cashDrawer)
    return data;
}

const useCashBoxMutation = () => {
    const saveCashBoxMutation = useMutation({
        mutationFn: saveCashBox
    })
    return { saveCashBoxMutation }
}

export default useCashBoxMutation;