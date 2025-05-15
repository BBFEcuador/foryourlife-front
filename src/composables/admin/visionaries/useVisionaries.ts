import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Visionary } from '@/models/Visionary';
import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchVisionaries = async (): Promise<PageableApiResponse<Visionary[]>> => {
  const { data } = await api.get('/visionary', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value
    }
  });
  return data;
};

const useVisionaries = () => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['admin-visonaries', page, perPage, search],
    queryFn: fetchVisionaries,
    initialData: {
      numberOfElements: 0
    } as PageableApiResponse<Visionary[]>
  });
  return {
    visionariesData: data,
    isVisionariesError: isError,
    isVisionariesloading: isFetching,
    refetchVisionaries: refetch,
    page,
    perPage,
    search
  };
};

export default useVisionaries;
