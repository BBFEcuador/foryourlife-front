import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { StaffWriteModel } from '@/models/Staff';
import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchStaffs = async (): Promise<PageableApiResponse<StaffWriteModel[]>> => {
  const { data } = await api.get('/staff', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value
    }
  });
  return data;
};

const useStaffs = () => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['admin-staffs', page, perPage, search],
    queryFn: fetchStaffs,
    initialData: {
      numberOfElements: 0
    } as PageableApiResponse<StaffWriteModel[]>
  });

  return {
    staffData: data,
    isStaffError: isError,
    isStaffloading: isFetching,
    refetchStaff: refetch,
    page,
    perPage,
    search
  };
};

export default useStaffs;
