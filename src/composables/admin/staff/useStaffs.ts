import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';

const fetchStaffs = async (): Promise<any[]> => {
  const { data } = await api.get('/staff');
  return data;
};

const useStaffs = () => {
  const { data, isError, isFetching, refetch } = useQuery({ queryKey: ['admin-staffs'], queryFn: fetchStaffs });

  return {
    staffData: data,
    isStaffError: isError,
    isStaffloading: isFetching,
    refetchStaff: refetch
  };
};

export default useStaffs;
