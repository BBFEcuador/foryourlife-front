import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { TrainingData } from '@/models/Training';
import { adminStore } from '@/stores/adminStore';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { ref, watch, computed } from 'vue';

const store = adminStore();
const perPage = ref(10);
const search = ref('');
const debouncedSearch = ref('');

const fetchTraining = async ({ pageParam = 0 }): Promise<PageableApiResponse<TrainingData[]>> => {
  const { data } = await api.get('/admin/training', {
    params: {
      campusId: store.selectCampusId,
      page: pageParam,
      perPage: perPage.value,
      search: search.value
    }
  });
  return data;
};

const useTrainings = () => {
  const { data, isFetching, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['admins-trainings', perPage, search],
    queryFn: fetchTraining,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }

      return lastPage.number + 1;
    },
    initialPageParam: 0
  });

  const loadMoreTrainings = async () => {
    if (hasNextPage.value && !isFetchingNextPage.value) {
      await fetchNextPage();
    }
  };

  const retry = async () => {
    await refetch();
  };

  const trainings = computed(() => {
    if (!data.value?.pages) return [];

    return data.value.pages.reduce((acc, page) => {
      if (Array.isArray(page.content)) {
        return [...acc, ...page.content];
      }
      return acc;
    }, [] as TrainingData[]);
  });

  const hasMoreTrainings = computed(() => hasNextPage.value);

  const isLoadingMore = computed(() => isFetchingNextPage.value);

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  watch(debouncedSearch, (val) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      search.value = val;
    }, 400);
  });

  return {
    trainings,
    isTrainingsLoading: isFetching,
    isLoadingMore,
    isTrainingError: isError,
    hasMoreTrainings,
    debouncedSearch,
    perPage,
    loadMoreTrainings,
    retry
  };
};

export default useTrainings;
