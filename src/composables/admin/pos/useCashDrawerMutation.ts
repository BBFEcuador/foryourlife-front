import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const openCashDrawer = async (idsReq: {
    cashBoxId: string;
    userId: string;
    openingBalance: number;
    detail: string;
}): Promise<any> => {
    const { data } = await api.put('/cash-drawer/open/' + idsReq.cashBoxId, null, {
        params: {
            userId: idsReq.userId,
            openingBalance: idsReq.openingBalance,
            detail: idsReq.detail
        }
    })
    return data
}
const closeCashDrawer = async (idsReq: {
    cashDrawerId: string;
    userId: string;
}): Promise<Uint8Array> => {
    const { data } = await api.put('/cash-drawer/close/' + idsReq.cashDrawerId, null, {
        params: {
            userId: idsReq.userId
        },
        responseType: 'arraybuffer'
    })
    return data
}

const useCashDrawerMutation = () => {
    const openCashDrawerMutation = useMutation({
        mutationFn: openCashDrawer
    })
    const closeCashDrawerMutation = useMutation({
        mutationFn: closeCashDrawer
    })
    return { openCashDrawerMutation, closeCashDrawerMutation }
}

export default useCashDrawerMutation;