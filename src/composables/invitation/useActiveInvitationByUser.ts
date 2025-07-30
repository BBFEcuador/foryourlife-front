import { api } from '@/api/axios';
import type { Invitation } from '@/models/Invitation';
import { useQuery } from '@tanstack/vue-query';

const fetchActiveInvitationsById = async (id: string): Promise<Invitation> => {
    const { data } = await api.get('/invitation/user/invitation/' + id);
    return data;
};

const useUserActiveInvitation = (id: string) => {
    const { data, error, isError, isLoading, refetch } = useQuery({
        queryFn: () => fetchActiveInvitationsById(id),
        queryKey: ['participant-active-invitation'],
        retry: false,
        initialData: {} as Invitation
    });

    return { data, error, isError, isLoading, refetch };

};

export default useUserActiveInvitation;
