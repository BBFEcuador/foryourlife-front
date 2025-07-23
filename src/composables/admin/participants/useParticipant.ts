import { api } from "@/api/axios";
import type { Participant } from "@/models/Participants";
import { useQuery } from "@tanstack/vue-query";
import { ref, watch } from "vue";

const participant = ref<Participant>({} as Participant);

const fetchParticipant = async (id: string): Promise<Participant> => {
    const { data } = await api.get(`/users/` + id);
    return data;
}

const useParticipant = (id: string) => {
    const { data, isError, isFetching } = useQuery({
        queryKey: ['participant', id],
        queryFn: () => fetchParticipant(id),
        gcTime: 0,
    });
    watch(data, () => {
        if (data.value) {
            participant.value = JSON.parse(JSON.stringify(data.value));
        }
    });

    return {
        participant,
        isParticipantError: isError,
        isParticipantLoading: isFetching,
    };
}

export default useParticipant;