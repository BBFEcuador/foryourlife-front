import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Product } from '@/models/Products';
import { adminStore } from '@/stores/adminStore';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, toValue, watch, type MaybeRef } from 'vue';

const useProducts = () => {
    const page = ref(0);
    const perPage = ref(10);
    const search = ref('');
    const debouncedSearch = ref('');

    let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

    watch(debouncedSearch, (val) => {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            search.value = val;
        }, 400);
    });

    const fetchProducts = async (): Promise<PageableApiResponse<Product[]>> => {
        const params = {
            page: page.value,
            perPage: perPage.value,
            search: search.value,
            campusId: adminStore().selectCampusId
        };

        const { data } = await api.get('/product', { params });
        return data;
    };

    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ['admin-products-p', page, perPage, search],  // sólo valores primitivos
        queryFn: fetchProducts,
        initialData: {
            numberOfElements: 0,
        } as PageableApiResponse<Product[]>,
    });

    return {
        productsData: data,
        page,
        perPage,
        productSearch: debouncedSearch,
        isProductsError: isError,
        isProductsLoading: isFetching,
        refetchProducts: refetch,
    };
};

export default useProducts;