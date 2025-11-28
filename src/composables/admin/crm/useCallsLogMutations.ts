import type { CallsLogRequest } from "@/models/CallsTraining";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const saveCallsTraining = async (callsLog: CallsLogRequest): Promise<string> => {
    const { data } = await api.post('/call-log', callsLog);
    return data;
}

const useCallsLogMutations = () => {
    const saveCallsLogMutations = useMutation({
        mutationFn: saveCallsTraining
    });
    return {
        saveCallsLogMutations,
    };
};

export default useCallsLogMutations;