import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Product } from '@/models/Products';
import { adminStore } from '@/stores/adminStore';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, toValue, watch, type MaybeRef } from 'vue';

const useAvailableProducts = (campusId?: MaybeRef<string>) => {
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

    const fetchAvailableProducts = async (): Promise<PageableApiResponse<Product[]>> => {
        const params = {
            page: page.value,
            perPage: perPage.value,
            search: search.value,
            campusId: toValue(campusId) ?? ''
        }

        const { data } = await api.get('/product/available', { params });
        return data;
    };


    const queryKey = computed(() => [
        'admin-available-products-p',
        page.value,
        perPage.value,
        search.value,
        toValue(campusId)
    ]);

    const { data, isFetching, isError, refetch } = useQuery({
        queryKey,
        queryFn: fetchAvailableProducts,
        initialData: {
            numberOfElements: 0,
        } as PageableApiResponse<Product[]>,
        gcTime: 0
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

export default useAvailableProducts;