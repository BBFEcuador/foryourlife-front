import { api } from "@/api/axios";
import type { MedicalRecord } from "@/models/MedicalRecordParticipant";
import { useQuery } from "@tanstack/vue-query";
import { ref, watch } from "vue";

const medicalRecord = ref<MedicalRecord>({} as MedicalRecord);

const fetchMedicalRecord = async (id: string): Promise<MedicalRecord> => {
    const { data } = await api.get(`/medical-record/` + id);
    return data;
}

const useMedicalRecordParticipant = (id: string) => {
    const { data, isError, isFetching, error, refetch } = useQuery({
        queryKey: ['medical-record', id],
        queryFn: () => fetchMedicalRecord(id),
        gcTime: 0,
        retry: false,
    });
    watch(data, () => {
        if (data.value) {
            medicalRecord.value = JSON.parse(JSON.stringify(data.value));
        }
    });

    return {
        medicalRecord,
        isMedicalRecordError: isError,
        isMedicalRecordLoading: isFetching,
        medicalRecordError: error,
        refetchMedicalRecord: refetch,
    };
}

export default useMedicalRecordParticipant;