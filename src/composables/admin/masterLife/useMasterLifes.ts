import { useQuery } from '@tanstack/vue-query';
import { api } from '@/api/axios';
import type { MasterLife } from '@/models/MasterLife';
import { ref } from 'vue';
import type { PageableApiResponse } from '@/models/ApiResponse';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetch = async (): Promise<PageableApiResponse<MasterLife[]>> => {
  const { data } = await api.get('/master-life', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value
    }
  });
  return data;
};

const useMasterLifes = () => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryFn: fetch,
    queryKey: ['master-lifes', page, perPage, search],
    initialData: {
      numberOfElements: 0
    } as PageableApiResponse<MasterLife[]>
  });

  return {
    masterLifeData: data,
    isMasterLifeError: isError,
    isMasterLifeLoading: isFetching,
    refetchMasterLife: refetch,
    page,
    perPage,
    search
  };
};

export default useMasterLifes;
