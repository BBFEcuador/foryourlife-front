import type { Product } from "@/models/Products";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const saveProduct = async (product: Product): Promise<any> => {
    const { data } = await api.post('/product', product);
    return data;
}

const updateProduct = async (product: Product): Promise<any> => {
    const { data } = await api.put('/product', product);
    return data;
}

const changeStatus = async (item: Product): Promise<any> => {
    const { data } = await api.patch('/product/' + item.id, item);
    return data;
};

const useProductMutations = () => {
    const saveProductMutations = useMutation({ mutationFn: saveProduct });
    const updateProductMutations = useMutation({ mutationFn: updateProduct });
    const changeStatusMutations = useMutation({ mutationFn: changeStatus });
    return {
        saveProductMutations,
        updateProductMutations,
        changeStatusMutations
    };
};

export default useProductMutations;