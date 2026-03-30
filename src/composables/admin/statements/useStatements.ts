import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { StatementsTraining } from '@/models/Statements';
import { useQuery } from '@tanstack/vue-query';
import { ref, type Ref } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchStatements = async (id: Ref<string>): Promise<PageableApiResponse<StatementsTraining[]>> => {
  const { data } = await api.get(`/statements/${id.value}`, {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value
    }
  });
  return data;
};

const useStatements = (id: Ref<string>) => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['admin-statements', id, page, perPage, search],
    queryFn: () => fetchStatements(id),
    initialData: {
      numberOfElements: 0
    } as PageableApiResponse<StatementsTraining[]>
  });

  return {
    statementsData: data,
    isStatementError: isError,
    isStatementLoading: isFetching,
    refetchStatement: refetch,
    page,
    perPage,
    search
  };
};

export default useStatements;
