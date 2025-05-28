import type { Discount } from "@/models/Discount";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const saveDiscount = async (discount: Discount): Promise<any> => {
    const { data } = await api.post('/product-discounts', discount);
    return data;
}


const updateDiscount = async (discount: Discount): Promise<any> => {
    const { data } = await api.post('/product-discounts', discount);
    return data;
}

const changeStatus = async (item: {
    id: string;
    status: boolean;
}): Promise<any> => {
    const { data } = await api.post('/product-discounts/change-status', item);
    return data;
};

const useDiscountMutations = () => {
    const saveDiscountMutations = useMutation({ mutationFn: saveDiscount });
    const updateDiscountMutations = useMutation({ mutationFn: updateDiscount });
    const changeStatusMutations = useMutation({ mutationFn: changeStatus });
    return {
        saveDiscountMutations,
        updateDiscountMutations,
        changeStatusMutations
    };
};

export default useDiscountMutations;