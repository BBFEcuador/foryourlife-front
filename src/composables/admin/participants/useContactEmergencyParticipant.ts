import { api } from "@/api/axios";
import type { ContactEmergency } from "@/models/ContactEmergencyParticipant";
import { useQuery } from "@tanstack/vue-query";
import { ref, watch } from "vue";

const fetchContactEmergency = async (id: string): Promise<ContactEmergency[]> => {
    const { data } = await api.get(`/contacts/` + id);
    return data;
}

const useContactEmergencyParticipant = (id: string) => {
    const { data, isError, isFetching, error, refetch } = useQuery({
        queryKey: ['contact-emergency', id],
        queryFn: () => fetchContactEmergency(id),
        gcTime: 0,
    });
    // watch(data, () => {
    //     if (data.value) {
    //         contactEmergency.value = JSON.parse(JSON.stringify(data.value));
    //     }
    // });

    return {
        contactEmergency: data,
        isContactEmergencyError: isError,
        isContactEmergencyLoading: isFetching,
        contactEmergencyError: error,
        refetchContactEmergency: refetch,
    };
}

export default useContactEmergencyParticipant;