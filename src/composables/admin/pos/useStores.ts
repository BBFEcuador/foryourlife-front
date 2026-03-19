import { api } from "@/api/axios"
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Store } from "@/models/CashDrawer"
import { adminStore } from "@/stores/adminStore"
import { useInfiniteQuery } from '@tanstack/vue-query';
import { ref, watch, computed } from 'vue';

const store = adminStore();
const perPage = ref(10);
const search = ref('');
const debouncedSearch = ref('');

const fetchStores = async ({ pageParam = 0 }): Promise<PageableApiResponse<Store[]>> => {
    const { data } = await api.get('/store', {
        params: {
            campusId: store.selectCampusId || '',
            page: pageParam,
            perPage: perPage.value,
            search: search.value
        }
    });
    return data
}

const useStores = () => {
    const { data, isFetching, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
        queryKey: ['admin-stores-c', perPage, search],
        queryFn: fetchStores,
        getNextPageParam: (lastPage) => {
            if (lastPage.last) {
                return undefined;
            }

            return lastPage.number + 1;
        },
        initialPageParam: 0,
    });

    const loadMoreStores = async () => {
        if (hasNextPage.value && !isFetchingNextPage.value) {
            await fetchNextPage();
        }
    };

    const retry = async () => {
        await refetch();
    };

    const stores = computed(() => {
        if (!data.value?.pages) return [];

        return data.value.pages.reduce((acc, page) => {
            if (Array.isArray(page.content)) {
                return [...acc, ...page.content];
            }
            return acc;
        }, [] as Store[]);
    });
    const hasMoreStores = computed(() => hasNextPage.value);

    const isLoadingMore = computed(() => isFetchingNextPage.value);

    let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

    watch(debouncedSearch, (val) => {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            search.value = val;
        }, 400);
    });


    return {
        stores,
        isStoresLoading: isFetching,
        isLoadingMore,
        isStoreError: isError,
        hasMoreStores,
        debouncedSearch,
        perPage,
        loadMoreStores,
        retry
    }
}

export default useStores




// import { api } from "@/api/axios"
// import type { Store } from "@/models/CashDrawer"
// import { adminStore } from "@/stores/adminStore"
// import { useQuery } from "@tanstack/vue-query"
// import { computed } from "vue"

// const store = adminStore()

// const fetchStores = async (): Promise<Store[]> => {
//     const { data } = await api.get('/store/campus/' + store.selectCampusId)
//     return data
// }

// const useStores = () => {
//     const { data, isFetching, isError, refetch } = useQuery({
//         queryKey: ['admin-stores-c'],
//         queryFn: fetchStores,
//         initialData: [],
//         enabled: store.isCampusSelected
//     })

//     return {
//         storesData: data,
//         isStoresDataLoading: isFetching,
//         isStoresError: isError,
//         refetchStoresData: refetch
//     }
// }

// export default useStores