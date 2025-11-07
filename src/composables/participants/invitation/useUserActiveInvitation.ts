import { AxiosError } from 'axios';
import { userApi } from '@/api/userAxios';
import type { Invitation } from '@/models/Invitation';
import { userStore } from '@/stores/useStore';
import { useQuery } from '@tanstack/vue-query';

const userSt = userStore();

const fetchActiveInvitations = async (): Promise<Invitation> => {
  const { data } = await userApi.get('/invitation/user/invitation/' + userSt.user.user.id);
  return data;
};

const useUserActiveInvitation = () => {
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryFn: fetchActiveInvitations,
    queryKey: ['participant-active-invitation'],
    retry: false,
    initialData: {} as Invitation
  });

  return { data, error, isError, isLoading, refetch };
};

export default useUserActiveInvitation;
