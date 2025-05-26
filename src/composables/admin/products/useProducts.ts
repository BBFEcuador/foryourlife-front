import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Product } from '@/models/Products';
import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchProducts = async (): Promise<PageableApiResponse<Product[]>> => {
    const { data } = await api.get('/product', {
        params: {
            page: page.value,
            perPage: perPage.value,
            search: search.value || undefined
        }
    });
    return data;
};

const useProducts = () => {
    const {
        data,
        isError,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ['admin-products-p', page, perPage, search],
        queryFn: fetchProducts,
        initialData: {
            totalElements: 0,
        } as PageableApiResponse<Product[]>
    });
    return {
        productsData: data,
        page,
        perPage,
        search,
        isProductsError: isError,
        isProductsLoading: isFetching,
        refetchProducts: refetch,
    };
};

export default useProducts;