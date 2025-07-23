import { api } from "@/api/axios";
import type { Invitation } from "@/models/Invitation";
import { useQuery } from "@tanstack/vue-query";
import { ref, watch } from "vue";

const invitation = ref<Invitation>({} as Invitation)

const fetchInvitationByToken = async (token: string): Promise<Invitation> => {
    const { data } = await api.get('/invitation/' + token);
    return data
}

const useInvitation = (token: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['invitation', token],
        queryFn: () => fetchInvitationByToken(token)
    })

    watch(data, () => {
        if (data.value) {
            invitation.value = JSON.parse(JSON.stringify(data.value));
        }
    });

    return {
        invitation,
        isInvitationLoading: isLoading,
        isInvitationError: isError,
        refetchInvitation: refetch
    }
}

export default useInvitation;