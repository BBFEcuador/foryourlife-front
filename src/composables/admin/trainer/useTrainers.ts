import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Trainers } from '@/models/Trainers';
import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchTrainers = async (): Promise<PageableApiResponse<Trainers[]>> => {
  const { data } = await api.get('/trainer', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value
    }
  });
  return data;
};

const useTrainer = () => {
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ['trainers', page, perPage, search],
    queryFn: fetchTrainers,
    initialData: {
      numberOfElements: 0
    } as PageableApiResponse<Trainers[]>
  });

  return {
    trainers: data,
    isFetching,
    isError,
    page,
    perPage,
    search,
    refetch
  };
};

export default useTrainer;
