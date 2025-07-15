import type { BankAccountRequest } from "@/models/Payments";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const saveBankAccount = async (bankAccount: BankAccountRequest): Promise<any> => {
    const { data } = await api.post('/bank', bankAccount);
    return data;
}


const useBankAccountMutations = () => {
    const saveBankAccountMutation = useMutation({
        mutationFn: saveBankAccount
    });
    return {
        saveBankAccountMutation,
    };
};

export default useBankAccountMutations