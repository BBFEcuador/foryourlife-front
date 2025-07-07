import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Product } from '@/models/Products';
import { adminStore } from '@/stores/adminStore';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, toValue, type MaybeRef } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchProducts = async (): Promise<PageableApiResponse<Product[]>> => {
    const params = {
        page: page.value,
        perPage: perPage.value,
        search: search.value,
        campusId: adminStore().selectCampusId
    }

    const { data } = await api.get('/product', {
        params: params
    });
    return data;
};

const useProducts = () => {
    const { data, isFetching, isError, refetch } = useQuery({
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
        productSearch: search,
        isProductsError: isError,
        isProductsLoading: isFetching,
        refetchProducts: refetch,
    };

};

export default useProducts;