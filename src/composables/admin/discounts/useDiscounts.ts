import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Discount } from '@/models/Discount';
import { useDebounceFn } from '@vueuse/core';
import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');
const debouncedSearch = ref('');

const updateDebouncedSearch = useDebounceFn((value: string) => {
    debouncedSearch.value = value;
    page.value = 0;
}, 600);

const fetchDiscounts = async (): Promise<PageableApiResponse<Discount[]>> => {
    const { data } = await api.get('/product-discounts', {
        params: {
            page: page.value,
            perPage: perPage.value,
            search: debouncedSearch.value || undefined
        }
    });
    return data;
};

const useDiscounts = () => {
    const {
        data,
        isError,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ['admin-discounts-p', page, perPage, debouncedSearch],
        queryFn: fetchDiscounts,
        initialData: {
            numberOfElements: 0,
        } as PageableApiResponse<Discount[]>
    });
    // Función para actualizar la búsqueda
    const setSearch = (value: string) => {
        search.value = value;
        updateDebouncedSearch(value);
    };

    return {
        discountsData: data,
        page,
        perPage,
        search,
        setSearch,
        isDiscountsError: isError,
        isDiscountsLoading: isFetching,
        refetchDiscounts: refetch,
    };
};

export default useDiscounts;